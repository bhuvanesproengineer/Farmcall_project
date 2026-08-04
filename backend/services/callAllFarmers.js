import { getFarmcall } from './farmcall.js';

export const callAllFarmers = async (farmers, username) => {
    if (!Array.isArray(farmers) || farmers.length === 0) {
        console.log("[callAllFarmers] No farmers found to call.");
        return;
    }

    for (const farmer of farmers) {
        // Convert Mongoose document to a plain JavaScript object
        const farmerData = farmer && typeof farmer.toObject === 'function' 
            ? farmer.toObject() 
            : (farmer || {});

        // Normalize camelCase / snake_case properties
        farmerData.farmerName = farmerData.farmerName || farmerData.farmer_name || "Farmer";
        farmerData.farmer_name = farmerData.farmer_name || farmerData.farmerName || "Farmer";
        farmerData.phoneNumber = farmerData.phoneNumber || farmerData.phone_number || "";
        farmerData.phone_number = farmerData.phone_number || farmerData.phoneNumber || "";

        if (!farmerData.phoneNumber) {
            console.warn(`[callAllFarmers] Skipping farmer "${farmerData.farmerName}" (ID: ${farmerData._id || 'unknown'}): No phone number registered.`);
            continue;
        }

        const farmerUsername = username || farmerData.username;

        const req = { 
            body: farmerData, 
            query: farmerData, 
            username: farmerUsername,
            ...farmerData 
        };

        const res = {
            status: (statusCode) => ({
                json: (responseData) => {
                    if (statusCode >= 400) {
                        console.error(`[callAllFarmers] Response ${statusCode} for farmer ${farmerData.farmerName}:`, responseData);
                    }
                    return responseData;
                }
            })
        };

        try {
            await getFarmcall(req, res);
        } catch (err) {
            console.error(`[callAllFarmers] Exception processing call for ${farmerData.farmerName}:`, err.message || err);
        }
    }
};