from sqlalchemy import create_engine, text
from core.database import engine

def migrate():
    with engine.connect() as conn:
        print("Starting manual database migration for 'payouts' table...")
        
        columns_to_add = [
            ("payout_status", "VARCHAR DEFAULT 'PROCESSING'"),
            ("transaction_id", "VARCHAR UNIQUE"),
            ("payment_method", "VARCHAR DEFAULT 'UPI'"),
            ("confidence_score", "FLOAT DEFAULT 1.0")
        ]
        
        for col_name, col_type in columns_to_add:
            try:
                conn.execute(text(f"ALTER TABLE payouts ADD COLUMN {col_name} {col_type}"))
                print(f" - Added column: {col_name}")
            except Exception as e:
                if "duplicate column name" in str(e).lower():
                    print(f" - Column {col_name} already exists. Skipping.")
                else:
                    print(f" - FAILED adding {col_name}: {e}")
        
        conn.commit()
        print("Migration complete! ✅")

if __name__ == "__main__":
    migrate()
