/*TODO should probably rename some stuff, like "keys_hit" could be taken to mean
something offensive instead of just, well, keys hit.

Make app more modular by having ability to load different files when some other
path is chosen.
*/

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
var _ = require('lodash')

let urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()

app.use(express.static('public'))


let picture = ""
let answer_response_package = {}
let data = JSON.parse(fs.readFileSync('data.json'))
let korean_choice = _.sample(data.words)

function get_picture(start, end)
{
  picture = _.random(start, end)
}

function choose_a_new_word()
{
  korean_choice = _.sample(data.words)
}

function make_response_package (givenword, usersword, keys_hit)
{

  if (givenword == usersword)
  {
    get_picture(1, 5)
    //pof means "pass or fail"
    return {picture: picture, keys_hit: keys_hit, useranswer: usersword, chosenword: givenword, pof:"Good show!!", back:"back?", correct: true}
  }
  else
  {
    get_picture(6, 10)
    return {picture: picture, keys_hit:keys_hit, useranswer: usersword, chosenword: givenword, pof: "Almost! Keep your eyes on the prize!", back:"try again?", correct: false}
  }
}

app.set('views', './views')
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res)=>{
  dwm = {}
  let word = korean_choice
  res.render('quizpage', {word: word})
})

app.post('/', (req, res, next)=>{
  let typed_word = req.body.message[0]
  let keys_hit = req.body.message[1]
  let given_word = req.body.message[2]
  //dwm means do words match, uw means userword
  answer_response_package = make_response_package(given_word, typed_word, keys_hit);
  choose_a_new_word();
  // console.log(dwm.correct);
  console.log(answer_response_package);
res.render('anscheck', {answer_response_package: answer_response_package})
})

app.get('/anscheck', (req, res)=>{
  res.render('anscheck', {answer_response_package: answer_response_package})
})

var server = app.listen(process.env.PORT || 3000)
