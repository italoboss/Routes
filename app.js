var express = require('express'),
    http = require('http'),
    request = require('request'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    app = express();
var dbOperations = require("./js/dbOperations.js");
var logFmt = require("logfmt");

app.use(session({secret: '1234567890QWERTY'}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.get('/' , function(req, res) {
    if (req.session.user) {
        res.sendfile('views/index.html');
    }
    else {
        res.sendfile('views/login.html');
    }
});
app.post('/db/doLogin', function(req, res) {
    dbOperations.validateUser(req, res);
});
app.post('/db/doLogout', function(req, res) {
    req.session.user = null;
    res.end();
});
app.post('/db/read/routes', function(req, res){
    dbOperations.getRoutes(req, res);
});
app.get('/db/read/stops', function(req, res){
    dbOperations.getStopsOfRoute(req, res);
});
app.post('/db/add/route', function(req, res){
    dbOperations.addRoute(req, res);
});
app.delete('/db/del/route', function(req, res){
    dbOperations.delRoute(req, res);
});
app.set('port', process.env.PORT || 3001);
app.use(express.static(__dirname + '/client'));
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
