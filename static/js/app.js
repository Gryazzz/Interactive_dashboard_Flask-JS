
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

var sample_otu = new Object();

function optionChanged(sample) {

    
    // var metadata = new Array();
    var wfrequency = '';
    
    Plotly.d3.json(("/samples/" + sample), function(error, response) {
        
        sample_otu = response;
        bubble_pie(sample_otu);
        // pieChart(sample_otu);
        // bubblePlot(sample_otu);
    });

    Plotly.d3.json(("/metadata/" + sample), function(error, response) {
        var metadata = response;
        render_metadata(metadata);
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
    var hover = labels.map((label) => {
        return otu[label-1]
    }); 

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
            t: 20,
            l: 20,
            r: 20,
            b: 20
        }
    };

    Plotly.newPlot(pie_plot, data, layout);

    window.addEventListener('resize', function() { Plotly.Plots.resize(pie_plot); }); //not working
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
}

function bubblePlot(dict) {

    var bubble_plot = Plotly.d3.select('#bubble-container').node();

    var labels = Object.values(dict[0])[0]; //x axis
    var values = Object.values(dict[0])[1]; //yaxis

    var hover_bubble = labels.map((lab) => {
        return otu[lab-1]
    });

    var data = [{
        x: labels,
        y: values,
        text: hover_bubble,
        mode: 'markers',
        marker: {
            size: values.map(el => el*8),
            // size: values,
            color: labels,
            colorscale: 'Rainbow',
            sizemode: 'area'
        }
    }];

    var layout = {
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
    }

    Plotly.newPlot(bubble_plot, data, layout);
    window.addEventListener('resize', function() { Plotly.Plots.resize(bubble_plot); });
}


function bubble_pie(dict) {

    var bubble_plot = Plotly.d3.select('#bubble-container').node();
    var pie_plot = Plotly.d3.select('#pie-container').node();

    var labels = Object.values(dict[0])[0]; //x axis
    var values = Object.values(dict[0])[1]; //yaxis

    // var hover_bubble = labels.map((lab) => {
    //     return otu[lab-1]
    // });

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
        hovertext: labels.slice(0,10).map((label) => {
            return otu[label-1]
        }),
        type: 'pie'
    }];
    // console.log(values);

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
}

