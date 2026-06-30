const API_URL =
    "https://farmcall-project.onrender.com/api/call-logs";

async function fetchLogs() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const result = await response.json();

        console.log("API Result:", result);

        const logs = result.data || [];

        logs.sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        );

        const tableBody =
            document.getElementById("tableBody");

        tableBody.innerHTML = "";

        if (logs.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No call logs found.
                    </td>
                </tr>
            `;

            return;
        }

        logs.forEach(log => {

      const formattedDate = new Date(
    log.created_at + " UTC"
).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
});

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${log.farmer_name}</td>
                <td>${log.phone_number}</td>
                <td>${log.call_status}</td>
                <td>${log.call_duration} sec</td>
                <td>${log.sms_status}</td>
                <td>${formattedDate}</td>
            `;

            tableBody.appendChild(row);

        });

        document.getElementById("lastUpdated")
            .innerText =
            "Last Updated: " +
            new Date().toLocaleString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });

    } catch (error) {

        console.error(
            "Error Fetching Logs:",
            error
        );

        const tableBody =
            document.getElementById("tableBody");

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load call logs.
                </td>
            </tr>
        `;
    }
}

/* Initial Load */
fetchLogs();

/* Auto Refresh Every 30 Seconds */
setInterval(fetchLogs, 30000);