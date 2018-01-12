var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.2.1.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

function set_name(){
  let chosen_name = document.getElementById("name").value
  document.cookie = "name=" + chosen_name + "; expires=Thu, 18 Dec 2019 12:00:00 UTC; path=/";
  document.cookie = "score= 0; expires=Thu, 18 Dec 2019 12:00:00 UTC; path=/";
  document.getElementById("welcome_friend").innerHTML = "Welcome to the game, " + chosen_name + ".";
  document.getElementById("stats").innerHTML = "You currently have a score of: " + document.cookie.split("=")[2]
  document.getElementById("game_button_enable").style.display = "block";
}

function delete_name(){
  document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "score=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  location.reload()
}

function name_exists(){
  if(document.cookie.split("=")[1] === undefined){
    document.getElementById("name_setter").style.display = "block";

  }
  else if (document.cookie.split("=")[1].length > 0){
    document.getElementById("welcome_friend").innerHTML = "Welcome back, " + document.cookie.split("=")[1].split(";")[0] + ".";
    document.getElementById("stats").innerHTML = "Your score : " + document.cookie.split("=")[2] + "."
    document.getElementById("game_button_enable").style.display = "block";
  }
}

function enter_hit()
{
  let charCode = event.keyCode
  if (charCode == 13)
  {
    set_name()
  }
}

console.log("clientjs loaded");
let player_score;
let player_name;

function populate_name_and_score(){
  // document.getElementById("user_name").innerHTML = document.cookie.split("name")[1]
  console.log(document.cookie.split(";"));
  let uncrumbled = document.cookie.split(";")
  player_name = uncrumbled[0].split("=")[1]
  player_score = uncrumbled[1].split("=")[1]
  // document.getElementById("user_name").innerHTML = player_name
  // document.getElementById("user_score").innerHTML = player_score
  console.log("player score:", player_score);
  console.log("player name:", player_name);
}

function check_highscore(high_score){
  console.log("player score: " + player_score);
  console.log("high score: " + high_score);
  if(player_score > high_score){
    console.log("ps greater than hs");
    let ps = document.cookie.split(";")[1].split("=")[1]
    let pn = document.cookie.split(";")[0].split("=")[1]
    let payload = [pn, ps]
    console.log(payload);
    $.post('/', {"payload": payload})
  }
}
function increase_score(){
  console.log("increase score called");
  player_score++
  document.cookie = "score=" + player_score + "; expires=Thu, 18 Dec 2019 12:00:00 UTC; path=/";
}

function test(){
  console.log("test clicked");
}

let keystrokes = 0;
//fix for firefox
function CheckKey(e) //receives event object as parameter
{
   var code = e.keyCode ? e.keyCode : e.which;
   if(code === 13)
   {
       passbackword()
   }
}

function typingCounter()
{
  let charCode = event.keyCode
  console.log(charCode)
  if(charCode == 13){ passbackword() }
  else if((charCode > 64 && charCode < 91) ||
  (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 229){
    console.log(event.keyCode);
    keystrokes++;
  }
  document.getElementById('keystrokes').innerHTML = keystrokes;
}
//I know this doens't sound secure, but it's just passing the word back to the server
function passbackword()
{
  let Korean_word = $("#Korean_word").text()
  let data = []
  let reply = $("#answer").val()
  let keycount = $("#keystrokes").text()
  data.push(reply)
  data.push(keycount)
  data.push(Korean_word)
  console.log(data);
  $.ajax({
    method: 'POST',
    url: "/game",
    data: {message : data},
    success: function(){
      console.log("success verbose ajax POST");
      location = "anscheck"
    }
  })
}
