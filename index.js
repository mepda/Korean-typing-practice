const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
var _ = require('lodash')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()

let korean_words = []
let data = JSON.parse(fs.readFileSync('data.json'))
let korean_choice = _.sample(data.words).Korean
// console.log(korean_choice.Korean);

// let words = ["hi", "sup", "how's it going"]
// let choice = _.sample(words)

function choose_a_new_word()
{
  korean_choice = _.sample(data.words).Korean
}

function do_words_match (givenword, usersword)
{
  if (givenword == usersword)
  {
    //pof means "pass or fail"
    return {pof:"Nice job!!", back:"back?"}
  }
  else
  {
    return {pof: "Almost! Keep your eyes on the prize!", back:"try again?"}
  }
}

app.set('views', './views')
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res)=>{
  let word = korean_choice
  res.render('quizpage', {word: word})
})

app.post('/', (req, res)=>{
  console.log("post request");
  let uw = req.body.ans
  let dwm = do_words_match(korean_choice, uw);
  choose_a_new_word();
  console.log(dwm);

  res.render('anscheck', {dwm, dwm})
})


var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})
