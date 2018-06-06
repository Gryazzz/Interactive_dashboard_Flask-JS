
var otu = new Array();

// add options to select #names
Plotly.d3.json('/names', function(error, response) {
    var names =  response;
    names.forEach(name => {
        var option = Plotly.d3.select('#names').append('option')
        .attr('value', name)
        .text(name);
    });
});

//get otu list
Plotly.d3.json("/otu", function(error, response) {
    otu = response;
});

// var metadata = new Array();

function optionChanged(sample) {

    // var sample_otu = new Object();
    var metadata = new Array();
    var wfrequency = '';
    
    Plotly.d3.json(("/samples/" + sample), function(error, response) {
        
        var sample_otu = response;
        // console.log(sample_otu);
        // console.log(otu);
        pieChart(sample_otu);

    });
    Plotly.d3.json(("/metadata/" + sample), function(error, response) {
        metadata = response;
        render_metadata(metadata);
        console.log(metadata);
    });
    Plotly.d3.json(("/wfreq/" + sample), function(error, response) {
        wfrequency = response;
    });    

};

function pieChart(dict ) {

    var pie_plot = Plotly.d3.select('#pie-container').node();

    var labels = Object.values(dict[0])[0].slice(0,10);
    var values = Object.values(dict[0])[1].slice(0,10);
    
    //extract otu's description for hovertext
    var hover = otu.filter((ot, index) => {
        if (labels.includes(index+1)) {
            return ot
        };
    }); 
    // console.log(hover);

    var data = [{
        values: values,
        labels: labels,
        hovertext: hover,
        type: 'pie'
    }];
    // console.log(values);

    var layout = {
        // 'title': 'Pirojok',
        height: Plotly.d3.select('.pie').node().offsetHeight,
        width: Plotly.d3.select('.pie').node().offsetWidth,
        autosize: true,
        margin: {
            t: 10,
            l: 10,
            r: 10,
            b: 10
        }
    };

    Plotly.newPlot(pie_plot, data, layout);

    window.addEventListener('resize', function() { Plotly.Plots.resize(pie_plot); });
};

function render_metadata(data) {
    Plotly.d3.select('thead')
    .append('tr')
    .append('td')
    .style('font-weight', 'bold')
    .html('Sample Metadata');

    Plotly.d3.select('tbody').selectAll('tr')
    .data(Object.keys(data))
    .enter()
    .append('tr')
    .html(function(d) {
        return `<td>${d}: ${data[d]}</td>`   
    });
}








