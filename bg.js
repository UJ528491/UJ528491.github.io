const body = document.querySelector("body");

const IMG_NUM = 5;

function paintImage(imgNumber){
  const image = new Image();
  image.src = `images/${imgNumber+1}.jpg`;
  image.classList.add('bgImage');
  body.appendChild(image);
  // image.addEventListener("loadend", handleImgLoad); API사용할경우 로딩방지용으로 필요함

}

function genRandom(){
  const number = Math.floor(Math.random() * IMG_NUM);
  return number
}

function init(){
  const randomNumber = genRandom();
  paintImage(randomNumber);
}

init();