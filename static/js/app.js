var $names = d3.select('#names');
var names_list='';

Plotly.d3.json('/names', function(error, response) {
    console.log(response);
    names_list = response;
})

