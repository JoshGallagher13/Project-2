/***********************************/
// This is the event listener function that is attached to the dropdown
/**********************************/
function handleGenre(){
    selected_genre = d3.select('#genre_dropdown').node().value;
    console.log(selected_genre);

    buildCharts(selected_genre);
}

/***********************************/
// This is the function that creates the charts
/**********************************/
function buildCharts(selected_genre) {
    d3.json('/api/game_player_summary').then(data => {
        var games2 = data.map(d => d['game']);
        var player_count2 = data.map(d => d['players_sum']);
        var hours2 = data.map(d => d['hours_sum']);
        var rank2 = data.map(d => d['rank']);
        // preview data in the console
        console.log(data);

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
        var rank = filteredData.map(d => d['rank']);

        

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
                color: 'rgb(158,202,225)',
                line: {
                color: 'rgb(8,48,107)',
                width: 1.5
                }
            }
        };

        var data = [trace1];

        var layout = {
            title: `${selected_genre} Player stuff`,
            yaxis: {
                automargin: true
            }
        };

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
                color: 'rgb(158,202,225)',
                line: {
                color: 'rgb(8,48,107)',
                width: 1.5
                }
            }
            };
        
            var data = [trace1];
        
            var layout = {
                title: `${selected_genre} Hours stuff`,
                yaxis: {
                    automargin: true
                }
            };
        
            Plotly.newPlot('hours-plot', data, layout);
        
            var trace3 = {
                x: rank2,
                y: hours2,
                mode: 'markers',
                marker: {
                    color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
                    pacity: [1, 0.8, 0.6, 0.4],
                    size: 2
                }
            };
            
            var data = [trace3];
            
            var layout = {
                title: 'Marker Size and Color',
                showlegend: false,
                height: 600,
                width: 600
            };
            
            Plotly.newPlot('bubble-plot', data, layout);
    });
}

/***********************************/
// Generate the list of genres
/**********************************/
var genre_dropdown = d3.select('#genre_dropdown');
d3.json('/api/get_genres').then(data => {
    genres = data.map(d => d['genre']);

    genres.forEach(genre => {

        if(genre) {
            genre_dropdown.append('option').attr('value', genre).text(genre);
        }
    });
});