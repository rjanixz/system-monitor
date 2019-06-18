const _ = require('underscore');
const HashMap = require('hashmap');
const fs = require('fs');
const path = require('path');



const PROCESS =  {

    info: function() {
        // listado de usuarios
        const userLines = fs.readFileSync('/etc/passwd').toString().split('\n');
        const users = new HashMap();
        userLines.forEach(userLine => {
            const user = userLine.split(':');
            const userName = user[0];
            const userID = user[2]
            users.set(userID, userName);
        });


        // Memoria total
        const memInfo = fs.readFileSync('/proc/meminfo').toString().split('\n');
        const memTotal = memInfo[0].match(/\S+/g)[1];


        // Numero total de procesos
        const filesInProc = fs.readdirSync('/proc');
        const processList = _.filter(filesInProc, file => !isNaN(file));

        const totalProcesses = processList.length;
        let totalProcessesRunning = 0;
        let totalProcessesSuspended = 0;
        let totalProcessesStopped = 0;
        let totalProcessesZombie = 0;

        let processListObject = [];

        processList.forEach(pid => {
        
            // estado del proceso
            const pidStatus = fs.readFileSync('/proc/' + pid + '/status').toString().split('\n');

            const name = pidStatus[0].match(/\S+/g)[1];
            const state = pidStatus[2].match(/\S+/g)[1];
            let color = '';
            let cssclass = '';

            if (state === 'R') {
                totalProcessesRunning++;
                color = '#5c6bc0';
                cssclass = 'primary';
            }
            if (state === 'S') {
                totalProcessesSuspended++;
                color = '#ff4081';
                cssclass = 'pink';
            }
            if (state === 'T') {
                totalProcessesStopped++;
                color = '#18c5a9';
                cssclass = 'success';
            }
            if (state === 'Z') {
                totalProcessesZombie++;
                color = '#f39c12';
                cssclass = 'warning';
            }

            // userid
            const uid = fs.readFileSync('/proc/' + pid + '/loginuid').toString();

            // meminfo
            const statm = fs.readFileSync('/proc/' + pid + '/statm').toString();
            const memInPages = statm.match(/\S+/g)[1];
            const memKB = parseInt(memInPages) * 4096 / 1024;


            processListObject.push({
                pid: pid,
                name: name,
                state: state,
                userId: uid,
                userName: users.get(uid),
                mem: memKB,
                memP: (memKB * 100 / memTotal).toFixed(2),
                color: color,
                cssclass: cssclass
            });

        });

        console.log('Mem Total (KB): ' + memTotal);
        console.log ('Total Procesos: ' + totalProcesses);
        console.log ('Total Procesos en Ejecución: ' + totalProcessesRunning);
        console.log ('Total Procesos Suspendidos: ' + totalProcessesSuspended);
        console.log ('Total Procesos Detenios: ' + totalProcessesStopped);
        console.log ('Total Procesos Zombies: ' + totalProcessesZombie);

        //_.sortBy(processListObject, 'mem');

        //fs.writeFileSync('./processes.json', JSON.stringify(processListObject, null, 4) , 'utf-8');

        return {
            totalProcesses: totalProcesses,
            list: processListObject,
            memTotal: memTotal,
            totalProcessesRunning: totalProcessesRunning,
            totalProcessesSuspended: totalProcessesSuspended,
            totalProcessesStopped: totalProcessesStopped,
            totalProcessesZombie: totalProcessesZombie
        }
    }
}

module.exports = PROCESS;