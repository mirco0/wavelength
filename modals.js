const howToPlayModal = document.getElementById("howToPlayModal");
const howToPlayButton = document.getElementById("howToPlayButton");
const howToPlayCloseButton = howToPlayModal.querySelector(".close-button");

const packsModal = document.getElementById("packsModal");
const packsButton = document.getElementById("packsButton");
const packsCloseButton = packsModal.querySelector(".close-button");

function open(modal) {
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

}

function close(parent) {
    parent.classList.remove("show");
    setTimeout(() => parent.style.display = "none", 300);

}

howToPlayButton.onclick = function () {
    open(howToPlayModal);
}

packsButton.onclick = function () {
    open(packsModal);
}

howToPlayCloseButton.onclick = function () {
    close(howToPlayModal);
}

packsCloseButton.onclick = function () {
    close(packsModal);
}

window.onclick = function (event) {
    if (event.target == howToPlayModal) {
        howToPlayModal.classList.remove("show");
        setTimeout(() => howToPlayModal.style.display = "none", 300);
    }
}