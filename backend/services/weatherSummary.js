    export function getDailyDewPhases(weatherData, targetDateStr = null) {
        const intervals = weatherData?.data?.timelines?.[0]?.intervals || [];
        
        // Initialize all phases to false (Dry, no dew)
        const phases = {
            morningDew: false,   // 06:00 - 09:59 (IST)
            afternoonDew: false, // 10:00 - 13:59 (IST)
            eveningDew: false,   // 14:00 - 17:59 (IST)
            nightDew: false      // 18:00 - 05:59 (Next day IST)
        };

        // IST Offset in milliseconds: 5.5 hours * 60 mins * 60 secs * 1000 ms
        const IST_OFFSET_MS = 19800000;

        // Default to today IN IST if no date is provided
        if (!targetDateStr) {
            const nowUtc = new Date();
            const nowIst = new Date(nowUtc.getTime() + IST_OFFSET_MS);
            targetDateStr = nowIst.toISOString().split('T')[0];
        }

        const targetDateObj = new Date(targetDateStr);
        targetDateObj.setDate(targetDateObj.getDate() + 1);
        const tomorrowStr = targetDateObj.toISOString().split('T')[0];

        for (let i = 0; i < intervals.length; i++) {
            // OPTIMIZATION 1: Early Exit. If all phases already have dew, stop looping.
            if (phases.morningDew && phases.afternoonDew && phases.eveningDew && phases.nightDew) {
                break;
            }

            const values = intervals[i].values;
            const temp = values.temperature;
            const dewPoint = values.dewPoint;
            const weatherCode = values.weatherCode;

            // THE DEW LOGIC: Check for Tomorrow.io fog codes OR a gap of 1.5 degrees or less
            const hasFog = (weatherCode === 2000 || weatherCode === 2100);
            const gap = temp - dewPoint;
            const isDewing = hasFog || (gap <= 1.5);
            
            // OPTIMIZATION 2: Skip expensive Date parsing if the leaves are dry
            if (!isDewing) continue;

            // --- IST TIME CONVERSION ---
            const utcTime = new Date(intervals[i].startTime);
            const istTime = new Date(utcTime.getTime() + IST_OFFSET_MS);
            
            const dateStr = istTime.toISOString().split('T')[0];
            const hour = istTime.getUTCHours(); 

            // Categorize the dew into the correct time block
            if (dateStr === targetDateStr) {
                if (hour >= 6 && hour < 10) phases.morningDew = true;
                else if (hour >= 10 && hour < 14) phases.afternoonDew = true;
                else if (hour >= 14 && hour < 18) phases.eveningDew = true;
                else if (hour >= 18) phases.nightDew = true;
            } else if (dateStr === tomorrowStr && hour < 6) {
                phases.nightDew = true;
            }
        }

        return phases;
    }
    export function generateFinalSummary(spray, irrigation, cropCover, harvest, sowing) {
    return `
--- FARM SUMMARY REPORT ---
Spray Decision: ${spray}
Irrigation: ${irrigation}
Crop Cover: ${cropCover}
Harvest Readiness: ${harvest}
Sowing Advice: ${sowing}
---------------------------`.trim();
}
    /**
     * Processes weather data to determine harvest readiness.
     * Returns true if the day is clear (intensity 0), false otherwise.
     */
    function getHarvestReadiness(weatherData) {
        // 1. Get the intervals array (usually timelines[0].intervals)
        const intervals = weatherData.data.timelines[0].intervals;

        let d1 = 0, d2 = 0, d3 = 0;

        // 2. Iterate through the first 72 hours (assuming 1h timestep)
        for (let i = 0; i < 72; i++) {
            // Safe access: Use optional chaining (?.) to prevent crashes
            const rainIntensity = intervals[i]?.values?.rainIntensity || 0;

            if (i < 24) d1 += rainIntensity;
            else if (i < 48) d2 += rainIntensity;
            else d3 += rainIntensity;
        }

        const status = {
            day1: d1 === 0,
            day2: d2 === 0,
            day3: d3 === 0
        };

    

    
        const isHarvestReady = status.day1 && status.day2 && status.day3;

        
        // A more informative version for your future updates
    if (isHarvestReady) {
        return "Right time to  harvest! There is no rain expected upcoming days and Conditions are clear for the next 3 days.";
    } else {
        // You could even customize this to say: "Rain is expected on Day X"
        return " Delay the harvest. Rain is expected in the upcoming days.";
    }
    }
    function getSowingRecommendation(weatherData, mediumThreshold = 5.0) {
        const intervals = weatherData.data.timelines[0].intervals;
        
        let peakD1 = 0, peakD2 = 0, peakD3 = 0;

        for (let i = 0; i < 72; i++) {
            const intensity = intervals[i]?.values?.rainIntensity || 0;
            
            if (i < 24) peakD1 = Math.max(peakD1, intensity);
            else if (i < 48) peakD2 = Math.max(peakD2, intensity);
            else peakD3 = Math.max(peakD3, intensity);
        }

        const isHeavyRain = (peakD1 > mediumThreshold || peakD2 > mediumThreshold || peakD3 > mediumThreshold);
        const isCompletelyDry = (peakD1 === 0 && peakD2 === 0 && peakD3 === 0);

        // Final decision output
        if (isHeavyRain) {
            return "Don't sow the seeds; heavy rain is expected in the upcoming days.";
        } else if (isCompletelyDry) {
            return "Don't sow the seeds; conditions are completely dry in the upcoming days, seeds may fail to germinate.";
        } else {
            return "Light to moderate rain is expected in the upcoming days. This is an ideal time to sow your seeds.";
        }
    }
    export function getIrrigationDecision(rainPhases) {
        // 1. Destructure the rain phases to see what parts of the day are wet
        const { 
            morningRain, 
            afternoonRain, 
            eveningRain, 
            nightRain 
        } = rainPhases;

        // 2. Check if there is ANY risk of rain throughout the day or night
        const hasRainRisk = morningRain || afternoonRain || eveningRain || nightRain;

        // 3. Decision Making 
        
        if (hasRainRisk) {
        
            return  'Rain is expected today. Hold off on irrigation anyway rain is expected today.'
            
        } else {
            return  'Conditions are dry with no rain expected. Proceed with your regular irrigation schedule to maintain proper soil moisture.'
            
        }
    }
    export function getCropCoverDecision(rainPhases, dewPhases) {
        // 1. Destructure all the rain phases
        const { 
            morningRain, 
            afternoonRain, 
            eveningRain, 
            nightRain 
        } = rainPhases;

        // 2. Destructure all the dew phases
        const { 
            morningDew, 
            afternoonDew, 
            eveningDew, 
            nightDew 
        } = dewPhases;

        // 3. Check if there is ANY risk of rain throughout the day or night
        const hasRainRisk = morningRain || afternoonRain || eveningRain || nightRain;

        // 4. Check if there is ANY risk of heavy dew (mostly a morning/night issue)
        const hasDewRisk = morningDew || afternoonDew || eveningDew || nightDew;

        // 5. Decision Making Logic
        
        // Worst case: Both rain and dew are expected
    if (hasRainRisk && hasDewRisk) {
            return  'High moisture risk. Both rain and heavy dew are expected. Cover crops immediately and ensure proper field drainage to prevent waterlogging and rot.'
        
        } 
        // Bad case: Rain is expecgted
        else if (hasRainRisk) {
            return 'Rain is expected. Keep harvested crops covered and clear drainage channels to avoid waterlogging, flooding, and moisture damage.'
            
        } 
        // Moderate case: No rain, but heavy dew will soak the crops
        else if (hasDewRisk) {
            return 'Heavy dew is expected. Cover crops overnight/early morning to prevent them from acting like a sponge and absorbing moisture.'
        
        } 
        // Best case: Completely dry 24-hour window
        else {
            
            return 'Conditions are completely clear and dry. It is safe to leave harvested crops uncovered.'
        
        }
    }
    export function getSprayDecision(phases, weatherData) {
    const { morningRain, afternoonRain, eveningRain } = phases;

    // 1. ALL CLEAR (1 scenario)
    if (!morningRain && !afternoonRain && !eveningRain) {
        const dewPhases = getDailyDewPhases(weatherData);
        if(dewPhases.morningDew){
            return 'Safe to spray. Spray late morning due to the dew.';
        } else {
            return 'Safe to spray. No rain detected. Spray in the morning or evening due to temperatures.';
        }
    } 
    // 2. ALL WET (1 scenario)
    else if (morningRain && afternoonRain && eveningRain) {
        return 'NO SPRAY. Raining all day. Zero chance to dry.';
    } 
    // 3. EVENING RAIN ONLY (1 scenario)
    else if (!morningRain && !afternoonRain && eveningRain) {
        return 'Safe to spray in the morning and afternoon. DO NOT spray in the evening, because rain is expected in the evening.';
    } 
    // 4. MORNING RAIN ONLY (1 scenario)
    else if (morningRain && !afternoonRain && !eveningRain) {
        return 'Safe to spray in the afternoon and evening. DO NOT spray in the morning, because rain is expected in the morning.';
    }  
    // 5. AFTERNOON RAIN ONLY (1 scenario)
    else if (!morningRain && afternoonRain && !eveningRain) {
        return 'Do not spray. Rain is expected in the afternoon, and the spray may be washed away. Wait for a dry day before spraying.';
    }
    // 6. MULTIPLE RAIN PHASES / VOLATILE WEATHER (3 scenarios)
    // Covers: (Wet, Wet, Dry), (Dry, Wet, Wet), and (Wet, Dry, Wet)
    else {
        return 'Do not spray pesticides today. Rain is expected at different times during the day, and the spray may be washed away. Wait for a dry day before spraying.';   }
}

    export function getDailyRainPhases(weatherData, targetDateStr = null) {
        const intervals = weatherData?.data?.timelines?.[0]?.intervals || [];
        
        // Initialize all phases to false (No rain)
        const phases = {
            morningRain: false,   // 06:00 - 09:59 (IST)
            afternoonRain: false, // 10:00 - 13:59 (IST)
            eveningRain: false,   // 14:00 - 17:59 (IST)
            nightRain: false      // 18:00 - 05:59 (Next day IST)
        };

        // IST Offset in milliseconds: 5.5 hours * 60 mins * 60 secs * 1000 ms
        const IST_OFFSET_MS = 19800000;

        // Default to today IN IST if no date is provided
        if (!targetDateStr) {
            const nowUtc = new Date();
            const nowIst = new Date(nowUtc.getTime() + IST_OFFSET_MS);
            targetDateStr = nowIst.toISOString().split('T')[0];
        }

        // Pre-calculate tomorrow's date string
        const targetDateObj = new Date(targetDateStr);
        targetDateObj.setDate(targetDateObj.getDate() + 1);
        const tomorrowStr = targetDateObj.toISOString().split('T')[0];

        for (let i = 0; i < intervals.length; i++) {
            // OPTIMIZATION 1: Early Exit.
            if (phases.morningRain && phases.afternoonRain && phases.eveningRain && phases.nightRain) {
                break;
            }

            const intensity = intervals[i].values.rainIntensity ?? 0;
            
            
            // OPTIMIZATION 2: Skip expensive Date parsing if there is no rain
            if (intensity < 0.1) continue;
     // --- IST TIME CONVERSION ---
            const utcTime = new Date(intervals[i].startTime);
            
            // Shift the UTC time forward by 5 hours and 30 minutes
            const istTime = new Date(utcTime.getTime() + IST_OFFSET_MS);
            
            // Because we manually shifted the time, we use getUTC* to extract the correct IST values
            const dateStr = istTime.toISOString().split('T')[0];
            const hour = istTime.getUTCHours(); 

            // Categorize the rain into the correct time block
            if (dateStr === targetDateStr) {
                if (hour >= 6 && hour <= 11) phases.morningRain = true;
                else if (hour > 11 && hour < 15) phases.afternoonRain = true;
                else if (hour >= 15 && hour <= 18) phases.eveningRain = true;
                else if (hour > 18) phases.nightRain = true;
            } else if (dateStr === tomorrowStr && hour < 6) {
                // Handle the second half of the night shift spanning into tomorrow
                phases.nightRain = true;
            }
        }
        

        return phases;
    }
 
 export async function getWeatherSummary(weatherData) {
    const rain_phase_result = getDailyRainPhases(weatherData);
    const dew_phase_result = getDailyDewPhases(weatherData);
    
    // Get the decisions
    const spray = getSprayDecision(rain_phase_result, weatherData);
    const irrigation = getIrrigationDecision(rain_phase_result);
    const cropCover = getCropCoverDecision(rain_phase_result, dew_phase_result);
    const harvest = getHarvestReadiness(weatherData);
    const sowing = getSowingRecommendation(weatherData);

    // Combine them into one string
    const finalReport = generateFinalSummary(spray, irrigation, cropCover, harvest, sowing);
    
    // Log or return this string
    
    return finalReport;


    }
