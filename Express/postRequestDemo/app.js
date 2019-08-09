const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs')



//GET FRIENDS

let friends = ['Emma', 'Daim', 'Tom']

app.get('/friends', (req, res) => {
 res.render('friends', {friends: friends})
})

//MAKING REQUEST WITH NODE

 request('https://jsonplaceholder.typicode.com/todos/1', (err, response, body) => {
  if(err){
   console.log(err)
  }else{
   console.log(response)
   let convertToJson = JSON.parse(body)
   console.log(body)
   console.log(convertToJson)
  }
})




//POST REQUEST

app.post('/addfriend', (req, res) => {
 console.log(req.body.Emmanuel)
 friends.push(req.body.newFriend)
 res.redirect('friends')
})


app.listen(5000, () => {
 console.log('Server is up and runing')
})