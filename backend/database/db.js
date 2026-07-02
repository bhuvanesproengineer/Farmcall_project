import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function connectDB() {

    const db = await open({
        filename: "./database/farmcall.db",
        driver: sqlite3.Database
    });
   

    await db.exec(`
        CREATE TABLE IF NOT EXISTS farmcall_call_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_name TEXT,
            phone_number TEXT,
            call_status TEXT,
            call_duration INTEGER,
            sms_status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
 await db.exec(`
        CREATE TABLE IF NOT EXISTS farmcall_farmer_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            village TEXT,
            mandal TEXT,
            district TEXT,
            pincode TEXT,
            state TEXT,
            language TEXT,
            farmer_name TEXT,
            phone_number TEXT
        );
    `);
    return db;
}

export async function storeCallLog(
    farmerName,
    phoneNumber,
    callStatus,
    callDuration,
    smsStatus
) {

    const db = await connectDB();

    await db.run(
        `
        INSERT INTO farmcall_call_logs
        (
            farmer_name,
            phone_number,
            call_status,
            call_duration,
            sms_status
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            farmerName,
            phoneNumber,
            callStatus,
            callDuration,
            smsStatus
        ]
    );
}
export async function getCallLogs() {

    const db = await connectDB();

    const logs = await db.all(`
        SELECT *
        FROM farmcall_call_logs
        ORDER BY created_at DESC
    `);

    return logs;
}
export async function storeFarmerData(farmerData) {
    const { village, mandal, district, pincode, state, language, farmer_name, phone_number } = farmerData;
    const db = await connectDB();
   const result = await db.run(
        `
        INSERT INTO farmcall_farmer_data
        (
            village,
            mandal,
            district,
            pincode,
            state,
            language,
            farmer_name,
            phone_number
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            farmerData.village,
            farmerData.mandal,
            farmerData.district,
            farmerData.pincode,
            farmerData.state,
            farmerData.language,
            farmerData.farmer_name,
            farmerData.phone_number
        ]
    );
    const farmers = await db.all(
    `SELECT * FROM farmcall_farmer_data`
);
}

export const getAllFarmers = async () => {
    const db = await connectDB();
    const farmers = await db.all(
        `SELECT * FROM farmcall_farmer_data`
    );
    return farmers;
}
