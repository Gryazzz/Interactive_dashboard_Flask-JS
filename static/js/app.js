
var otu = new Array();
var wfrequency = '';

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

    Plotly.d3.json(("/samples/" + sample), function(error, response) {
        
        sample_otu = response;
        bubble_pie(sample_otu);
    });

    Plotly.d3.json(("/metadata/" + sample), function(error, response) {
        var metadata = response;
        render_metadata(metadata);
    });

    Plotly.d3.json(("/wfreq/" + sample), function(error, response) {
        wfrequency = response;
        gauge(wfrequency);
    });    

};

function bubble_pie(dict) {

    var bubble_plot = Plotly.d3.select('#bubble-container').node();
    var pie_plot = Plotly.d3.select('#pie-container').node();

    var labels = Object.values(dict[0])[0]; //x axis
    var values = Object.values(dict[0])[1]; //yaxis

    var data_bubble = [{
        x: labels,
        y: values,
        text: labels.map((label) => {
            return otu[label-1]
        }),
        mode: 'markers',
        marker: {
            size: values.map(el => el*8),
            // size: values,
            color: labels,
            colorscale: 'Rainbow',
            sizemode: 'area'
        }
    }];

    var layout_bubble = {
        height: Plotly.d3.select('.bubble').node().offsetHeight,
        width: Plotly.d3.select('.bubble').node().offsetWidth,
        autosize: true,
        margin: {
            t: 20,
            l: 40,
            r: 40,
            b: 40
        },
        xaxis: {
            title: 'Otu_ID',
        }
    };

    var data_pie = [{
        values: values.slice(0,10),
        labels: labels.slice(0,10),
        pull: values.slice(0,10).map((v, ind) => {
            if (ind === 0) {
                return 0.1
            }
            else {
                return 0.0
            }
        }),
        marker: {
            line: {
              color: 'rgb(205, 228, 228)',
              width: 2
            }
        },
        textfont: {
            color: 'white',
            // size: 18
        },
        hovertext: labels.slice(0,10).map((label) => {
            return otu[label-1]
        }),
        type: 'pie'
    }];

    var layout_pie = {
        // 'title': 'Pirojok',
        height: Plotly.d3.select('.pie').node().offsetHeight,
        width: Plotly.d3.select('.pie').node().offsetWidth,
        autosize: true,
        margin: {
            t: 20,
            l: 20,
            r: 20,
            b: 20
        }
    };

    Plotly.newPlot(pie_plot, data_pie, layout_pie);
    Plotly.newPlot(bubble_plot, data_bubble, layout_bubble);

    window.addEventListener('resize', function() { Plotly.Plots.resize(pie_plot); });
    window.addEventListener('resize', function() { Plotly.Plots.resize(bubble_plot); });
};

function render_metadata(data) {

    Plotly.d3.selectAll('tr').remove();
    
    //render header
    Plotly.d3.select('thead').selectAll('tr')
    .data(['Sample Metadata'])
    .enter()
    .append('tr')
    .classed('head', true)
    .append('td')
    .style('font-weight', 'bold')
    .html(function (d) {return d})

    //render body
    Plotly.d3.select('tbody').selectAll('tr')
    .data(Object.keys(data))
    .enter()
    .append('tr')
    .html(function(d) {
        return `<td>${d}: ${data[d]}</td>`   
    });
};

function gauge(wfrequency) {

    var gauge_plot = Plotly.d3.select('#gauge-container').node();

    var degrees = 180 - wfrequency*18,
        radius = .4;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [

        {type: 'scatter',
        x:[0],
        y:[0],
        marker: {size: 15, color:'rgb(0, 22, 229)'},
        showlegend: false,
        name: 'times per week',
        text: wfrequency,
        hoverinfo: 'text+name'},

        {type: 'pie',
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100],
        text: ["never", "almost never", "occasionally", "sometimes", "more than others", "almost every day", "every day", "almost ideally", "clean winner", ""],
        direction: "clockwise",
        textinfo: 'text',
        textposition: "inside",
        labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
        hoverinfo: "label",
        marker: {colors:['rgba(229, 12, 0, 0.6)', 'rgba(224, 64, 0, 0.6)',
                         'rgba(219, 113, 0, 0.6)', 'rgba(214, 160, 0, 0.6)',
                         'rgba(210, 205, 0, 0.6)', 'rgba(162, 205, 0, 0.6)',
                         'rgba(112, 200, 0, 0.6)', 'rgba(64, 195, 0, 0.6)',
                         'rgba(18, 191, 0, 0.6)', 'white']},

    }];

    var layout = {
        // shapes:[{
        //     type: 'line',
        //     x0: 0,
        //     y0: 0,
        //     x1: x,
        //     y1: y,
        //     fillcolor: 'rgb(0, 22, 229)',
        //     line: {
        //         color: 'rgb(0, 22, 229)'
        //     }
        //   }],
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: 'rgb(0, 22, 229)',
            line: {
                color: 'rgb(0, 22, 229)'
            }
        }],
        title: '<b>Belly Button Washing frequency</b> <br> Per Week',
        // height: Plotly.d3.select('.gauge').node().offsetHeight,
        // width: Plotly.d3.select('.gauge').node().offsetWidth,
        autosize: true,
        margin: {
            t: 60,
            // l: 20,
            // r: 20,
            b: 20
        },
        xaxis: {visible: false, range: [-1, 1]},
        // yaxis: {visible: false, zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
        yaxis: {visible: false, range: [-1, 1]}
    };
    Plotly.newPlot(gauge_plot, data, layout);    

};

// function pieChart(dict ) {

//     var pie_plot = Plotly.d3.select('#pie-container').node();

//     var labels = Object.values(dict[0])[0].slice(0,10);
//     var values = Object.values(dict[0])[1].slice(0,10);
    
//     //extract otu's description for hovertext
//     var hover = labels.map((label) => {
//         return otu[label-1]
//     }); 

//     var data = [{
//         values: values,
//         labels: labels,
//         hovertext: hover,
//         type: 'pie'
//     }];
//     // console.log(values);

//     var layout = {
//         // 'title': 'Pirojok',
//         height: Plotly.d3.select('.pie').node().offsetHeight,
//         width: Plotly.d3.select('.pie').node().offsetWidth,
//         autosize: true,
//         margin: {
//             t: 20,
//             l: 20,
//             r: 20,
//             b: 20
//         }
//     };

//     Plotly.newPlot(pie_plot, data, layout);

//     window.addEventListener('resize', function() { Plotly.Plots.resize(pie_plot); }); //not working
// };



// function bubblePlot(dict) {

//     var bubble_plot = Plotly.d3.select('#bubble-container').node();

//     var labels = Object.values(dict[0])[0]; //x axis
//     var values = Object.values(dict[0])[1]; //yaxis

//     var hover_bubble = labels.map((lab) => {
//         return otu[lab-1]
//     });

//     var data = [{
//         x: labels,
//         y: values,
//         text: hover_bubble,
//         mode: 'markers',
//         marker: {
//             size: values.map(el => el*8),
//             // size: values,
//             color: labels,
//             colorscale: 'Rainbow',
//             sizemode: 'area'
//         }
//     }];

//     var layout = {
//         height: Plotly.d3.select('.bubble').node().offsetHeight,
//         width: Plotly.d3.select('.bubble').node().offsetWidth,
//         autosize: true,
//         margin: {
//             t: 20,
//             l: 40,
//             r: 40,
//             b: 40
//         },
//         xaxis: {
//             title: 'Otu_ID',
//         }
//     }

//     Plotly.newPlot(bubble_plot, data, layout);
//     window.addEventListener('resize', function() { Plotly.Plots.resize(bubble_plot); });
// }




