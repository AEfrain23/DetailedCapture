const navbarMenu = document.querySelector(".menu-options");
const navbarToggle = document.querySelector(".mobile-navbar-toggle");

navbarToggle.addEventListener("click", () => {
    const visibility = navbarMenu.getAttribute("data-visible");
    if (visibility === "false") {
        navbarMenu.setAttribute("data-visible", true);
        navbarToggle.setAttribute("aria-expanded", true);
    } else if (visibility === "true") {
        navbarMenu.setAttribute("data-visible", false);
        navbarToggle.setAttribute("aria-expanded", false);
    }
});




// reCAPTCHA FUNCTIONALITY
const form = document.querySelector("form");

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const captchaResponse = grecaptcha.getResponse();

    if (!captchaResponse.length > 0) {
        throw new Error("Captch not complete.")
    }

    const fd = new FormData(e.target);
    const params = new URLSearchParams(fd);

    fetch('http://localhost:3003/send-message', {
        method: "POST",
        body: params,
    })
    .then(response => response.json())  // Handle JSON response
    .then(data => {
        if (data.captchaSuccess) {
            // If reCAPTCHA passed, render the confirmation message
            const emailSent = "Email sent successfully!";
            document.querySelector('.confirmation-container').setAttribute("visibility", "true")
            document.querySelector('.confirmation-message').textContent = emailSent;
            setTimeout(function () {
                window.location = "http://www.detailedcapture.com";
            }, 5000);
        } else {
            // If reCAPTCHA failed, show the error message
            const errorMessage = "reCAPTCHA validation failed. Please try again.";
            document.querySelector('.confirmation-container').setAttribute("visibility", "true")
            document.querySelector('.confirmation-message').textContent = errorMessage;
            setTimeout(function () {
                window.location = "http://www.detailedcapture.com";
            }, 5000);
        }
    })
    .catch(err => {
        console.error(err);
        const errorMessage = "There was an error processing your request.";
        document.querySelector('.confirmation-container').setAttribute("visibility", "true")
        document.querySelector('.confirmation-message').textContent = errorMessage;
        setTimeout(function () {
            window.location = "http://www.detailedcapture.com";
        }, 5000);
    });
}); 


// COTACT FORM SEND BUTTON - Here we are reloading the page 3s after the send button has been pressed.
// const confirmationWindow = document.querySelector(".confirmation-container");
// const visibility = confirmationWindow.getAttribute("visibility");

// if (visibility === "true") {
//     setTimeout(function () {
//         window.location = "http://www.detailedcapture.com";
//     }, 5000);
// }