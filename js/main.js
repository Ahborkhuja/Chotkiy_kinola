// Main
const form = document.querySelector("#form");
const formS = document.querySelector("#sform");
const content = document.querySelector("#content");
const book = document.querySelector("#booked");
const buk = document.querySelector("#buk");
const sendB = document.querySelector("#sendB");
const bigThumbnail = document.querySelector("#img");
const imgIn = document.querySelector("#imgIn");
// Adding content
const nameM = document.querySelector("#text");
const yearM = document.querySelector("#year");
const category = document.querySelector("#category");
const rate = document.querySelector("#rate");
const but = document.querySelector("#but");
// Searching content
const sea_c = document.querySelector("#Scategory");
const sea_r = document.querySelector("#Srate");
const sea_n = document.querySelector("#Stext");
const sea_y = document.querySelector("#Syear");
// variables

fetch("https://api.themoviedb.org/3/movie/changes?page=1")
let mas = [];
console.log(mas);
let sea_cards = [];
let condition = "send";
let findCard;
let findCardIndex;
const formHandler = (e) => {
  e.preventDefault();
  if (condition == "send") {
    const card = {
      // img: img.src,
      title: nameM.value,
      id: Math.random().toFixed(2),
      year: yearM.value,
      categories: [...category.options].filter((x) => x.selected).map((item) => { return item.value; }),
      rate: rate.value
    };

    if (nameM.value !== "" || yearM.value !== "" || category.value !== "" || rate.value !== "") {
      movies.push(card);

    } else {
      alert("Empty inputs");
    }
    nameM.value = "";
    yearM.value = "";
    category.value = "";
    rate.value = "";
  } else {
    let editObj = { ...findCard, 
      title: nameM.value,
      year: yearM.value,
      categories: [...category.options].filter((x) => x.selected).map((item) => { return item.value; }),
      rate: rate.value
    };
    console.log(editObj);
    movies.splice(findCardIndex, 0, editObj);
    nameM.value = "";
    yearM.value = "";
    category.value = "";
    rate.value = "";
    res("send","Add");
  };
  display(movies);
};
function display(dis_cards) {
  let result = "";
  for (let i = dis_cards.length; i >= 0; i--) {
    result += `
      <div class="cards position-relative">
      <img src="${dis_cards[i].bigThumbnail}" class="card-img-top" alt="...">
      <div class="card-body">
      <h5 class="card-title">${dis_cards[i].title}</h5>
      </div>
      <div>
      <ul class="list-group list-group-flush">
      <li class="list-group-item">${dis_cards[i].year}</li>
      <li class="list-group-item">${dis_cards[i].imdbRating}</li>
      <li class="list-group-item">${dis_cards[i].language}</li>
      </ul>
      <div class="card-body d-flex justify-content-around">
      <button type="button" class="btn btn-outline-primary">Watch Trailer</button>
      <button type="button" class="btn btn-outline-success" onclick="Booked(${dis_cards[i].imdbId})">Bookmark</button>
      <button type="button" class="edit" onclick="editCard(${dis_cards[i].imdbId})">Edit</button>
      <div class="position-absolute top-50 end-0 p-3 deleteCard"></div>
      </div>
      </div>
      </div>
      `;
  }
  content.innerHTML = result;


}

disDel();
function Booked(str) {
  if (typeof (str) === "object") str = str.id;
  findCard = movies.find((item) => item.imdbId == str);
  console.log();
  if (!(mas.find(item => item.imdbId===findCard.imdbId)) && !(mas.includes(""))) {
    mas.unshift(findCard);
    disDel();
  } else {
    alert("This card is already have in saved")
  }
}
function disDel() {
  let res = "";
  for (let i = 0; i < mas.length; i++) {
    res += `
    <div class="card-body d-flex justify-content-between gap-5 m-2">
    <h5 class="card-text">${mas[i].title}</h5>
    <button type="button" class="btn btn-danger h-25" onclick="deleteBooked(${mas[i].imdbId})">Remove</button>
    </div>
    </div>
    `;
  }
  book.innerHTML = res;
}
function res(con, textCon) {
  condition = con;
  sendB.textContent = textCon;
}
function editCard(cardId) {
  if(nameM.value == "" || yearM.value == "" || category.value == "" || rate.value == ""){
  res("edit", "Rename");
  findCard = movies.find((value)=> value.imdbId == cardId.id)
  findCardIndex = movies.findIndex((item) => item.id == cardId.id);
  bigThumbnail.src = findCard.bigThumbnail;
  nameM.value = findCard.title;
  yearM.value = findCard.year;
  rate.value = findCard.imdbRating;
  deleteCard(cardId);
} else alert("Please Enter clear or Rename button(depending on what you want to do)");
}
function deleteBooked(elementId) {
  let arr2 = mas.filter((element) => {
    return element.imdbId !== elementId.id;
  });
  mas = arr2;
  disDel();
}
function deleteCard(ElementId) {
  let arr2 = movies.filter((element) => {
    return element.imdbId !== ElementId.id;
  });
  movies = [...arr2];
  display(movies);
}
formS.addEventListener("submit", (e) => {
  e.preventDefault();
  sea_cards = [...movies];
  console.log(sea_c.value);
  if (sea_n.value !== null) sea_cards = sea_cards.filter((value) => value.title.includes(sea_n.value));
  if (sea_y.value!=="") sea_cards=sea_cards.filter((value) => value.year.toString().includes(sea_y.value.toString()));
  if (sea_c.value!=="All") sea_cards=sea_cards.filter((value) => value.categories.find((item)=>item==sea_c.value));
  if (sea_r.value !== "Rating(high to low)") {
    if (sea_r.value == "High") sea_cards = sea_cards.filter((value) => value.imdbRating >= 7.0);
    if (sea_r.value == "Low") sea_cards = sea_cards.filter((value) => value.imdbRating < 7);
    sea_cards.sort(compareValues('imdbRating'));
  }
  display(sea_cards);
});
display(movies);
form.addEventListener("submit", formHandler);

bigThumbnail.addEventListener("onclick",()=>bigThumbnail.src = URL.createObjectURL(imgIn.files[0]))

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

let token = localStorage.getItem('token');

if (!token) {
  window.location.replace("../index.html")
}

let url = "https://api.themoviedb.org/3/movie/changes?page=1"
let getData = async () => {
  let res = await fetch(url);

  let data = await res.json();
}
