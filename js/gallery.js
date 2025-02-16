const imgEls = document.querySelectorAll(".pic");
const modal = document.getElementById("modal");
const modalBox = document.getElementById("modalBox");
const cancelBtn = document.getElementById("cancelBtn");
const img = document.createElement("img");
const left = document.getElementById("left-arrow");
const right = document.getElementById("right-arrow");
const emptyHeart = document.getElementById("empty-heart");
const redHeart = document.getElementById("red-heart");

var currentIndex;
var recentIndex;
var likeIndex;

const MAX_NUMBER = 4;

const recentTds = document.querySelectorAll(".recent-photos");
const likedTds = document.querySelectorAll(".liked-photos");

function showImage(newImg){
    img.src = newImg.getAttribute("src");
    img.style.display = "block";
    left.insertAdjacentElement("afterend", img);

    cancelBtn.style.display = "block";
    left.style.display = "block";
    right.style.display = "block";
    modal.style.display = "flex";
    
    emptyHeart.style.display = "block";
    redHeart.style.display = "none";

    let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
    likedImages.forEach((el)=>{
        if(currentIndex === el){
            redHeart.style.display = "block";
            emptyHeart.style.display = "none";
        }
        else if(recentIndex !== undefined){
            let clickedImages = JSON.parse(localStorage.getItem("recentImages"));
            if(clickedImages[recentIndex] === el){
                redHeart.style.display = "block";
                emptyHeart.style.display = "none";
            }
        }
        else if(likeIndex !== undefined){
            redHeart.style.display = "block";
            emptyHeart.style.display = "none";
        }
    });

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
                recentIndex = idx;
                showImage(this);
            });
        }
    });
}

function displayLikedImages(){
    likedTds.forEach((el, idx) => {
        el.innerHTML="";

        let img = document.createElement("img");
        let likedImages = JSON.parse(localStorage.getItem("likedImages"));
        if(likedImages !== null && idx >= 0 && idx < likedImages.length) {
            img.src = imgEls[likedImages[idx]].getAttribute("src");
            img.style.display = "block";
            el.appendChild(img);

            img.addEventListener("click", function (){
                likeIndex = idx;
                showImage(this);
            });
        }
    });
}

imgEls.forEach((el, idx) => {
    el.addEventListener("click", function() {
        currentIndex = idx;
        showImage(this);


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
    likeIndex = undefined;
})

left.addEventListener("click", function() {
    if(currentIndex !== undefined && currentIndex > 0) {
        img.src = imgEls[--currentIndex].getAttribute("src");
    }
    if(recentIndex !== undefined && recentIndex > 0) {
        let clickedImages = JSON.parse(localStorage.getItem("recentImages")) || [];
        img.src = imgEls[clickedImages[--recentIndex]].getAttribute("src");
    }
    if(likeIndex !== undefined && likeIndex > 0) {
        let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
        img.src = imgEls[likedImages[--likeIndex]].getAttribute("src");
    }
})

right.addEventListener("click", function() {
    if(currentIndex !== undefined && currentIndex < imgEls.length-1) {
        img.src = imgEls[++currentIndex].getAttribute("src");
    }

    let clickedImages = JSON.parse(localStorage.getItem("recentImages")) || [];
    if(recentIndex !== undefined && recentIndex < clickedImages.length-1) {
        img.src = imgEls[clickedImages[++recentIndex]].getAttribute("src");
    }

    let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
    if(likeIndex !== undefined && likeIndex < likedImages.length-1) {
        img.src = imgEls[likedImages[++likeIndex]].getAttribute("src");
    }
})

// 처음 좋아요를 누를 경우, 좋아요 추가
emptyHeart.addEventListener("click", function(){
  let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
  if(currentIndex !== undefined){
      likedImages.unshift(currentIndex);
      if(likedImages.length > MAX_NUMBER) {
          likedImages.pop();
      }
  }
  else if(recentIndex !== undefined){
      likedImages.unshift(recentIndex);
      if(likedImages.length > MAX_NUMBER) {
          likedImages.pop();
      }
  }
  localStorage.setItem("likedImages", JSON.stringify(likedImages));
  redHeart.style.display = "block";
  emptyHeart.style.display = "none";

  // 좋아요 목록 갱신
  displayLikedImages();
})

// 이미 좋아요 누른 사진일 경우, 좋아요 삭제
redHeart.addEventListener("click", function(){
    let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
    if(currentIndex !== undefined){
        likedImages.forEach((el,idx)=>{
            if(el === currentIndex){
                likedImages.splice(idx, 1);
            }
        })
    }
    else if(recentIndex !== undefined){
        let clickedImages = JSON.parse(localStorage.getItem("recentImages"));
        likedImages.forEach((el,idx)=>{
            if(el === clickedImages[recentIndex]){
                likedImages.splice(idx, 1);
            }
        })
    }
    else if(likeIndex !== undefined){
        likedImages.forEach((el,idx)=>{
            if(el === likedImages[likeIndex]){
                likedImages.splice(idx, 1);
            }
        })
    }
    localStorage.setItem("likedImages", JSON.stringify(likedImages));
    emptyHeart.style.display = "block";
    redHeart.style.display = "none";

    // 좋아요 목록 갱신
    displayLikedImages();
})


window.addEventListener("load", function() {
    displayRecentImages();
    displayLikedImages();
});
