

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

function optionChanged(sample) {

    var sample_otu = new Object();
    var metadata = new Array();
    var wfrequency = '';
    
    Plotly.d3.json(("/samples/" + sample), function(error, response) {
        
        sample_otu = response;
        // console.log(sample_otu);
        // console.log(otu);
        pieChart(sample_otu);

    });
    Plotly.d3.json(("/metadata/" + sample), function(error, response) {
        metadata = response;
        // console.log(metadata);
    });
    Plotly.d3.json(("/wfreq/" + sample), function(error, response) {
        wfrequency = response;
    });    

};


function pieChart(dict) {

    var pie_plot = Plotly.d3.select('#pie-container').node();

    var data = [{
        values: Object.values(dict[1])[0].slice(0,9),
        labels: Object.values(dict[0])[0].slice(0,9),
        type: 'pie'
    }];

    var layout = {
        // 'title': 'Pirojok',
        height: Plotly.d3.select('.pie').node().offsetHeight,
        width: Plotly.d3.select('.pie').node().offsetWidth,
        autosize: true,
        margin: {
            t: 20, //top margin
            l: 20, //left margin
            r: 20, //right margin
            b: 20 //bottom margin
            }
    };

    Plotly.newPlot(pie_plot, data, layout);

    // window.onresize = function() {
    //     Plotly.Plots.resize(pie_plot);
    //     var window_width = window.innerWidth;
    //     var content_div_width = Plotly.d3.select('.pie').node().offsetWidth - 20;
    //     if (content_div_width > (window_width - 40)) {
    //         var svg_container = document.getElementById('pie-container').getElementsByClassName('plot-container')[0].getElementsByClassName('svg-container')[0];
    //         svg_container.style.height = (window_width - 40) + 'px';
    //         Plotly.Plots.resize(pie_plot);
    //       }
    // }   
    
};   
//     // var piePl = document.getElementById('piePlot');
//     // var piePl = d3.select('#piePlot').node();
//     var piePlot = pie_pl.node();

//     Plotly.newPlot(piePlot, data);

//     // window.addEventListener('resize', function() { Plotly.Plots.resize(piePl); });
//     window.onresize = function() {
//         Plotly.relayout(piePlot, {
//             'xaxis.autorange': true,
//             'yaxis.autorange': true
//         });
//     };
// };




