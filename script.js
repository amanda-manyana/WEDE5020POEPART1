// -----------------------------
// SHISA Bakery – Form Validation
// -----------------------------

// ENQUIRY FORM VALIDATION
function validateEnquiryForm(event) {
    event.preventDefault(); // Stop form from submitting

    // Clear previous errors
    document.querySelectorAll('.error').forEach(e => e.textContent = '');

    let isValid = true;

    // Collect form values
    const fullName = document.getElementById('enquiryName').value.trim();
    const email = document.getElementById('enquiryEmail').value.trim();
    const phone = document.getElementById('enquiryPhone').value.trim();
    const service = document.getElementById('enquiryService').value;
    const details = document.getElementById('enquiryDetails').value.trim();

    // Email format check  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone number check (10 digits)
    const phoneRegex = /^[0-9]{10}$/;

    // -----------------------------
    // Validation
    // -----------------------------
    if (fullName === "") {
        document.getElementById('enquiryNameError').textContent = "Please enter your full name.";
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById('enquiryEmailError').textContent = "Enter a valid email address.";
        isValid = false;
    }

    if (!phoneRegex.test(phone)) {
        document.getElementById('enquiryPhoneError').textContent = "Phone number must be 10 digits.";
        isValid = false;
    }

    if (service === "") {
        document.getElementById('enquiryServiceError').textContent = "Please select a service.";
        isValid = false;
    }

    if (details.length < 10) {
        document.getElementById('enquiryDetailsError').textContent = "Please provide more details (min 10 characters).";
        isValid = false;
    }

    // -----------------------------
    // If form is valid → show estimate message
    // -----------------------------
    if (isValid) {
        const output = document.getElementById('enquiryOutput');
        output.style.color = "green";
        output.innerHTML = `
            Thank you, <strong>${fullName}</strong>!<br>
            Your enquiry for <strong>${service}</strong> has been received.<br><br>
            We will contact you shortly at <strong>${email}</strong> or <strong>${phone}</strong>.
        `;
    }
}



// CONTACT FORM VALIDATION
function validateContactForm(event) {
    event.preventDefault();

    document.querySelectorAll('.error').forEach(e => e.textContent = '');

    let isValid = true;

    const fullName = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const messageType = document.getElementById('contactType').value;
    const message = document.getElementById('contactMessage').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (fullName === "") {
        document.getElementById('contactNameError').textContent = "Please enter your name.";
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById('contactEmailError').textContent = "Enter a valid email.";
        isValid = false;
    }

    if (!phoneRegex.test(phone)) {
        document.getElementById('contactPhoneError').textContent = "Phone number must be 10 digits.";
        isValid = false;
    }

    if (messageType === "") {
        document.getElementById('contactTypeError').textContent = "Select message type.";
        isValid = false;
    }

    if (message.length < 10) {
        document.getElementById('contactMessageError').textContent = "Message must be at least 10 characters.";
        isValid = false;
    }

    if (isValid) {
        const output = document.getElementById('contactOutput');
        output.style.color = "green";
        output.innerHTML = `
            Thank you, <strong>${fullName}</strong>!<br>
            Your message regarding <strong>${messageType}</strong> has been sent.<br>
            We will respond to <strong>${email}</strong>.
        `;
    }
}
