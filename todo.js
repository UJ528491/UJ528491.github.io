const toDoForm = document.querySelector(".js-toDoForm"),//toDoForm class
toDoInput = toDoForm.querySelector("input"), //toDoForm class의 input의 html
toDoList = document.querySelector(".js-toDoList") //toDoList class

const TODOS_LS = "toDos"; // todos 로컬스토리지

let toDos = []; //할일 객체 들어있는 리스트, 할당 변경하므로 let으로 수정

function deleteToDo(event){//html li 제거,스토리지 제거후 저장, paint호출
  const li = event.target.parentElement; //event의 id 요소 포함된 html
  toDoList.removeChild(li); //child node li 삭제
  const cleanToDos = toDos.filter(function(toDo){
    return toDo.id !== parseInt(li.id); //할일객체 id와 html id 와 비교해서 삭제
  });//filter함수:array를 인자로 하나씩 호출해서 true인것만 다시 array로 만듬
  // console.log(cleanToDos)로 확인결과 삭제가 안됨 int, string 문제로 추측
  // toDos.id는 int, li.id는 string
  toDos = cleanToDos; //toDos 할일 객체를 최신화
  saveToDos(); //최신화된 할일객체 저장
}

function saveToDos(){
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos)); //자바스크립트 object를 string으로 바꿔서 스토리지에 저장
}

function paintToDo(text){ //할일 input값(문자열)을 parameter
  const li = document.createElement("li"); // html li 생성 
  const delBtn = document.createElement("button"); //html button 생성
  const span = document.createElement("span"); //html span 생성
  const newId = toDos.length + 1; //할일 객체가 들어있는 toDos리스트의 개수를 id로 생성
  delBtn.innerText = "❌"; //버튼값 이모지
  delBtn.addEventListener("click", deleteToDo,);
  span.innerText = text;  //스판 텍스트값에 input값 저장
  li.appendChild(delBtn); // li 하위에 delBtn추가(이모지)
  li.appendChild(span); // li 하위에 span 추가(input값)
  li.id = newId;
  toDoList.appendChild(li); // toDoList 클래스에 li 추가
  const toDoObj = {
    text : text,
    id : newId
  };
  toDos.push(toDoObj); //ToDos 리스트에 toDoObj 객체 추가
  saveToDos(); //객체 추가한 뒤 로컬스토리지 함수 호출
}// 로컬스토리지에 자바 data 저장 불가 only string만 저장

function handleSubmit(event){
  event.preventDefault(); //event 디폴트 방지(입력창 값 유지)
  const currentValue = toDoInput.value; // 할일 input값 저장
  paintToDo(currentValue); // input값을 painttodo(할일 함수)로 호출
  toDoInput.value = ""; // input값을 null로 
}

function loadToDos(){
  const loadedToDos = localStorage.getItem(TODOS_LS);
  if(loadedToDos !== null){ //저장된게 있으면
    const parsedToDos = JSON.parse(loadedToDos); //string으로 바뀐 loadedToDos를 다시 object으로 바꿈
    parsedToDos.forEach(toDo => paintToDo(toDo.text))//arrow function 호출불가 간이 함수
    /* parsedToDos.forEach(function(toDo){
      paintToDo(toDo.text);
    }); */
    //paintToDo함수를 한번씩 호출
    //forEach함수 :array값을 인자로 각각에 함수를 한번씩 호출
  }
}

function init(){
  loadToDos(); 
  toDoForm.addEventListener("submit", handleSubmit); //할일 입력받으면 handleSubmit 호출
}

init();