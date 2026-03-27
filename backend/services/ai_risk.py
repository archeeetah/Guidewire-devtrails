def calculate_risk_premium(platform: str, zone: str) -> dict:
    """
    Simulates an AI Risk Scoring engine.
    In production, this would use a proper ML model (like LightGBM)
    trained on historical disruption data and live weather/traffic forecasts.
    """
    
    # Base Premium structure based on README example
    base_premium = 149.0
    
    risk_adjustment = 0.0
    risk_factors = []
    recommended_triggers = []

    # Platform specific mock risk logic
    if platform.lower() in ["zomato", "swiggy"]:
        # Food delivery: High sensitivity to Rain and Heat
        recommended_triggers.extend(["Rainfall Displacement", "Extreme Heat"])
        if zone.lower() in ["andheri", "koramangala"]: # Mock flood-prone zones
            risk_adjustment += 25.0
            risk_factors.append("High Flood Risk Zone (+₹25)")
        else:
            risk_adjustment -= 10.0
            risk_factors.append("Safe Zone Discount (-₹10)")

    elif platform.lower() in ["amazon", "flipkart"]:
        # Logistics: High sensitivity to Social Disruption and Lockouts
        recommended_triggers.append("Area Lockout / Curfew")
        base_premium = 199.0 # Logistics base might be slightly higher due to larger loads
        if zone.lower() in ["dharavi", "seelampur"]:
            risk_adjustment += 30.0
            risk_factors.append("High Social Disruption Probability (+₹30)")
    
    elif platform.lower() in ["zepto", "blinkit"]:
        # Q-Commerce: High sensitivity to AQI and localized blockages
        recommended_triggers.extend(["AQI > 300", "Traffic Gridlock"])
        base_premium = 129.0
        # Mock specific AQI rule based on reading
        if zone.lower() == "delhi-ncr":
             risk_adjustment += 40.0
             risk_factors.append("Severe AQI Forecast Volatility (+₹40)")

    final_premium = round(base_premium + risk_adjustment, 2)
    
    return {
        "base_premium": base_premium,
        "risk_adjustment": risk_adjustment,
        "final_weekly_premium": final_premium,
        "recommended_triggers": recommended_triggers,
        "risk_factors": risk_factors
    }
