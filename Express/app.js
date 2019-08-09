const express = require('express');
const app = express();


app.set('view engine', 'ejs')

//SERVING STATIC FILES
app.use(express.static('public'))

//ROUTES

app.get('/', function(req, res) {
 res.render('home')
})


app.get('/r/:subredditName', function(req, res){
 let subreddit = req.params.subredditName

 
 res.send(`Welcome to the ${subreddit} of subreddit`)
 console.log(req.params)
})

app.get('/post', (req, res) => {
  let posts = [
   {title: 'My dog is Cute', author : 'Emmanuel'},
   {title: 'My dog is Long', author : 'Tweneboah'}
  ];
  res.render('posts', {postsVar: posts})
})

//PAGE NOT FOUND ROUTE

app.get('*', function(req, res) {
 res.send('<h1>Page Not Found</h1>')
})


app.listen(5000, () => {
 console.log('Server is runing on successfully')
})