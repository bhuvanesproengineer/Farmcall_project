import {farmcall} from '../farmcall.js';

export const callAllFarmers = async (farmers) => {
    for (const farmer of farmers) {
        await farmcall(farmer);
        console.log(`Call made to farmer: ${farmer.farmer_name}`);g
        
    }
}