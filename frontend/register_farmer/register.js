
const registerBtn = document.getElementById("registerBtn");
function clearForm() {

    document.getElementById("village").value = "";
    document.getElementById("mandal").value = "";
    document.getElementById("district").value = "";
    document.getElementById("pincode").value = "";
    document.getElementById("farmer_name").value = "";
    document.getElementById("phoneNumber").value = "";

    document.getElementById("state").selectedIndex = 0;
    document.getElementById("language").selectedIndex = 0;
}
registerBtn.addEventListener("click", async () => {

    const village = document.getElementById("village").value.trim();
    const mandal = document.getElementById("mandal").value.trim();
    const district = document.getElementById("district").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const state = document.getElementById("state").value.trim();
    const language = document.getElementById("language").value.trim();
    const farmer_name = document.getElementById("farmer_name").value.trim();
    const phone_number = document.getElementById("phoneNumber").value.trim();

    const farmerData = {
        village,
        mandal,
        district,
        pincode,
        state,
        language,
        farmer_name,
        phone_number
    };

    try {

        const response = await fetch(
            "https://farmcall-project.onrender.com/register_farmer",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(farmerData)
            }
        );

        const data = await response.json();

        console.log("Success:", data);
    clearForm();
    alert("Farmer Registered Successfully");
    } catch (error) {

        console.error("Error:", error);

    }

});