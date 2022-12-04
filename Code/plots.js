var area = Array.from(new Set(summer.map(d => d.Pickup_Community_Area)));

var areaColor = d3.scaleOrdinal().domain(area).range(d3.schemeCategory10);

function createbarChart1() {
  const margin = { top: 10, right: 20, bottom: 50, left: 50 };

  const visWidth = 500;
  const visHeight = 200;

  const svg = d3.select('#bar1').append('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // create scales

  const x = d3.scaleLinear()
    .range([0, visWidth]);

  const y = d3.scaleBand()
    .domain(areaColor.domain())
    .range([0, visHeight])
    .padding(0.2);

  // create and add axes

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);

  const xAxisGroup = g.append("g")
    .attr("transform", `translate(0, ${visHeight})`);

  xAxisGroup.append("text")
    .attr("x", visWidth / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Count");

  const yAxis = d3.axisLeft(y);

  const yAxisGroup = g.append("g")
    .call(yAxis)
    // remove baseline from the axis
    .call(g => g.select(".domain").remove());

  let barsGroup = g.append("g");

  function update(data) {

    // get the number of taxi for each origin
    const areaCounts = d3.rollup(
      data,
      group => group.length,
      //v => d3.sum(v, d => d.Trip_Total),
      d => d.Pickup_Community_Area
    );


    // get the total cost for each area
    const areaTotalCost = d3.rollup(
      data,
      v => d3.sum(v, d => d.Trip_Total),
      d => d.Pickup_Community_Area
    );



    // update x scale
    x.domain([0, d3.max(areaCounts.values())]).nice()

    // update x axis

    const t = svg.transition()
      .ease(d3.easeLinear)
      .duration(200);

    xAxisGroup
      .transition(t)
      .call(xAxis);

    // draw bars
    barsGroup.selectAll("rect")
      .data(areaCounts, ([Pickup_Community_Area, avgCost]) => Pickup_Community_Area)
      .join("rect")
      .attr("fill", ([Pickup_Community_Area, avgCost]) => areaColor(Pickup_Community_Area))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("y", ([Pickup_Community_Area, avgCost]) => y(Pickup_Community_Area))
      .transition(t)
      .attr("width", ([Pickup_Community_Area, avgCost]) => x(avgCost))
  }

  return Object.assign(svg.node(), { update });;

}






function createScatter1() {

  var margin = ({ top: 40, right: 20, bottom: 50, left: 105 });
  var visWidth = 400;
  var visHeight = 440;


  

  var xScale = d3.scaleLinear()
    .domain([0, 50])
    .range([0, visWidth]);
  var yScale = d3.scaleLinear()
    .domain([0, 200])
    .range([visHeight, 0]);

  var xAxis = (g, scale, label) =>
    g.attr('transform', `translate(0, ${visHeight})`)
      // add axis
      .call(d3.axisBottom(scale))
      // remove baseline
      .call(g => g.select('.domain').remove())
      // add grid lines
      // references https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
        .attr('stroke', '#d3d3d3')
        .attr('y1', -visHeight)
        .attr('y2', 0))
      // add label
      .append('text')
      .attr('x', visWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text(label)

  var yAxis = (g, scale, label) =>
    // add axis
    g.call(d3.axisLeft(scale))
      // remove baseline
      .call(g => g.select('.domain').remove())
      // add grid lines
      // refernces https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
        .attr('stroke', '#d3d3d3')
        .attr('x1', 0)
        .attr('x2', visWidth))
      // add label
      .append('text')
      .attr('x', -40)
      .attr('y', visHeight / 2)
      .attr('fill', 'black')
      .attr('dominant-baseline', 'middle')
      .text(label)



  //set up

  // the value for when there is no brush
  const initialValue = summer;

  const svg = d3.select('#scat1').append('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom)
    .property('value', initialValue);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // axes
  g.append("g").call(xAxis, xScale, 'Miles');
  g.append("g").call(yAxis, yScale, 'Total Price($)');

  // draw points

  const radius = 3;

  const dots = g.selectAll('circle')
    .data(summer)
    .join('circle')
    .attr('cx', d => xScale(d.Trip_Miles))
    .attr('cy', d => yScale(d.Trip_Total))
    .attr('fill', d => areaColor(d.Pickup_Community_Area))
    .attr('opacity', 1)
    .attr('r', radius);

  // add title
  svg.append("text")
    .attr('class', 'title')
    .attr('x', (visWidth / 2) + 90)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text('Miles vs Total Price in Summer');

  // ********** brushing here **********

  const brush = d3.brush()
    // set the space that the brush can take up
    .extent([[0, 0], [visWidth, visHeight]])
    // handle events
    .on('brush', onBrush)
    .on('end', onEnd);

  g.append('g')
    .call(brush);

  function onBrush(event) {
    // event.selection gives us the coordinates of the
    // top left and bottom right of the brush box
    const [[x1, y1], [x2, y2]] = event.selection;

    // return true if the dot is in the brush box, false otherwise
    function isBrushed(d) {
      const cx = xScale(d.Trip_Miles);
      const cy = yScale(d.Trip_Total)
      return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
    }

    // style the dots
    dots.attr('fill', d => isBrushed(d) ? areaColor(d.Pickup_Community_Area) : 'gray');

    // update the data that appears in the trips variable
    svg.property('value', summer.filter(isBrushed)).dispatch('input');
  }

  function onEnd(event) {
    // if the brush is cleared
    if (event.selection === null) {
      // reset the color of all of the dots
      dots.attr('fill', d => areaColor(d.Pickup_Community_Area));
      svg.property('value', initialValue).dispatch('input');
    }
  }

  return svg.node();
}


function createbarChart2() {
  const margin = { top: 10, right: 20, bottom: 50, left: 50 };

  const visWidth = 500;
  const visHeight = 200;

  const svg = d3.select('#bar2').append('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // create scales

  const x = d3.scaleLinear()
    .range([0, visWidth]);

  const y = d3.scaleBand()
    .domain(areaColor.domain())
    .range([0, visHeight])
    .padding(0.2);

  // create and add axes

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);

  const xAxisGroup = g.append("g")
    .attr("transform", `translate(0, ${visHeight})`);

  xAxisGroup.append("text")
    .attr("x", visWidth / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Count");

  const yAxis = d3.axisLeft(y);

  const yAxisGroup = g.append("g")
    .call(yAxis)
    // remove baseline from the axis
    .call(g => g.select(".domain").remove());

  let barsGroup = g.append("g");

  function update(data) {

    // get the number of taxi for each origin
    const areaCounts = d3.rollup(
      data,
      group => group.length,
      //v => d3.sum(v, d => d.Trip_Total),
      d => d.Pickup_Community_Area
    );


    // get the total cost for each area
    const areaTotalCost = d3.rollup(
      data,
      v => d3.sum(v, d => d.Trip_Total),
      d => d.Pickup_Community_Area
    );



    // update x scale
    x.domain([0, d3.max(areaCounts.values())]).nice()

    // update x axis

    const t = svg.transition()
      .ease(d3.easeLinear)
      .duration(200);

    xAxisGroup
      .transition(t)
      .call(xAxis);

    // draw bars
    barsGroup.selectAll("rect")
      .data(areaCounts, ([Pickup_Community_Area, avgCost]) => Pickup_Community_Area)
      .join("rect")
      .attr("fill", ([Pickup_Community_Area, avgCost]) => areaColor(Pickup_Community_Area))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("y", ([Pickup_Community_Area, avgCost]) => y(Pickup_Community_Area))
      .transition(t)
      .attr("width", ([Pickup_Community_Area, avgCost]) => x(avgCost))
  }

  return Object.assign(svg.node(), { update });;

}


function createScatter2(){

  var margin = ({ top: 40, right: 20, bottom: 50, left: 105 });
  var visWidth = 400;
  var visHeight = 440;


  

  var xScale = d3.scaleLinear()
    .domain([0, 50])
    .range([0, visWidth]);
  var yScale = d3.scaleLinear()
    .domain([0, 30])
    .range([visHeight, 0]);

  var xAxis = (g, scale, label) =>
    g.attr('transform', `translate(0, ${visHeight})`)
      // add axis
      .call(d3.axisBottom(scale))
      // remove baseline
      .call(g => g.select('.domain').remove())
      // add grid lines
      // references https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
        .attr('stroke', '#d3d3d3')
        .attr('y1', -visHeight)
        .attr('y2', 0))
      // add label
      .append('text')
      .attr('x', visWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text(label)

  var yAxis = (g, scale, label) =>
    // add axis
    g.call(d3.axisLeft(scale))
      // remove baseline
      .call(g => g.select('.domain').remove())
      // add grid lines
      // refernces https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
        .attr('stroke', '#d3d3d3')
        .attr('x1', 0)
        .attr('x2', visWidth))
      // add label
      .append('text')
      .attr('x', -40)
      .attr('y', visHeight / 2)
      .attr('fill', 'black')
      .attr('dominant-baseline', 'middle')
      .text(label)



  //set up

  // the value for when there is no brush
  const initialValue = summer;

  const svg = d3.select('#scat2').append('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom)
    .property('value', initialValue);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // axes
  g.append("g").call(xAxis, xScale, 'Miles');
  g.append("g").call(yAxis, yScale, 'Tips');

  // draw points

  const radius = 3;

  const dots = g.selectAll('circle')
    .data(summer)
    .join('circle')
    .attr('cx', d => xScale(d.Trip_Miles))
    .attr('cy', d => yScale(d.Tips))
    .attr('fill', d => areaColor(d.Pickup_Community_Area))
    .attr('opacity', 1)
    .attr('r', radius);

  // add title
  svg.append("text")
    .attr('class', 'title')
    .attr('x', (visWidth / 2) + 90)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text('Miles vs Tips in Summer');

  // ********** brushing here **********

  const brush = d3.brush()
    // set the space that the brush can take up
    .extent([[0, 0], [visWidth, visHeight]])
    // handle events
    .on('brush', onBrush)
    .on('end', onEnd);

  g.append('g')
    .call(brush);

  function onBrush(event) {
    // event.selection gives us the coordinates of the
    // top left and bottom right of the brush box
    const [[x1, y1], [x2, y2]] = event.selection;

    // return true if the dot is in the brush box, false otherwise
    function isBrushed(d) {
      const cx = xScale(d.Trip_Miles);
      const cy = yScale(d.Tips)
      return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
    }

    // style the dots
    dots.attr('fill', d => isBrushed(d) ? areaColor(d.Pickup_Community_Area) : 'gray');

    // update the data that appears in the trips variable
    svg.property('value', summer.filter(isBrushed)).dispatch('input');
  }

  function onEnd(event) {
    // if the brush is cleared
    if (event.selection === null) {
      // reset the color of all of the dots
      dots.attr('fill', d => areaColor(d.Pickup_Community_Area));
      svg.property('value', initialValue).dispatch('input');
    }
  }

  return svg.node();
}


function init() {
  const summerData = createScatter1()
  const bar1 = createbarChart1();

  d3.select(summerData).on('input', () => {
    bar1.update(summerData.value);
  });

  // intial state of bar chart
  bar1.update(summerData.value);


  const tipsData = createScatter2()
  const bar2 = createbarChart2();

  d3.select(tipsData).on('input', () => {
    bar2.update(tipsData.value);
  });

  // intial state of bar chart
  bar2.update(tipsData.value);
}

window.onload = init;
