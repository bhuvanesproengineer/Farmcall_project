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