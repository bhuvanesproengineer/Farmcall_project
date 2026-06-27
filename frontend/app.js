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
<<<<<<< HEAD

       const url = `https://farmcall-project.onrender.com/farmcall?village=${encodeURIComponent(village)}&mandal=${encodeURIComponent(mandal)}&district=${encodeURIComponent(district)}&pincode=${encodeURIComponent(pincode)}&state=${encodeURIComponent(state)}&language=${encodeURIComponent(language)}&farmer_name=${encodeURIComponent(farmer_name)}&phone_number=${encodeURIComponent(phone_number)}`;
        outputContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center py-6">
                <div class="spinner"></div>
                <p class="mt-4 text-gray-600 font-medium">
                    Generating weather report and placing call...
                </p>
            </div>
        `;

        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

        await new Promise(resolve => setTimeout(resolve, 50));
=======
      const url = `https://farmcall-project.onrender.com/farmcall?village=${encodeURIComponent(village)}&mandal=${encodeURIComponent(mandal)}&district=${encodeURIComponent(district)}&pincode=${encodeURIComponent(pincode)}&state=${encodeURIComponent(state)}&language=${encodeURIComponent(language)}&farmer_name=${encodeURIComponent(farmer_name)}&phone_number=${encodeURIComponent(phone_number)}`;
        console.log("URL:", url);
>>>>>>> cb6d7f475c5648ad53179ef92269f632036f7ec8

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
            <p class="text-red-500 font-semibold">
                ${error.message}
            </p>
        `;

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Start Calling";

    }
});
