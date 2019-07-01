const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.disable('etag');


// Connection URL
const url = 'mongodb://admin:admin@35.225.220.91:27017';
 
// Database Name
const DB_NAME = 'sopes1proyecto';

const COLLECITON_NAME = 'tweets';

/*
// procesos
app.get('/', (req, res) => {
    const info = require('./process').info();
    res.render('process', {
        list: info.list,
        memTotal: info.memTotal,
        totalProcesses: info.totalProcesses,
        totalProcessesRunning: info.totalProcessesRunning,
        totalProcessesSuspended: info.totalProcessesSuspended,
        totalProcessesStopped: info.totalProcessesStopped,
        totalProcessesZombie: info.totalProcessesZombie,
    });
});


// RAM
app.get('/ram', (req, res) => {
    const info = require('./ram').info();
    res.render('ram', {
        memTotal: info.memTotal,
        memUsage: info.memUsage
    });
});

app.get('/raminfo', (req, res) => {
    const info = require('./ram').info();
    res.json({
        memUsageP: info.memUsageP
    })
});


// CPU
app.get('/cpu', (req, res) => {
    res.render('cpu', {
    });
});

app.get('/cpuinfo', (req, res) => {

    require('os-utils').cpuUsage(function(v){
        cpuUsageP = Math.trunc(v * 100);
        console.log( 'CPU Usage (%): ' + cpuUsageP);

        res.json({
            cpuUsageP: cpuUsageP
        })
    });
});



app.get('/login', (req, res) => {
    res.render('login', {
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username + ' : ' + password);
    if (username === 'admin' && password === 'admin') {
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});
*/

app.get('/api/tweets', (req, res) => {

    MongoClient.connect(url, function(err, client) {
            
        if (err) throw err;
        console.log("Connected successfully to server");
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECITON_NAME);
        const list = collection.find({}).toArray(function(err, result){
            res.json(result);
        });
        
    });

});

app.get('/api/tweet', (req, res) => {


    const usr = req.query.usr;
    const nom = req.query.nom;
    const txt = req.query.txt;

    try {

        const tweet = {
            alias_usuario: usr,
            nombre: nom,
            txt: txt,
            categoria: '#test'
        };

        require('./mongo').insert(tweet);

        res.json({
            success: true,
            tweet: tweet
        });
    } catch(e) {
        res.json({
            success: false,
            error: e
        });
    }

});


app.get('/api/delete-tweets', (req, res) => {

    try {
        require('./mongo').delete();

        res.json({
            success: true
        });
    } catch(e) {
        res.json({
            success: false,
            error: e
        });
    }

});

// static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Express server startd on port ${PORT}`));