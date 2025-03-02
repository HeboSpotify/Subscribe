const API_URL = "https://api.jsonbin.io/v3/b/67c0bf48ad19ca34f813b071";
const API_KEY = "$2a$10$C/bZ.9QKRFFL5DaOPNi7mOa7/aFI74EeAAGvOBgjRahOzttwD/wY.";

const emailInput = document.getElementById("email");
const submitButton = document.getElementById("submit");
const inputLabel = document.getElementById("input-label");

const overlay = document.getElementById("overlay");
const messageBox = document.getElementById("message-box");
const messageText = document.getElementById("message-text");
const okButton = document.getElementById("ok-button");

// Validate email format
function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message popup
function showMessage(text, color) {
    messageText.textContent = text;
    messageText.style.color = color;

    overlay.classList.add("active");
    messageBox.classList.add("active");
}

// Hide message popup
okButton.addEventListener("click", () => {
    overlay.classList.remove("active");
    messageBox.classList.remove("active");
});

// Submit data
async function submitData() {
    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
        showMessage("Please enter an email.", "red");
        return;
    }
    if (!isEmailValid(email)) {
        showMessage("Please enter a valid email in the format name@domain.com.", "red");
        return;
    }

    let subscribers = [];

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "X-Master-Key": API_KEY }
        });
        const jsonData = await response.json();
        subscribers = jsonData.record.subscribers || [];
    } catch (error) {
        showMessage("Error fetching data. Try again.", "red");
        return;
    }

    // Add new email entry
    subscribers.push({ email });

    try {
        await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY
            },
            body: JSON.stringify({ subscribers })
        });

        showMessage("Subscription successful!", "green");
        emailInput.value = "";
    } catch (error) {
        showMessage("Error saving data. Try again.", "red");
    }
}

submitButton.addEventListener("click", submitData);
