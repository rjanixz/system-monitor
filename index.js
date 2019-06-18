const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.disable('etag');

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
  //  const info = require('./cpu').info();
    res.render('cpu', {
 //       cpuTotal: info.cpuTotal,
 //       cpuUsage: info.cpuUsage
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


// static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Express server startd on port ${PORT}`));