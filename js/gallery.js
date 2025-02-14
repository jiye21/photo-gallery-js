const imgEls = document.querySelectorAll(".pic");
const modal = document.getElementById("modal");
const modalBox = document.getElementById("modalBox");
const cancelBtn = document.getElementById("cancelBtn");
const img = document.createElement("img");
const left = document.getElementById("left-arrow");
const right = document.getElementById("right-arrow");

var currentIndex;
var recentIndex;

const MAX_NUMBER = 4;

const recentTds = document.querySelectorAll(".recent-photos");

function showImage(newImg){
    img.src = newImg.getAttribute("src");
    img.style.display = "block";
    left.insertAdjacentElement("afterend", img);

    cancelBtn.style.display = "block";
    left.style.display = "block";
    right.style.display = "block";
    modal.style.display = "flex";
}


function displayRecentImages(){
    recentTds.forEach((el, idx) => {
        el.innerHTML="";

        let img = document.createElement("img");
        let clickedImages = JSON.parse(localStorage.getItem("recentImages"));
        if(clickedImages !== null && idx >= 0 && idx < clickedImages.length) {
            img.src = imgEls[clickedImages[idx]].getAttribute("src");
            img.style.display = "block";
            el.appendChild(img);

            img.addEventListener("click", function (){
                showImage(this);
                recentIndex = idx;
            });
        }
    });
}

imgEls.forEach((el, idx) => {
    el.addEventListener("click", function() {
        showImage(this);

        currentIndex = idx;

        let clickedImages = JSON.parse(localStorage.getItem("recentImages")) || [];
        clickedImages = clickedImages.filter((el) => el !== idx);
        clickedImages.unshift(idx);
        if(clickedImages.length > MAX_NUMBER) {
            clickedImages.pop();
        }
        localStorage.setItem("recentImages", JSON.stringify(clickedImages));


        // 이미지 클릭 시 최근 클릭한 이미지 목록 즉시 갱신
        displayRecentImages();
    });
});


cancelBtn.addEventListener("click", function() {
    modalBox.removeChild(img);
    modal.style.display = "none";
    currentIndex = undefined;
    recentIndex = undefined;
})

left.addEventListener("click", function() {
    if(currentIndex !== undefined && currentIndex > 0)
    {
        img.src = imgEls[--currentIndex].getAttribute("src");
    }
    if(recentIndex !== undefined && recentIndex > 0)
    {
        let clickedImages = JSON.parse(localStorage.getItem("recentImages")) || [];
        img.src = imgEls[clickedImages[--recentIndex]].getAttribute("src");
    }
})

right.addEventListener("click", function() {
    if(currentIndex !== undefined && currentIndex < imgEls.length-1)
    {
        img.src = imgEls[++currentIndex].getAttribute("src");
    }

    let clickedImages = JSON.parse(localStorage.getItem("recentImages")) || [];
    if(recentIndex !== undefined && recentIndex < clickedImages.length-1)
    {
        img.src = imgEls[clickedImages[++recentIndex]].getAttribute("src");
    }
})

window.onload = displayRecentImages;