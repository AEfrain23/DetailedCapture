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


// COTACT FORM SEND BUTTON - Here we are reloading the page 3s after the send button has been pressed.

const confirmationWindow = document.querySelector(".confirmation-container");
const visibility = confirmationWindow.getAttribute("visibility");

if (visibility === "true") {
    setTimeout(function () {
        window.location = "http://www.detailedcapture.com";
    }, 5000);
}