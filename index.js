const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
var _ = require('lodash')

var urlencodedParser = bodyParser.urlencoded({ extended: false })
/*TODO should probably rename some stuff, like "keyshit" could be taken to mean
something offensive instead of just, well, keys hit.

Make app more modular by having ability to load different files when some other
path is chosen.
*/
const app = express()

app.use(express.static('public'))


let picture = ""
let dwm = {}
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

function do_words_match (givenword, usersword, keyshit)
{

  if (givenword == usersword)
  {
    get_picture(1, 5)
    //pof means "pass or fail"
    return {picture: picture, keyshit: keyshit, useranswer: usersword, chosenword: givenword, pof:"Good show!!", back:"back?", correct: true}
  }
  else
  {
    get_picture(6, 10)
    return {picture: picture, keyshit:keyshit, useranswer: usersword, chosenword: givenword, pof: "Almost! Keep your eyes on the prize!", back:"try again?", correct: false}
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
  let uw = req.body.message[0]
  let keyshit = req.body.message[1]
  //dwm means do words match, uw means userword
  dwm = do_words_match(korean_choice.Korean, uw, keyshit);
  choose_a_new_word();
  console.log(dwm.correct);
  console.log(dwm);
res.render('anscheck', {dwm: dwm})
})

app.get('/anscheck', (req, res)=>{
  res.render('anscheck', {dwm: dwm})
})

var server = app.listen(process.env.PORT || 3000)
