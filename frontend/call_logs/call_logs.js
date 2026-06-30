const API_URL =
    "https://farmcall-project.onrender.com/api/call-logs";

async function fetchLogs() {

    try {

        const response = await fetch(API_URL);

        const result = await response.json();

        const logs = result.data || [];

        logs.sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        );

        const tableBody =
            document.getElementById("tableBody");

        tableBody.innerHTML = "";

        logs.forEach(log => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${log.farmer_name}</td>
                <td>${log.phone_number}</td>
                <td>${log.call_status}</td>
                <td>${log.call_duration} sec</td>
                <td>${log.sms_status}</td>
                <td>${log.created_at}</td>
            `;

            tableBody.appendChild(row);

        });

        document.getElementById("lastUpdated")
            .innerText =
            "Last Updated: " +
            new Date().toLocaleTimeString();

    } catch (error) {

        console.error(
            "Error Fetching Logs:",
            error
        );

    }
}

/* First Load */
fetchLogs();

/* Auto Refresh Every 30 Seconds */
setInterval(fetchLogs, 30000);