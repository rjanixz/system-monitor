
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data)
    });
    chart.update();
}

$(function(){
 
    // RAM Chart
    var ctx = document.getElementById("earnings_chart").getContext("2d");
    var ramChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0'],
            datasets: [
                {
                    label: "% consumo CPU",
                    borderColor: 'rgba(92,107,192,0.7)',
                    pointBackgroundColor: 'rgba(92,107,192,1)',
                    pointBorderColor: 'rgba(92,107,192,1)',
                    pointHoverBorderWidth: 5,
                    data: [50],
                    borderWidth: 2,
                    fill: false,
                    lineTension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 0
                }
            },
            legend: {display: true}
        }
    });
    
    var second = 5;
    
    (function ramworker(){
        $.ajax({
            url: '/cpuinfo',
            success: function(data) {
                addData(ramChart, second.toString(), data.cpuUsageP);
                second += 5;
            }, 
            complete: function() {
                setTimeout(ramworker, 5000);
            }
        })
    })();

});