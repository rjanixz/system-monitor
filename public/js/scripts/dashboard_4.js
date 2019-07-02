
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data)
    });
    chart.update();
}

$(function(){
 /*
    // RAM Chart
    var ctx = document.getElementById("earnings_chart").getContext("2d");
    var ramChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0'],
            datasets: [
                {
                    label: "% consumo RAM",
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
            legend: {display: true}
        }
    });
    
    var second = 5;
    
    (function ramworker(){
        $.ajax({
            url: '/raminfo',
            success: function(data) {
                addData(ramChart, second.toString(), data.memUsageP);
                second += 5;
            }, 
            complete: function() {
                setTimeout(ramworker, 5000);
            }
        })
    })();*/


    $.ajax({
        url: '/api/pie',
        success: function(data) {

            var ctx = document.getElementById("earnings_chart").getContext("2d");
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            data: data.values,
                            backgroundColor: [
                                '#5C6BC0',
                                '#18C5A9',
                                '#2CC4CB',
                                '#F39C12',
                                '#f75a5f',
                                '#bdc3c7',
                                '#FF4081',
                                '#34495f',
                                '#7536e6',
                                '#3498DB'
                            ],
                            label: 'Top 10 categoría'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                        display: true,
                        position: 'right',
                        fullwidth: false
                    }
                }
            });

        }, 
        complete: function() {
            console.log('pie created')
        }
    })

});