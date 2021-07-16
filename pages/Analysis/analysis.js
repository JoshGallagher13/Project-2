//Videogame Analysis

//Bar/line chart

    var xGames = [7667, 609, 5293, 16, 12, 2085, 9476, 74, 195, 75, 3445, 3162, 3030, 4551, 9, 4586, 2737, 5244, 3266, 260];
    var xSales = [1206.81999999998, 155.45, 346.169999999993, 0.31, 0.09, 363.979999999999, 596.639999999985, 11.86, 52.81, 5.39, 424.509999999998, 132.54, 547.709999999995, 502.119999999996, 1.89, 1051.73999999997, 320.319999999997, 1228.19999999998, 144.22, 3.46999999999999];
    var yGames = ['Action', 'Action-Adventure', 'Adventure', 'Board Game', 'Education', 'Fighting', 'Misc', 'MMO', 'Music', 'Party', 'Platform', 'Puzzle', 'Racing', 'Role-Playing', 'Sandbox', 'Shooter', 'Simulation', 'Sports', 'Strategy', 'Visual Novel'];
    var ySales = ['Action', 'Action-Adventure', 'Adventure', 'Board Game', 'Education', 'Fighting', 'Misc', 'MMO', 'Music', 'Party', 'Platform', 'Puzzle', 'Racing', 'Role-Playing', 'Sandbox', 'Shooter', 'Simulation', 'Sports', 'Strategy', 'Visual Novel'];

    var trace1 = {
        x: xGames,
        y: yGames,
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'bar',
        marker: {
            color: 'rgba(50,171,96,0.6)',
            line: {
                color: 'rgba(50,171,96,1.0)',
                width: 1
            }
        },
        name: 'Number of Games Produced between 1970 and 2020',
        orientation: 'h'
    };

    var trace2 = {
        x: xSales,
        y: ySales,
        xaxis: 'x2',
        yaxis: 'y1',
        mode: 'lines+markers',
        line: {
            color: 'rgb(128,0,128)'
        },
        name: 'All Time Global Sales'
    };

    var data = [trace1, trace2];

    var layout = {
        title: 'Videogame Production and Sales by Genre',
        xaxis1: {
            range: [0, 10000],
            domain: [0, 0.8],
            zeroline: false,
            showline: false,
            showticklabels: true,
            showgrid: true
        },
        xaxis2: {
            range: [-50, 1300],
            domain: [0.8, 1],
            zeroline: false,
            showline: false,
            showticklabels: true,
            showgrid: true,
            side: 'top',
            dtick: 500
        },
        legend: {
            x: 0.029,
            y: 1.238,
            font: {
                size: 10
        }
    },
        margin: {
            l: 100,
            r: 20,
            t: 200,
            b: 70
        },
        width: 600,
        height: 600,
        paper_bgcolor: 'rgb(248,248,255)',
        plot_bgcolor: 'rgb(248,248,255)',
        annotations: [
            {
            xref: 'paper',
            yref: 'paper',
            x: -0.2,
            y: -0.109,
            showarrow: false,
            font:{
                family: 'Arial',
                size: 10,
                color: 'rgb(150,150,150)'
            }
            }]
    };

    for ( var i = 0 ; i < xGames.length ; i++ ) {
        var result = {
            xref: 'x1',
            yref: 'y1',
            x: xGames[i]+2.3,
            y: yGames[i],
            text: xGames[i],
            font: {
                family: 'Arial',
                size: 12,
                color: 'rgb(50, 171, 96)'
            },
            showarrow: false,
        };
        var result2 = {
            xref: 'x2',
            yref: 'y1',
            x: xSales[i] - 20000,
            y: ySales[i],
            text: xSales[i] + ' M',
            font: {
                family: 'Arial',
                size: 12,
                color: 'rgb(128, 0, 128)'
            },
            showarrow: false
        };
        layout.annotations.push(result, result2);
    }

    Plotly.newPlot('graph', data, layout);

    