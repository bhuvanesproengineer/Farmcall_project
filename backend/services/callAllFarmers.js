import {getFarmcall} from '../farmcall.js';

export const callAllFarmers = async (farmers) => {
   for (const farmer of farmers) {

    const req = {
        query: farmer
    };

    const res = {
        status: () => ({
            json: () => {}
        })
    };

    await getFarmcall(req, res);
}
}