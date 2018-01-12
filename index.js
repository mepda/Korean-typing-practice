/*TODO Make app more modular by having ability to load different files when some other
path is chosen.
*/

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fs = require('fs')
var _ = require('lodash')

let urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()

app.use(express.static('public'))
app.use(cookieParser());
app.use(bodyParser());

// let picture = ""
let answer_response_package = {}
let data = JSON.parse(fs.readFileSync('data.json'))
let korean_choice = _.sample(data.words)
let highscore = 0;
let hsplayer = "No one"
//
// function get_picture(start, end)
// {
//   picture = _.random(start, end)
// }

function choose_a_new_word()
{
  korean_choice = _.sample(data.words)
}

function make_response_package (givenword, usersword, keys_hit)
{

  if (givenword == usersword)
  {
    // get_picture(1, 5)
    //pof means "pass or fail"
    //took out picture: picture, keys_hit:keys_hit,
    return { useranswer: usersword, chosenword: givenword, pof:"Good show!!", back:"back?", correct: true}
  }
  else
  {
    // get_picture(6, 10)
    return { useranswer: usersword, chosenword: givenword, pof: "Almost! Keep your eyes on the prize!", back:"try again?", correct: false}
  }
}

app.set('views', './views')
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res, next)=>{
  console.log(req.body);
  hsplayer = req.body.payload[0];
  highscore = req.body.payload[1];
})

app.get('/', (req, res)=>{
  let playernum = req.cookies.player
  res.render('home', { highscore:highscore, hsplayer:hsplayer});
})

app.get('/game', (req, res)=>{
  answer_response_package = {}
  let word = korean_choice
  res.render('question', {word: word, highscore: highscore})
})

app.post('/game', (req, res, next)=>{
  let typed_word = req.body.message[0]
  let keys_hit = req.body.message[1]
  let given_word = req.body.message[2]
  answer_response_package = make_response_package(given_word, typed_word, keys_hit);
  choose_a_new_word();
  console.log(answer_response_package);
res.render('answer', {answer_response_package: answer_response_package, highscore:highscore})
})

app.get('/anscheck', (req, res)=>{
  res.render('answer', {answer_response_package: answer_response_package, highscore:highscore})
})

var server = app.listen(process.env.PORT || 3000)
