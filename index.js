const _ = require('underscore');
const HashMap = require('hashmap');
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


app.get('/', (req, res) => {
    res.redirect('/login')
});



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


*/
app.get('/login', (req, res) => {
    res.render('login', {});
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username + ' : ' + password);
    if (username === 'admin' && password === 'admin') {
        res.redirect('/tweets');
    } else {
        res.redirect('/login');
    }
});

app.get('/tweets', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
        if (err) throw err;
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECITON_NAME);

        let q = req.query.q;

        let query = {};
        if (q) {
            q = q.replace('%23', '#');
            query = {
                txt: new RegExp(q)
            }
        }

        collection.find(query).toArray(function(err, result){
            res.render('tweets', {
                tweets: result,
                total: result.length,
                q: q
            });
        });
        
    });
});


app.get('/dashboard', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
        if (err) throw err;
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECITON_NAME);


        collection.find({}).toArray(function(err, result){

            let totalTweets = result.length;
            const totalUsuarios = new HashMap();
            const totalCategorias = new HashMap();

            _.forEach(result, tweet => {
                if (totalUsuarios.has(tweet.alias_usuario)) {
                    totalUsuarios.set(tweet.alias_usuario, parseInt(totalUsuarios.get(tweet.alias_usuario)) + 1);
                } else {
                    totalUsuarios.set(tweet.alias_usuario, 1);
                }

                if (totalCategorias.has(tweet.categoria)) {
                    totalCategorias.set(tweet.categoria, parseInt(totalCategorias.get(tweet.categoria)) + 1);
                } else {
                    totalCategorias.set(tweet.categoria, 1)
                }
            });
            
            let usrMaxTotal = 0;
            let usrMaxNombre = '';

            totalUsuarios.forEach(function(total, usr) {
                if (total > usrMaxTotal) {
                    usrMaxTotal = total;
                    usrMaxNombre = usr;
                }
            });

            let categoriaMaxTotal = 0;
            let categoriaMaxNombre = '';

            totalCategorias.forEach((total, categoria) => {

                if (total > categoriaMaxTotal) {
                    categoriaMaxTotal = total;
                    categoriaMaxNombre = categoria;
                }
            });


            res.render('dashboard', {
                totalTweets: totalTweets,
                totalUsuarios: totalUsuarios.size,
                totalCategorias: totalCategorias.size,
                totalImagenes: 0,
                usrMaxNombre, usrMaxNombre,
                usrMaxTotal: usrMaxTotal,
                categoriaMaxNombre: categoriaMaxNombre,
                categoriaMaxTotal: categoriaMaxTotal
            });
        });
        
    });
});

app.get('/api/pie', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
        if (err) throw err;
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECITON_NAME);


        collection.find({}).toArray(function(err, result){

            let totalTweets = result.length;
            const totalCategorias = new HashMap();

            _.forEach(result, tweet => {

                if (totalCategorias.has(tweet.categoria)) {
                    totalCategorias.set(tweet.categoria, parseInt(totalCategorias.get(tweet.categoria)) + 1);
                } else {
                    totalCategorias.set(tweet.categoria, 1)
                }
            });

            const categoriaList = totalCategorias.entries();



            let categoriaListObj =  _.map(categoriaList, entry => {
                return {
                    cat: entry[0],
                    total: entry[1]
                }
            });

            categoriaListObj = _.sortBy(categoriaListObj, function(item) {
                return - item.total;
            })
            

            const labels = [];
            const values = [];
            let cont = 0;

            categoriaListObj.forEach(item => {

                if (cont < 10) {
                    labels.push(item.cat);
                    values.push(item.total);
                }
            })
            

            res.json({
                labels: labels,
                values: values
            })
        });
        
    });
});


///////////////////////// API


app.get('/api/tweets', (req, res) => {

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
        if (err) throw err;
        console.log("Connected successfully to server");
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECITON_NAME);
        collection.find({}).toArray(function(err, result){
            res.json(result);
        });
        
    });

});

app.get('/api/tweet', (req, res) => {

    let categoria = '#';
    const url = req.url;    
    const catindex = url.indexOf('%23');

    if (catindex >0) {
        const urlcat = req.url.substring(catindex);
        const endindex = urlcat.indexOf('%20');
        if (endindex > 0) {
            categoria = urlcat.substring(0, endindex);
        } else {
            categoria = urlcat;
        }
        
    }
    
    categoria = categoria.replace('%23', '#');

    const usr = req.query.usr;
    const nom = req.query.nom;
    const txt = req.query.txt;

    try {

        const tweet = {
            alias_usuario: usr,
            nombre: nom,
            txt: txt,
            categoria: categoria
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