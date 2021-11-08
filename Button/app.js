var express = require('express');

var express = require('express'),
    mongoose = require('mongoose'),
    body_parser = require('body-parser');

var app = express();

app.use(express.static('./'));
app.use('/css', express.static('./css'));
app.use('/js', express.static('./js'));
app.use('/pictures', express.static('./pictures'));
app.set('views', './');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(body_parser.json());

app.get('/', function(request, response) {
    response.render('consent.html');
});

app.get('/experiment', function(request, response) {
    response.render('button.html');
});

var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

mongoose.connect('mongodb://localhost/button_experiment');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

app.post('/experiment-data', function(request, response){
    Entry.create(request.body);    
    response.end();
})

app.post('/experiment-feedback/:id', function(request, response){
    Entry.updateOne({subjectID: parseInt(request.params.id)},
        {$set: {feedback: request.body.feedback}},
        function(err, docs){
            if(err){console.log(err);}
            else{console.log("Added feedback:", docs);}
        });   
    response.end();
})

// --- START THE SERVER 
var server = app.listen(3000, function(){
    console.log("Listening on port %d", server.address().port);
});