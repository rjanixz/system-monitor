/*var os = require('os');

console.log(os.cpus());
console.log(os.totalmem());
console.log(os.freemem())

console.log("------------");
*/
var os = require('os-utils');

var CPU = {

    info: function() {
        let cpuUsageP = 0;
        os.cpuUsage(function(v){
            cpuUsageP = Math.trunc(v * 100);
            console.log( 'CPU Usage (%): ' + v );
        });
        console.log( 'CPU Usage (%): ' + cpuUsageP );
        return {
            cpuUsageP: cpuUsageP
        }
    }
}


module.exports = CPU;

