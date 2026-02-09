console.log("Popup js loaded successfully.");

document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup DOM fully loaded");

    const heading = document.querySelector("h3");
    heading.style.color = "#0a66c2";
});