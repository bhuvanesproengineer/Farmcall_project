submitBtn.addEventListener("click", async () => {
    try {
        const village = document.getElementById("village").value.trim();
        const mandal = document.getElementById("mandal").value.trim();
        const district = document.getElementById("district").value.trim();
        const pincode = document.getElementById("pincode").value.trim();
        const state = document.getElementById("state").value.trim();
        const language = document.getElementById("language").value.trim();
        const farmer_name = document.getElementById("farmer_name").value.trim();
        const phone_number = document.getElementById("phoneNumber").value.trim();
      const url = `https://farmcall-project.onrender.com/farmcall?village=${encodeURIComponent(village)}&mandal=${encodeURIComponent(mandal)}&district=${encodeURIComponent(district)}&pincode=${encodeURIComponent(pincode)}&state=${encodeURIComponent(state)}&language=${encodeURIComponent(language)}&farmer_name=${encodeURIComponent(farmer_name)}&phone_number=${encodeURIComponent(phone_number)}`;
        console.log("URL:", url);

        const response = await fetch(url);

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("Data:", data);

        document.getElementById("outputContainer").innerHTML = `
    <div class="whitespace-pre-wrap break-words overflow-auto">
        ${typeof data === "string" ? data : JSON.stringify(data, null, 2)}
    </div>
`;

    } catch (error) {
        console.error(error);

        document.getElementById("outputContainer").innerHTML =
            `<p style="color:red;">${error.message}</p>`;
    }
});
