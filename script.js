const API_URL = "https://api.jsonbin.io/v3/b/67c0bf48ad19ca34f813b071";
const API_KEY = "$2a$10$C/bZ.9QKRFFL5DaOPNi7mOa7/aFI74EeAAGvOBgjRahOzttwD/wY.";

const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const submitButton = document.getElementById("submit");
const toggleText = document.getElementById("toggle-text");
const inputLabel = document.getElementById("input-label");

const overlay = document.getElementById("overlay");
const messageBox = document.getElementById("message-box");
const messageText = document.getElementById("message-text");
const okButton = document.getElementById("ok-button");

function applyGlowEffect(element) {
    element.style.transition = "box-shadow 0.3s ease-in-out";
    element.style.boxShadow = "0px 0px 10px rgba(0, 255, 255, 0.7)";

    setTimeout(() => {
        element.style.boxShadow = "0px 0px 5px rgba(0, 255, 255, 0.4)";
    }, 300);
}

phoneInput.addEventListener("focus", () => applyGlowEffect(phoneInput));
emailInput.addEventListener("focus", () => applyGlowEffect(emailInput));

phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
});

function isPhoneValid(phone) {
    return /^[0-9]{7,20}$/.test(phone);
}

function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

toggleText.addEventListener("click", () => {
    if (phoneInput.style.display !== "none") {
        phoneInput.style.display = "none";
        emailInput.style.display = "block";
        inputLabel.textContent = "Enter your email to subscribe:";
        toggleText.textContent = "Or enter phone number";
    } else {
        phoneInput.style.display = "block";
        emailInput.style.display = "none";
        inputLabel.textContent = "Enter your phone number to subscribe:";
        toggleText.textContent = "Or enter e-mail";
    }
});

function showMessage(text, color) {
    messageText.textContent = text;
    messageText.style.color = color;

    overlay.classList.add("active");
    messageBox.classList.add("active");
}

okButton.addEventListener("click", () => {
    overlay.classList.remove("active");
    messageBox.classList.remove("active");
});

async function submitData() {
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const isPhoneMode = phoneInput.style.display !== "none"; 

    if (isPhoneMode) {
        // Validate phone only if phone input is active
        if (!phone) {
            showMessage("Please enter a phone number.", "red");
            return;
        }
        if (!isPhoneValid(phone)) {
            showMessage("Phone number must be 7-20 digits and contain only numbers.", "red");
            return;
        }
    } else {
        // Validate email only if email input is active
        if (!email) {
            showMessage("Please enter an email.", "red");
            return;
        }
        if (!isEmailValid(email)) {
            showMessage("Please enter a valid email in the format name@domain.com.", "red");
            return;
        }
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

    subscribers.push({ phone: isPhoneMode ? phone : null, email: !isPhoneMode ? email : null });

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
        phoneInput.value = "";
        emailInput.value = "";
    } catch (error) {
        showMessage("Error saving data. Try again.", "red");
    }
}

submitButton.addEventListener("click", submitData);