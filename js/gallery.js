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
var likedIndex;

const MAX_NUMBER = 4;

const recentTds = document.querySelectorAll(".recent-photos");
const likedTds = document.querySelectorAll(".liked-photos");

const fileInput = document.getElementById("photo-input");
const galleryTable = document.querySelector(".gallery-table");

// 프로필 사진 불러오기
const uploadedImage = JSON.parse(localStorage.getItem("uploadedImages")) || [];
if(uploadedImage.length !== 0){
    const profile = document.getElementById("profile");
    profile.src = uploadedImage;

    profile.addEventListener("click", function(){
        img.src = this.getAttribute("src");
        img.style.display = "block";
        left.insertAdjacentElement("afterend", img);

        cancelBtn.style.display = "block";
        modal.style.display = "flex";
    })
}

const profileInput = document.getElementById("profile-input");

const allImages = [...imgEls];


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
        else if(likedIndex !== undefined){
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
        if(clickedImages !== null && clickedImages[idx] < imgEls.length) {
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
                likedIndex = idx;
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
    likedIndex = undefined;
})

left.addEventListener("click", function() {
    if(currentIndex !== undefined && currentIndex > 0){
        img.src = allImages[--currentIndex].getAttribute("src");
    }
    if(recentIndex !== undefined && recentIndex > 0) {
        let clickedImages = JSON.parse(localStorage.getItem("recentImages")) || [];
        img.src = imgEls[clickedImages[--recentIndex]].getAttribute("src");
    }
    if(likedIndex !== undefined && likedIndex > 0) {
        let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
        img.src = imgEls[likedImages[--likedIndex]].getAttribute("src");
    }
})

right.addEventListener("click", function() {
    if(currentIndex !== undefined && currentIndex < allImages.length-1) {
        img.src = allImages[++currentIndex].getAttribute("src");
    }

    let clickedImages = JSON.parse(localStorage.getItem("recentImages")) || [];
    if(recentIndex !== undefined && recentIndex < clickedImages.length-1) {
        img.src = imgEls[clickedImages[++recentIndex]].getAttribute("src");
    }

    let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
    if(likedIndex !== undefined && likedIndex < likedImages.length-1) {
        img.src = imgEls[likedImages[++likedIndex]].getAttribute("src");
    }
})

// 처음 좋아요를 누를 경우, 좋아요 추가
emptyHeart.addEventListener("click", function(){
  let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
  if(currentIndex !== undefined && currentIndex < imgEls.length){
      likedImages.unshift(currentIndex);
      if(likedImages.length > MAX_NUMBER) {
          likedImages.pop();
      }

      redHeart.style.display = "block";
      emptyHeart.style.display = "none";
  }
  else if(recentIndex !== undefined){
      likedImages.unshift(recentIndex);
      if(likedImages.length > MAX_NUMBER) {
          likedImages.pop();
      }

      redHeart.style.display = "block";
      emptyHeart.style.display = "none";
  }
  localStorage.setItem("likedImages", JSON.stringify(likedImages));

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
    else if(likedIndex !== undefined){
        likedImages.forEach((el,idx)=>{
            if(el === likedImages[likedIndex]){
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

// FileReader 객체로 업로드한 이미지 확인
fileInput.addEventListener("change", function (event){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const imgEl = document.createElement("img");

        imgEl.src = reader.result;
        // 업로드한 이미지는 최근 본 사진 목록에 표시되지 않음
        imgEl.addEventListener("click", function(){
            currentIndex = allImages.length - 1;
            showImage(this);
        })

        // 업로드한 이미지 갤러리에 배치
        displayImage(imgEl);
        allImages.push(imgEl);
    }
    reader.readAsDataURL(file);
})


profileInput.addEventListener("change", function (event){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const profile = document.getElementById("profile");
        const uploadedImages = [];

        uploadedImages.push(reader.result);
        try {
            localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages));
            profile.src = reader.result;
        } catch (e) {
            if (e.name === "QuotaExceededError") {
                alert("이미지 크기가 너무 커 프로필 이미지 변경에 실패하였습니다. ");
            }
        }


        // 프로필 사진 크게보기
        profile.addEventListener("click", function(){
            img.src = this.getAttribute("src");
            img.style.display = "block";
            left.insertAdjacentElement("afterend", img);

            cancelBtn.style.display = "block";
            modal.style.display = "flex";
        })
    }
    reader.readAsDataURL(file);
})

function displayImage(img){
    const tdEl = document.createElement("td");
    const tdEls = document.querySelectorAll(".gallery-table td");
    tdEl.appendChild(img);

    // 행이 다 찼다면 행을 새로 생성 후 이미지 추가
    if(tdEls.length % 4 === 0){
        const trEl = document.createElement("tr");
        trEl.appendChild(tdEl)
        galleryTable.appendChild(trEl);
    }
    else{
        tdEls[tdEls.length-1].insertAdjacentElement("afterend",tdEl);
    }
}


window.addEventListener("load", function() {
    displayRecentImages();
    displayLikedImages();
});
