

//interactive with dropdown
Plotly.d3.csv('https://raw.githubusercontent.com/JoshGallagher13/Project-2/main/resources/steam_sales_data.csv', function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }
    
    var allGenreNames = unpack(rows, 'Genre'),
        allRatings = unpack(rows, 'ESRB_Rating'),
        listofGenres = [],
        currentGenre,
        listofRatings = [],
        currentRating = [];

        for (var i = 0; i < allGenreNames.length; i++ ){
            if (listofGenres.indexOf(allGenreNames[i]) === -1 ){
            listofGenres.push(allGenreNames[i]);
            }
        }    
        
        function getGenreData(chosenGenre) {
            currentRating = [];
            currentGenre = [];
                for (var i = 0 ; i < allGenreNames.length ; i++){
                    if ( allGenreNames[i] === chosenGenre ) {
                    currentRating.push(allRatings[i]);
                    currentGenre.push(allGenreNames[i]);
                } 
            }
        };

    // Default Genre Data
    setBubblePlot('Action');
    
    function setBubblePlot(chosenGenre) {
        getGenreData(chosenGenre);  
    
        var trace1 = {
            x: currentRating,
            type: 'histogram'
        };  
    
        var data = [trace1];
    
        var layout = {
            title: 'Number of Games with Rating (placeholder) <br>'+ chosenGenre,
        };
    
        Plotly.newPlot('plotdiv', data, layout, {showSendToCloud: true});
    };
    
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