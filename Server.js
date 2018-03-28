var express = require('express');
var app = express();

var path = require('path');

app.use(express.static(__dirname));

app.listen(3001, function listening() {
    console.log("listening on port 3001");
})
