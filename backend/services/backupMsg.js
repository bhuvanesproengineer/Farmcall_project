export async function backupMsg(
    status,
    duration,
    phoneNumber,
    farmerSummary,
    language
) {
    try {

        if (
            status !== "completed" ||
            duration < 10
        ) {

            const shortSummary = await getShortMsg(
                farmerSummary,
                language
            );

            await client.messages.create({
                body: shortSummary,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });

            return "delivered";
        }

        return "not_required";

    } catch (error) {

        console.error("SMS Error:", error);

        return "failed";
    }
}