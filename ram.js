const fs = require('fs');

const RAM =  {

    info: function() {
        // Memoria total
        const memInfo = fs.readFileSync('/proc/meminfo').toString().split('\n');
        const memTotal = parseInt(memInfo[0].match(/\S+/g)[1]) / 1024;
        const memFree = parseInt(memInfo[1].match(/\S+/g)[1]) / 1024;
        const memAvailable = parseInt(memInfo[2].match(/\S+/g)[1]) /1024;
        const buffers = parseInt(memInfo[3].match(/\S+/g)[1]) /1024;
        const cache = parseInt(memInfo[4].match(/\S+/g)[1]) /1024;
        const cache2 = parseInt(memInfo[22].match(/\S+/g)[1]) /1024;


        // Used = Total - free - bufferd - cache
        const memUsage = memTotal - memFree - buffers - cache - cache2;
        const memUsageP = memUsage * 100 / memTotal;

        console.log('MemTotal (MB) ' + Math.trunc(memTotal));
        //console.log('MemFree (MB) ' + Math.trunc(memFree));
        //console.log('MemAvailable (MB) ' + Math.trunc(memAvailable));
        //console.log('Buffers (MB) ' + Math.trunc(buffers));
        //console.log('Cache (MB) ' + Math.trunc(cache));
        console.log('MeUsage (MB) ' + Math.trunc(memUsage));
        console.log('MeUsage (%) ' + Math.trunc(memUsageP));


        return {
            memTotal: Math.trunc(memTotal),
            memUsage: Math.trunc(memUsage),
            memUsageP: Math.trunc(memUsageP)
        }
    }
}

module.exports = RAM;