var express = require('express')
var app = express()

app.get('/', function (req, res) {
  
})

app.use(express.static('ver_3'))

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
