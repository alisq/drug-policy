var express = require('express');
var bodyParser = require('body-parser');
var Datastore = require('nedb');

var app = express();
var server = app.listen(31717, listening);
var db = new Datastore({ filename: 'data.json', autoload: true });
db.persistence.setAutocompactionInterval(43200000); //compact data file every 12 hours

var countries;

function listening(){
    console.log("listening ...");
};

app.use(express.static('public')); //load files from this route
app.use(bodyParser.urlencoded({limit: '50mb', extended:false}));
app.use(bodyParser.json({limit: '50mb'})); //use a json body parser

app.post('/update', updateCountries); //save notes on this route

function loadCountries(){
    db.find({}, function(err, docs){ //find all items in database
        if (err){
            countries = err;
        } else {
            countries = docs;
        }

        app.get('/countries', function(request, response){ // send all notes to this route
            console.log('Loaded countries from data.json file');
            response.send(countries);
        }); 
    });
};

loadCountries();

function updateCountries(request, response){
    var updatedCountries = request.body.data;
    updatedCountries = JSON.parse(updatedCountries);
    
    // Removing All documents
    db.remove({}, { multi: true }, function (err, numRemoved) {
        console.log(numRemoved + ' Countries Removed');
    });
    
    // Adding New Documents
    db.insert(updatedCountries, function(err, newDocs){
        if (err){
            response.send(err);
        } else {
            console.log(newDocs.length + ' Countries Added');
            response.send('data.json file is updated and contains a total of ' + newDocs.length + ' countries');
        };
    });
};
