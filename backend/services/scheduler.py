import json
import logging
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from core.database import SessionLocal
from core.config import settings
from models.user import User
from models.policy import Policy
from models.telemetry_log import TelemetryScanLog
from services.trigger_engine import evaluate_disrupted_zones

logger = logging.getLogger("shramshield.scheduler")

# In-memory status tracker (read by the monitoring API)
scheduler_status = {
    "is_running": False,
    "last_scan_at": None,
    "next_scan_at": None,
    "total_scans": 0,
    "total_auto_payouts": 0,
    "zones_monitored": 0,
    "last_scan_results": []
}

# Module-level scheduler instance
_scheduler: BackgroundScheduler | None = None


def _run_telemetry_scan():
    """
    Core scan job: finds all unique zones with active policies,
    evaluates each zone through the parametric trigger engine,
    and logs the results to the TelemetryScanLog table.
    """
    db: Session = SessionLocal()
    scan_results = []

    try:
        # Find all unique zones that have at least one active policy
        active_zones = (
            db.query(User.primary_zone)
            .join(Policy, User.id == Policy.user_id)
            .filter(Policy.is_active == True)
            .distinct()
            .all()
        )

        zone_list = [z[0] for z in active_zones if z[0]]
        scheduler_status["zones_monitored"] = len(zone_list)

        if not zone_list:
            logger.info("Automated scan: No active policy zones to monitor.")
            scheduler_status["last_scan_at"] = datetime.utcnow().isoformat()
            scheduler_status["total_scans"] += 1
            scheduler_status["last_scan_results"] = []
            return

        logger.info(f"Automated scan: Evaluating {len(zone_list)} zone(s): {zone_list}")

        for zone in zone_list:
            try:
                result = evaluate_disrupted_zones(db, zone)

                payouts_count = len(result.get("payouts", []))
                status = result.get("status", "success")
                telemetry = result.get("telemetry", {})

                # Log to database
                log_entry = TelemetryScanLog(
                    zone=zone,
                    scan_type="automated",
                    status="disrupted" if status == "disrupted" else "clear",
                    triggers_fired=payouts_count,
                    telemetry_snapshot=json.dumps(telemetry)
                )
                db.add(log_entry)

                scan_results.append({
                    "zone": zone,
                    "status": status,
                    "payouts": payouts_count,
                    "telemetry": telemetry
                })

                scheduler_status["total_auto_payouts"] += payouts_count

                if status == "disrupted":
                    logger.warning(
                        f"DISRUPTION in {zone}: {payouts_count} payout(s) auto-triggered!"
                    )
                else:
                    logger.info(f"Zone {zone}: Clear — no thresholds breached.")

            except Exception as zone_err:
                logger.error(f"Error scanning zone '{zone}': {zone_err}")
                scan_results.append({
                    "zone": zone,
                    "status": "error",
                    "payouts": 0,
                    "error": str(zone_err)
                })

        db.commit()

        # Update in-memory status
        scheduler_status["last_scan_at"] = datetime.utcnow().isoformat()
        scheduler_status["total_scans"] += 1
        scheduler_status["last_scan_results"] = scan_results

    except Exception as e:
        logger.error(f"Automated telemetry scan failed: {e}")
        db.rollback()
    finally:
        db.close()


def start_scheduler():
    """Initialize and start the background scheduler."""
    global _scheduler

    if _scheduler and _scheduler.running:
        logger.info("Scheduler is already running.")
        return

    _scheduler = BackgroundScheduler(daemon=True)
    _scheduler.add_job(
        _run_telemetry_scan,
        trigger="interval",
        minutes=settings.SCAN_INTERVAL_MINUTES,
        id="telemetry_scan",
        replace_existing=True,
        max_instances=1,
        next_run_time=datetime.utcnow()  # Run immediately on startup too
    )
    _scheduler.start()
    scheduler_status["is_running"] = True

    # Capture next scheduled run time
    job = _scheduler.get_job("telemetry_scan")
    if job and job.next_run_time:
        scheduler_status["next_scan_at"] = job.next_run_time.isoformat()

    logger.info(
        f"ShramShield Autonomous Scanner STARTED "
        f"(interval: {settings.SCAN_INTERVAL_MINUTES} min)"
    )


def stop_scheduler():
    """Gracefully shut down the background scheduler."""
    global _scheduler

    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
        scheduler_status["is_running"] = False
        scheduler_status["next_scan_at"] = None
        logger.info("ShramShield Autonomous Scanner STOPPED.")
    else:
        logger.info("Scheduler is not running.")


def get_scheduler_status() -> dict:
    """Return the current scheduler status for the monitoring API."""
    global _scheduler

    # Refresh next_scan_at from the live scheduler
    if _scheduler and _scheduler.running:
        job = _scheduler.get_job("telemetry_scan")
        if job and job.next_run_time:
            scheduler_status["next_scan_at"] = job.next_run_time.isoformat()

    return scheduler_status.copy()
