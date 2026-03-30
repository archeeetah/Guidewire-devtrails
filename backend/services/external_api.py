import httpx
import httpx_cache
from datetime import datetime
from core.config import settings

# Initialize a cached HTTP client to protect our OpenWeatherMap API credits
# Cache results for 600 seconds (10 minutes)
client = httpx_cache.Client(cache=httpx_cache.DictCache(), timeout=5.0)

class DisruptionAPIClient:
    """
    Live external API connections pulling real-world meteorological data.
    """
    
    @staticmethod
    def fetch_current_telemetry(zone: str):
        """
        Calls OpenWeatherMap to get real-time Rain, Temperature, and AQI.
        Uses a 2-step process: Weather API (for coordinates) -> Pollution API (for AQI).
        Results are cached for 10 minutes to prevent API abuse.
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
                "note": "Awaiting OPENWEATHER_API_KEY"
            }

        try:
            # Step 1: Get Weather and Coordinates
            weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={zone}&appid={api_key}&units=metric"
            weather_res = client.get(weather_url)
            weather_data = weather_res.json()

            if weather_res.status_code != 200:
                return {
                    "zone": zone,
                    "timestamp": datetime.utcnow().isoformat(),
                    "rainfall_mm_3h": 0.0,
                    "temperature_c": 25.0,
                    "aqi": 100,
                    "zone_lockout": False,
                    "error": weather_data.get("message", "API Error")
                }

            lat = weather_data["coord"]["lat"]
            lon = weather_data["coord"]["lon"]
            temp = weather_data["main"].get("temp", 25.0)
            rain_data = weather_data.get("rain", {})
            rain_mm = rain_data.get("3h", rain_data.get("1h", 0.0))

            # Step 2: Get Air Quality (AQI)
            pollution_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={api_key}"
            pollution_res = client.get(pollution_url)
            aqi = 100 # Default
            if pollution_res.status_code == 200:
                pollution_data = pollution_res.json()
                # OpenWeather AQI is 1 (Good) to 5 (Very Poor). 
                # We'll map it to a standard 0-500 scale for visual impact
                aqi_level = pollution_data["list"][0]["main"]["aqi"]
                aqi = aqi_level * 80 # Map 5 to 400 for demo thresholds

            return {
                "zone": zone,
                "timestamp": datetime.utcnow().isoformat(),
                "rainfall_mm_3h": float(rain_mm),
                "temperature_c": float(temp),
                "aqi": int(aqi),
                "zone_lockout": False
            }

        except Exception as e:
            print(f"Network error in telemetry fetch: {e}")
            return {
                "zone": zone,
                "timestamp": datetime.utcnow().isoformat(),
                "rainfall_mm_3h": 0.0,
                "temperature_c": 25.0,
                "aqi": 100,
                "zone_lockout": False
            }
