export async function getLocation(address) {
    try {
        const apiKey = process.env.LOCATIONIQ_API_KEY;
        
        // 1. Fail fast if the API key is missing
        if (!apiKey) {
            throw new Error("LOCATIONIQ_API_KEY is missing from environment variables.");
        }

        const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(address)}&format=json&limit=1`;
        const response = await fetch(url);

        // 2. Extract the REAL error from the API if it fails
        if (!response.ok) {
            let errorDetails = response.statusText;
            try {
                const errorData = await response.json();
                errorDetails = errorData.error || errorDetails;
            } catch (e) {
                // Ignore JSON parse errors if the API sends back plain text/HTML
            }
            throw new Error(`LocationIQ API Error (${response.status}): ${errorDetails}`);
        }

        const data = await response.json();

        if (!data || !data.length) {
            console.log(`[Geolocation] No results found for address: "${address}"`);
            return null;
        }

        return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon)
        };

    } catch (error) {
        // 3. Improve traceability by including the address we tried to look up
        console.error(`[Geolocation - getLocation] Failed for address "${address}":`, error.message);
        throw error; 
    }
}