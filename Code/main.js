function createGraph() {

    var barChart = d3.selectAll('#plot').append('svg').style('width', '100%').style('height', '100%');
    var width = 25;
    var height = 8;
    console.log(chicagoData['features']);
    var g = barChart.selectAll('.bar')
        .data(chicagoData['features'])
        .enter()
        .append('g')
        .attr('class', 'bar');

    var x = d3.scaleLog().domain([1, 1000]).range([0, 200]);
    console.log(x(10));

    g.append('rect')
        .style('stroke-width', '1')
        .style('stroke', 'rgb(0,0,0)')
        .style('fill', 'rgb(255,255,255)')
        .attr('x', 200)
        .attr('y', (d, i) => { return 5 + (height + 7) * i })
        .attr('width', (d, i) => { return x(d['properties']['count']) })
        .attr('height', height)
        .attr('id', (d, i) => { return d['properties']['community']})

    g.append('text')
        .style('fill', 'rgb(0,0,0)')
        .attr('x', 0)
        .attr('y', (d, i) => { return 15 + (height + 7) * i })
        .text((d, i) => { return d['properties']['community']; })

    //****************  Map   ********************/
    var map = L.map('map').setView([41.8, -87.7], 11); // change the zoom in or zoom out

    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    function style(feature) {
        var colorScale = d3.scaleQuantize()
            .range(colorbrewer.YlOrRd[8])
            .domain([0, 55000]);
        return {
            fillColor: colorScale(feature.properties.count),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        var selectedArea = layer.feature.properties.community;
        d3.selectAll("#" + selectedArea).style('fill', 'rgb(252, 199, 86)')

        layer.bringToFront();
        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        d3.selectAll("rect").style('fill', 'rgb(255,255,255)')
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
        info.update();

    }

    //Custom Info Control
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>The # of Taxi Trips in Chicago areas</h4>' + (props ?
            '<b>' + props.community + '</b><br />' + 'Area number: ' + props.area_numbe + '</b><br />'
            + props.count + ' trips in 2021'
            : 'Hover over a community area');
    };

    info.addTo(map);


    var geojson = L.geoJson(chicagoData, { style: style, onEachFeature: onEachFeature }).addTo(map);

}


function init() {
    //createMap();
    //createBarChart();
    createGraph()
}

window.onload = init;

//queue()
//    .await(createGraph);




