const express = require('express');
const app = express();
const request = require('request');


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
   res.render('search')
})


app.get('/results', (req, res) => {
   let myQuery = req.query.searchQuery
    request(`http://www.omdbapi.com/?s=${myQuery}&apikey=thewdb`, (error, response, body) => {
     console.log('Query',req.query)
     if(response ){
     let data = JSON.parse(body)
     res.render('results', {data: data})
      
     }
    })
})



//PAGE NOT FOUND ROUTE

app.get('*', function(req, res) {
 res.send('<h1>Page Not Found</h1>')
})


app.listen(5000, () => {
 console.log('Server is runing on successfully')
})