const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
var _ = require('lodash')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()

let data = JSON.parse(fs.readFileSync('data.json'))
let korean_choice = _.sample(data.words)

function choose_a_new_word()
{
  korean_choice = _.sample(data.words)
}

function do_words_match (givenword, usersword)
{
  if (givenword == usersword)
  {
    //pof means "pass or fail"
    return {pof:"Nice job!!", back:"back?", repeat: false}
  }
  else
  {
    return {pof: "Almost! Keep your eyes on the prize!", back:"try again?", repeat: true}
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
  console.log(req.body);
  let uw = req.body.ans
  let dwm = do_words_match(korean_choice.Korean, uw);
  choose_a_new_word();
  // console.log(dwm);

  res.render('anscheck', {dwm, dwm})
})


var server = app.listen(process.env.PORT || 3000)
