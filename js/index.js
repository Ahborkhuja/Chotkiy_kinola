let form = document.querySelector("#form");
let login = document.querySelector(".login");
let pass = document.querySelector(".password");

form.addEventListener("submit",(e)=>{
  e.preventDefault();
  let email = login.value.trim();
  let password = pass.value.trim();

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      email: email,
      password: password
    })
  }
  fetch("https://reqres.in/api/login",options)
  .then(res=>res.json())
  .then(data =>{
    if(data?.token){
      window.localStorage.setItem("token",data.token);
      window.location.replace("../home.html")
    }
    console.log(data);
  })
})