


/***********************************/
// This is the event listener function that is attached to the dropdown
/**********************************/
function handleGenre(){
    selected_genre = d3.select('#genre_dropdown').node().value;
    buildCharts(selected_genre);
}


/***********************************/
//Functions to create hexcolor codes based on string
/**********************************/
function hashCode(str) { 
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

/***********************************/
// This is the function that creates the charts
/**********************************/
function buildCharts(selected_genre) {
    d3.json('/api/game_player_summary').then(data => {
        // apply a filter to the data set to only return records for the selected genre
        filteredData = data.filter(d => d['genre'] == selected_genre);
        
        // sort our data in descending order based on player_sum 
        filteredData.sort((a, b) => b['players_sum'] - a['players_sum']);

        // select only the top 10 records
        filteredData = filteredData.slice(0, 10);

        // because Plot displays data in reverse order, we should reverse our data set
        filteredData.reverse();

        // Use the map function to create independent arrays that only contain the data that you need for the plots
        var games = filteredData.map(d => d['game']); 
        var player_count = filteredData.map(d => d['players_sum']);
        var hours = filteredData.map(d => d['hours_sum']);
        
        // Manipulate arrays for further plot data
        var hoursTot = hours.reduce((a, b) => a + b, 0);
        var avgHours = (hoursTot/games.length);
        var rank = filteredData.map(d => d['rank']);
        var avgGameHours = []
        for (var i = 0; i < hours.length; i++) {
            avgGameHours.push(parseInt(hours[i] / player_count[i]));
        }

        // Create unique color for each game
        var gameColor =[] 
        games.forEach(game => {gameColor.push(intToRGB(hashCode(game)))})
        
        // Generate Players plot
        var trace1 = {
            x: player_count,
            y: games,
            type: 'bar',
            orientation: 'h',
            text: player_count.map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            opacity: 0.5,
            marker: {
                color: gameColor,
                line: {
                color: 'rgb(8,48,107)',
                width: 1.5
                }
            }
        };
        var data = [trace1];
        var layout = {
            title: `${selected_genre} Player Count`,
            titlefont: {family: 'monospace'},
            yaxis: {
                automargin: true
            }};

        Plotly.newPlot('players-plot', data, layout);

        // Generate Hours plot
        var trace1 = {
            x: hours,
            y: games,
            type: 'bar',
            orientation: 'h',
            text: hours.map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            opacity: 0.5,
            marker: {
                color: gameColor,
                line: {
                color: 'rgb(8,48,107)',
                width: 1.5
                }
            }
        };
        
        var data = [trace1];
        var layout = {
            title: `${selected_genre} Hours Played`,
            titlefont: {family: 'monospace'},
            yaxis: {
                automargin: true
            }
        };
        Plotly.newPlot('hours-plot', data, layout);
            
        // Range of axis for scatter plot
        var minRank=filteredData.sort((a, b) => b['rank'] - a['rank']).reverse()[0]['rank'];
        var maxRank=filteredData.sort((a, b) => b['rank'] - a['rank'])[0]['rank'];
        
        // Generate scatter plot
        var trace3 = {
            x: rank,
            y: avgGameHours,
            text: games,
            
            mode: 'markers',
            marker: {
                color: gameColor,
                opacity: 0.5,
                size: 15
            }
        };
        var data = [trace3];
        var layout = {
            title: 'Avg Hours per Player vs. Sales Rank',
            titlefont: {family: 'monospace'},
            showlegend: false,
            xaxis: {
                title: 'Sales Rank',
                range: [maxRank+5000,minRank-5000],
                titlefont: {
                    family: 'monospace',
                    size: 18,
                    color: 'black'
                }
            },
            yaxis: {
                
                title: 'Hours per Player',
                titlefont: {
                    family: 'monospace',
                    size: 18,
                    color: 'black'
                }
            },
        };
        Plotly.newPlot('bubble-plot', data, layout);

        // Generate gauge plot
        var data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: avgHours,
            title: `Avg Hrs of ${selected_genre} Games `,
            titlefont: {family: 'monospace'},
            type: "indicator",
            mode: "gauge+number+delta",
            delta: { reference: 114423 },
            gauge: {
                axis: { range: [null, 120000] },
                bar: { color: "#4d6891" },
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 114423
                }
            }
        }];
        var layout = {  margin: { t: 0, b: 0 } };
        Plotly.newPlot('other-plot', data, layout);
        
        
        /***********************************/
        // Functions for analysis
        /**********************************/
        
        // Turns array into integers and sorts
        function maxs(array){
        var nodec_hours = []
        array.forEach(d => nodec_hours.push(parseInt(d.toFixed())))
        nodec_hours.sort((a, b) => b- a)
        return nodec_hours
        }

        // Returns index of largest integer
        function gameMax(array){
            var nodec_hours = []
            array.forEach(d => nodec_hours.push(parseInt(d.toFixed())))
            return nodec_hours.indexOf(Math.max.apply(Math, nodec_hours))
            }
        
        // Returns index of smallest integer
        function gameMin(array){
            var nodec_hours = []
            array.forEach(d => nodec_hours.push(parseInt(d.toFixed())))
            return nodec_hours.indexOf(Math.min.apply(Math, nodec_hours))
            }
        



        /***********************************/
        // Analysis inserted into elements
        /**********************************/
        
        // For players plot
        document.getElementById("players-analysis").innerHTML = `${games[gameMax(player_count)]} was the game with the most players by a margin of ${maxs(player_count)[0]-maxs(player_count)[1]} players`
        document.getElementById("players-analysis2").innerHTML = `Which was a ${(((maxs(player_count)[0]/maxs(player_count)[1])-1)*100).toFixed()}% lead over 2nd spot`
        document.getElementById("players-analysis3").innerHTML = `And a  ${(((maxs(player_count)[0]/maxs(player_count).slice(-1)[0])-1)*100).toFixed()}% lead over the last spot`
        // For hours plot
        document.getElementById("hours-analysis").innerHTML = `${games[gameMax(hours)]} had the most time played by a margin of ${maxs(hours)[0] - maxs(hours)[1]} hours`
        document.getElementById("hours-analysis2").innerHTML = `Which was a ${(((maxs(hours)[0]/maxs(hours)[1])-1)*100).toFixed()}% lead over 2nd spot`
        document.getElementById("hours-analysis3").innerHTML = `And a  ${(((maxs(hours)[0]/maxs(hours).slice(-1)[0])-1)*100).toFixed()}% lead over the last spot`
        // For bubble plot
        document.getElementById("bubble-analysis").innerHTML =`${games[gameMax(avgGameHours)]} had the highest average playtime by a margin of ${maxs(avgGameHours)[0] - maxs(avgGameHours)[1]} hours`
        document.getElementById("bubble-analysis2").innerHTML = `Which was a ${(((maxs(avgGameHours)[0]/maxs(avgGameHours)[1])-1)*100).toFixed()}% lead over 2nd spot`
        document.getElementById("bubble-analysis3").innerHTML = `And a  ${(((maxs(avgGameHours)[0]/maxs(avgGameHours).slice(-1)[0])-1)*100).toFixed()}% lead over the last spot`
        document.getElementById("bubble-analysis4").innerHTML =`${games[gameMin(rank)]} had the highest sales rank by a margin of ${maxs(rank).slice(-2)[0] - maxs(rank).slice(-1)[0]} spots`
        document.getElementById("bubble-analysis5").innerHTML = `Which was a ${(((maxs(rank).slice(-2)[0]/maxs(rank).slice(-1)[0])-1)*100).toFixed()}% lead over 2nd spot`
        document.getElementById("bubble-analysis6").innerHTML = `And a  ${(((maxs(rank)[0]/maxs(rank).slice(-1)[0])-1)*100).toFixed()}% lead over the last spot`
        // For gauge plot
        document.getElementById("other-analysis").innerHTML = `${selected_genre}'s top 10 games had an average of ${avgHours.toFixed()} hours played per game`
        document.getElementById("other-analysis2").innerHTML = `Which was ${114423-avgHours.toFixed()} hours less than the strategy genre's average of 114423 hours per game`
    });
}

/***********************************/
// Generate the list of genres
/**********************************/
var genre_dropdown = d3.select('#genre_dropdown');
d3.json('/api/get_genres').then(data => {
    genres = data.map(d => d['genre']);
    records = data.map(d => d['record_count'])
    genres.forEach(genre => {

        if(genre) {
            genre_dropdown.append('option').attr('value', genre).text(genre);
        }
    });
    records.length--;
    genres.length--;

    /***********************************/
    // Generate radial plot with Apex.js library
    /**********************************/

    var options = {
        chart: {
            type: 'radar',
            height: 400,
            fontFamily: 'monospace'
        },
        series: [{
            name: 'Number of Games',
            data: records
        }],
        xaxis: {
            categories: genres
        },
        dataLabels: {
            enabled: true,
            background: {
                enabled: true,
                borderRadius:1,
            }
        },
        title: {
            text: 'Games per Genre',
            align: 'center',
            margin: 0,
            offsetX: 0,
            offsetY: 350,
            floating: true,
            style: {
                fontSize:  '20px',
                fontWeight:  'bold',
                fontFamily:  undefined,
                color:  '#263238'
            },
        }
    }
    var chart = new ApexCharts(document.querySelector("#summary-plot"), options);
    chart.render();
});



/***********************************/
// Initialization function
/**********************************/
function init(){
    selected_genre = 'Action'
    buildCharts(selected_genre);
}

init();