const navbar = document.querySelector("#navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        navbar.classList.add("ativa");
    } else {
        navbar.classList.remove("ativa");
    }
});