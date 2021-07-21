//interactive with dropdown
Plotly.d3.csv('https://raw.githubusercontent.com/JoshGallagher13/Project-2/main/resources/steam_sales_data.csv', function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }
    

    var allGenreNames = unpack(rows, 'Genre'),
        allRatings = unpack(rows, 'ESRB_Rating'),
        //allRanks=unpack(rows, 'Ranks'),
        allPlayers=unpack(rows, 'Players'),
        //allPercent_Play=unpack(rows, 'Percent_Play'),
        allPublisher=unpack(rows, 'Publisher'),
        allCritic_Score=unpack(rows, 'Critic_Score'),
        allUser_Score=unpack(rows, 'User_Score'),
        allGame=unpack(rows, 'Game'),
        allHours=unpack(rows, 'Hours'),

        

        listofGenres = [],
        currentGenre,
        listofRatings = [],
        currentRating = [];
        
        for (var i = 0; i < allGenreNames.length; i++ ){
            if (listofGenres.indexOf(allGenreNames[i]) === -1 ){
            listofGenres.push(allGenreNames[i]);
            }
        }    
        
        //var groupBy = function(xs, key) {
        //    return xs.reduce(function(rv, x) {
        //      (rv[x[key]] = rv[x[key]] || []).push(x);
        //      return rv;
        //    }, {});
        //  };
        //  console.log(groupBy(allGenreNames, 'length'));

        function getGenreData(chosenGenre) {
            currentRating = [];
            currentGenre = [];
            currentHours = [];
            currentCriticScore = [];
                for (var i = 0 ; i < allGenreNames.length ; i++){
                    if ( allGenreNames[i] === chosenGenre ) {
                    currentRating.push(allRatings[i]);
                    currentGenre.push(allGenreNames[i]);
                    currentHours.push(allHours[i]);
                    currentCriticScore.push(allCritic_Score[i]);
                } 
            }
        };

    // Default Genre Data
    setBubblePlot('Shooter');
    
    function setBubblePlot(chosenGenre) {
        getGenreData(chosenGenre);  
    
        var trace1 = {
            x: currentCriticScore,
            type: 'histogram'
        };  
    
        var data = [trace1];
    
        var layout = {
            title: 'Number of Games with Critic Score per Genre (placeholder) <br>'+ chosenGenre,
        };
    
        Plotly.newPlot('plotdiv', data, layout, {showSendToCloud: true});
    };
    
    var options = {
        chart: {
            type: 'line',
            height: '300',
        },
        series: [{
            type: 'line',
            name: 'Critic Score',
            data: currentCriticScore},
            {type:'line',
            name: 'Hours Played',
            data: currentHours}],
            xaxis: {
                type: 'category',
                categories: listofGenres
            },
        
            stroke: {
            curve: 'smooth',
            }
        }
    
        var chart = new ApexCharts(document.querySelector("#graph"), options);
    
        chart.render();







    var innerContainer = document.querySelector('[data-num="0"'),
        plotEl = innerContainer.querySelector('.plot'),
        genreSelector = innerContainer.querySelector('.genredata');
    
    function assignOptions(textArray, selector) {
        for (var i = 0; i < textArray.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = textArray[i];
            selector.appendChild(currentOption);
        }
    }
    
    assignOptions(listofGenres, genreSelector);
    
    function updateGenre(){
        setBubblePlot(genreSelector.value);
    }
    
    genreSelector.addEventListener('change', updateGenre, false);
    });