// var $names = d3.select('#names');


// add options to select #names
Plotly.d3.json('/names', function(error, response) {
    names =  response;
    names.forEach(name => {
        var option = d3.select('#names').append('option');
        option.attr('value', name);
        option.text(name);
    });
});






