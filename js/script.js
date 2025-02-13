const imgEls = document.querySelectorAll(".pic");
const modal = document.getElementById("modal");
const modalBox = document.getElementById("modalBox");
const cancelBtn = document.getElementById("cancelBtn");
const img = document.createElement("img");
const left = document.getElementById("left-arrow");
const right = document.getElementById("right-arrow");

var currentIndex = 0;

imgEls.forEach((el, idx) => {
    el.addEventListener("click", function() {
        img.src = this.getAttribute("src");
        img.style.display = "block";
        img.style.height = "100%";
        left.insertAdjacentElement("afterend", img);

        cancelBtn.style.display = "block";
        left.style.display = "block";
        right.style.display = "block";
        modal.style.display = "flex";

        currentIndex = idx;
    });
});


cancelBtn.addEventListener("click", function() {
    modalBox.removeChild(img);
    modal.style.display = "none";
})

left.addEventListener("click", function() {
    if(currentIndex !== 0)
    {
        img.src = imgEls[--currentIndex].getAttribute("src");
    }
})

right.addEventListener("click", function() {
    if(currentIndex !== imgEls.length-1)
    {
        img.src = imgEls[++currentIndex].getAttribute("src");
    }
})