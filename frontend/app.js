submitBtn.addEventListener("click", async () => {

    const outputContainer = document.getElementById("outputContainer");

    try {

        const village = document.getElementById("village").value.trim();
        const mandal = document.getElementById("mandal").value.trim();
        const district = document.getElementById("district").value.trim();
        const pincode = document.getElementById("pincode").value.trim();
        const state = document.getElementById("state").value.trim();
        const language = document.getElementById("language").value.trim();
        const farmer_name = document.getElementById("farmer_name").value.trim();
        const phone_number = document.getElementById("phoneNumber").value.trim();

const url = `https://farmcall-backend.onrender.com/farmcall?village=${encodeURIComponent(village)}&mandal=${encodeURIComponent(mandal)}&district=${encodeURIComponent(district)}&pincode=${encodeURIComponent(pincode)}&state=${encodeURIComponent(state)}&language=${encodeURIComponent(language)}&farmer_name=${encodeURIComponent(farmer_name)}&phone_number=${encodeURIComponent(phone_number)}`;
        outputContainer.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">
                <div class="spinner"></div>
                <p style="margin-top:15px;">
                    Generating weather report and placing call...
                </p>
            </div>
        `;

        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

        await new Promise(resolve => setTimeout(resolve, 100));

        const response = await fetch(url);

        const data = await response.json();

        outputContainer.innerHTML = `
            <div class="whitespace-pre-wrap break-words overflow-auto">
                ${typeof data === "string"
                    ? data
                    : JSON.stringify(data, null, 2)}
            </div>
        `;

    } catch (error) {

        console.error(error);

        outputContainer.innerHTML = `
            <p style="color:red;">
                ${error.message}
            </p>
        `;

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Start Calling";

    }
});
