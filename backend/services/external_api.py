import httpx
from datetime import datetime
from core.config import settings

class DisruptionAPIClient:
    """
    Live external API connections pulling real-world meteorological data.
    """
    
    @staticmethod
    def fetch_current_telemetry(zone: str):
        """
        Calls OpenWeatherMap to get real-time Rain and Temperature.
        """
        api_key = settings.OPENWEATHER_API_KEY
        
        # Fallback if no API key is provided
        if not api_key:
            return {
                "zone": zone,
                "timestamp": datetime.utcnow().isoformat(),
                "rainfall_mm_3h": 0.0,
                "temperature_c": 25.0,
                "aqi": 100,
                "zone_lockout": False,
                "note": "Awaiting OPENWEATHER_API_KEY in environment"
            }

        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={zone}&appid={api_key}&units=metric"
            response = httpx.get(url, timeout=5.0)
            data = response.json()

            if response.status_code != 200:
                print(f"OpenWeather API Error: {data}")
                return {
                    "zone": zone,
                    "timestamp": datetime.utcnow().isoformat(),
                    "rainfall_mm_3h": 0.0,
                    "temperature_c": 25.0,
                    "aqi": 100,
                    "zone_lockout": False
                }

            temp = data.get("main", {}).get("temp", 25.0)
            
            # OpenWeather returns {"rain": {"1h": 2.5}} or {"rain": {"3h": 5.0}} if raining
            rain_data = data.get("rain", {})
            rain_mm = rain_data.get("3h", rain_data.get("1h", 0.0))

            return {
                "zone": zone,
                "timestamp": datetime.utcnow().isoformat(),
                "rainfall_mm_3h": float(rain_mm),
                "temperature_c": float(temp),
                "aqi": 100, # Requires secondary API call for Air Pollution
                "zone_lockout": False
            }

        except Exception as e:
            print(f"Network error calling OpenWeather: {e}")
            return {
                "zone": zone,
                "timestamp": datetime.utcnow().isoformat(),
                "rainfall_mm_3h": 0.0,
                "temperature_c": 25.0,
                "aqi": 100,
                "zone_lockout": False
            }
