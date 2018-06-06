
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

// var sample_otu = new Object();

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
        // console.log(metadata);
    });
    Plotly.d3.json(("/wfreq/" + sample), function(error, response) {
        wfrequency = response;
    });    

};

// var hover = new Array();

function pieChart(dict ) {

    var pie_plot = Plotly.d3.select('#pie-container').node();

    var labels = Object.values(dict[0])[0].slice(0,10);
    var values = Object.values(dict[0])[1].slice(0,10);
    
    //extract otu's for hover
    var hover = otu.filter((ot, index) => {
        if (labels.includes(index+1)) {
            return ot
        };
    }); 
    // console.log(hover);

    var data = [{
        values: values,
        labels: labels,
        names: hover,
        type: 'pie'
    }];
    // console.log(values);

    var layout = {
        // 'title': 'Pirojok',
        height: Plotly.d3.select('.pie').node().offsetHeight,
        width: Plotly.d3.select('.pie').node().offsetWidth,
        autosize: true,
        hoverinfo: 'label+value+name',
        margin: {
            t: 20,
            l: 20,
            r: 20,
            b: 20
        }
    };

    Plotly.newPlot(pie_plot, data, layout);

    window.addEventListener('resize', function() { Plotly.Plots.resize(pie_plot); });
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




