const express = require('express');
const app = express();

app.get('/', function(req, res) {
 res.send('Hello')
})

app.listen(5000, () => {
 console.log('Server is runing on successfully')
})