import {farmcall} from '../farmcall.js';

export const callAllFarmers = async (farmers) => {
    for (const farmer of farmers) {
        await farmcall(farmer);
    }
}