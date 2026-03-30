def calculate_risk_premium(platform: str, zone: str) -> dict:
    """
    Simulates an AI Risk Scoring engine.
    In production, this would use a proper ML model (like LightGBM)
    trained on historical disruption data and live weather/traffic forecasts.
    """
    
    # Base Premium structure
    base_premium = 149.0
    
    risk_adjustment = 0.0
    risk_factors = []
    recommended_triggers = []

    # Platform specific logic
    if platform.lower() in ["zomato", "swiggy"]:
        recommended_triggers.extend(["Rainfall Displacement", "Extreme Heat"])
        # Dynamic Risk Scoring based on historical zone density/data (simulated)
        if len(zone) % 2 == 0: 
            risk_adjustment += 25.0
            risk_factors.append("High Urban Density Risk (+₹25)")
        else:
            risk_adjustment -= 10.0
            risk_factors.append("Standard Risk Zone (-₹10)")

    elif platform.lower() in ["amazon", "flipkart"]:
        recommended_triggers.append("Area Lockout / Curfew")
        base_premium = 199.0 
        if len(zone) > 0:
            risk_adjustment += 15.0
            risk_factors.append("Dynamic Area Risk Adjustment (+₹15)")
    
    elif platform.lower() in ["zepto", "blinkit"]:
        recommended_triggers.extend(["AQI > 300", "Traffic Gridlock"])
        base_premium = 129.0
        if len(zone) > 8:
             risk_adjustment += 40.0
             risk_factors.append("Localized Disruption Volatility (+₹40)")

    final_premium = round(base_premium + risk_adjustment, 2)
    
    return {
        "base_premium": base_premium,
        "risk_adjustment": risk_adjustment,
        "final_weekly_premium": final_premium,
        "recommended_triggers": recommended_triggers,
        "risk_factors": risk_factors
    }
