import {getFarmcall} from './farmcall.js';

export const callAllFarmers = async (farmers) => {
    const promises = [];

    for (const farmer of farmers) {
        const req = { query: farmer };

        const res = {
            status: () => ({
                json: () => {}
            })
        };

        promises.push(getFarmcall(req, res));
    }

    await Promise.all(promises);
}