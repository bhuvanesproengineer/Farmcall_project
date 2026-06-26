export async function getWeatherData(latitude, longitude) {
    // 1. Validate inputs before doing anything
    if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
        throw new Error(`[WeatherService] Invalid coordinates provided: lat=${latitude}, lon=${longitude}`);
    }

    const api_key = process.env.TOMORROW_API_KEY;
    
    // 2. Fail fast if the API key is missing
    if (!api_key) {
        throw new Error("[WeatherService] TOMORROW_API_KEY is missing from environment variables.");
    }

    const fields = [
        "temperature",
        "humidity",
        "windSpeed",
        "precipitationProbability",
        "rainIntensity",
        "cloudCover",
        "dewPoint"
    ].join(",");

    try {
        const response = await fetch(
            `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=${fields}&timesteps=1h&units=metric&apikey=${api_key}`
        );

        // 3. Extract the REAL error from Tomorrow.io
        if (!response.ok) {
            let errorDetails = response.statusText;
            try {
                const errorData = await response.json();
                // Tomorrow.io usually puts errors in a "message" or "type" field
                errorDetails = errorData.message || JSON.stringify(errorData) || errorDetails;
            } catch (e) {
                // Ignore parsing errors
            }
            throw new Error(`Tomorrow.io API Error (${response.status}): ${errorDetails}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        // 4. Improve traceability by logging the coordinates
        console.error(`[WeatherService - getWeatherData] Failed for coordinates (${latitude}, ${longitude}):`, error.message);
        throw error;
    }
}