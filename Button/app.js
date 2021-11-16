var express = require('express'),
    mongoose = require('mongoose'),
    body_parser = require('body-parser'),
    request = require('request');

// Loading reCaptcha variables
var dotenv = require('dotenv');
const result = dotenv.config({path: './process.env'})
if (result.error) {
  throw result.error
}

var app = express();

app.use(express.static('./'));
app.use('/css', express.static('./css'));
app.use('/js', express.static('./js'));
app.use('/pictures', express.static('./pictures'));
app.set('views', './');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended : false}));

// Describes pages paths
app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/consent', function(req, res) {
    res.render('consent.html');
});

app.get('/experiment', function(req, res) {
    res.render('button.html');
});

// Database access
var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

mongoose.connect('mongodb://localhost/button_experiment');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

// Posts experimental results
app.post('/experiment-data', function(req, res){
    Entry.create(req.body);    
    res.end();
})

// Updates experimental feedback
app.post('/experiment-feedback/:id', function(req, res){
    Entry.updateOne({subjectID: parseInt(req.params.id)},
        {$set: {feedback: req.body.feedback}},
        function(err, docs){
            if(err){console.log(err);}
            else{console.log("Added feedback:", docs);}
        });   
    res.end();
})

// Checks captcha verification result
app.post('/submit-captcha',function(req,res){
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
    }
    var secretKey = process.env.RECAPTCHA_SECRET_KEY;
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }
        res.json({"responseCode" : 0, "responseDesc" : "Success"});
    });
});

// --- START THE SERVER 
var server = app.listen(3000, function(){
    console.log("Listening on port %d", server.address().port);
});