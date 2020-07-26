

fetch('/polymer-database.json')
.then(function(response) {
  return response.json();
})
.then(function(myJson) {
 
  myJson.polymers.forEach((polymer) =>{
    const specUrl = polymer.spectrum;

d3.csv(specUrl).then(function(dataset) {
    
    dataset.forEach(d =>{
      d.wavelength = +d.wavelength;
      d.absorbance = +d.absorbance;
    })

    const w=850;
    const h=450;
    const padding=80;

    const svg=d3.select("#"+polymer.name)
    .append('svg')
    .attr('width', w)
    .attr('height', h);

    const tooltip = d3.select("#"+polymer.name)
    .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
      
    const xScale=d3.scaleLinear()
    .domain([3799.8, 599.9])
    .range([padding, w-padding]);
    
    const yScale=d3.scaleLinear()
     .domain([d3.max(dataset, (d) => d.absorbance), 0])
    .range([padding, h-padding]);
    
    
    const xAxis = d3.axisBottom(xScale).ticks(7, 'f');
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
    
    const line = d3.line()
    .x(d => xScale(d.wavelength))
    .y(d => yScale(d.absorbance))
    .curve(d3.curveMonotoneX);
    
    svg.append('g')
    .attr('transform', 'translate(0, '+(h-padding)+')')
    .attr('id', 'x-axis')
    .call(xAxis)
    .append("text")
    .attr("y", padding-10)
    .attr("x", (w/2))
    .attr("text-anchor", "center")
    .attr("stroke", "black")
    .text("Wavelength, cm-1")
     .style("font-size", 16)
    .style('fill', 'black');
    
    svg.append('g')
    .attr('transform', 'translate('+padding+', 0)')
    .attr('id', 'x-axis')
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -55)
    .attr('x', -170) 
    .attr("text-anchor", "center")
    .attr("stroke", "black")
    .text("Absorbance, a.u.")
    .style("font-size", 16)
    .style('fill', 'black');

    svg.append('path')
    .datum(dataset)
    .attr("class", "line")
    .attr("d", line);

   const bisectDate = d3.bisector(d => d.wavelength).left;

   const focus = svg.append("g")
   .attr("class", "focus")
   .style("display", "none");

   focus.append("line")
   .attr("class", "x-hover-line hover-line")
   .attr("y1", 0)
   .attr("y2", h);

   focus.append("line")
   .attr("class", "y-hover-line hover-line")
   .attr("x1", w)
   .attr("x2", w);

   focus.append("circle")
   .attr("r", 2.5);

   focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 250)
            .attr("height", 180)
            .attr("x", 20)
            .attr("y", -55)
            .attr("rx", 4)
            .attr("ry", 4);

   focus.append("text")
   .attr('class', 'tooltip-wavelength')
   .attr('background-color', 'red')
   .attr("x", 20)
   .attr("y", -36);

   focus.append("text")
   .attr('class', 'tooltip-absorbance')
   .attr("x", 20)
   .attr("y", -18);

   focus.append("text")
   .attr('class', 'tooltip-bonds')
   .attr("x", 20)
   .attr("y", -54);

svg.append("rect")
   .attr("transform", "translate(" + 10 + ")")
   .attr("class", "overlay")
   .attr("width", w-padding)
   .attr("height", h-padding)
   .on("mouseover", function() { focus.style("display", null); tooltip.transition().duration(200).style("opacity", .9); })
   .on("mouseout", function() { focus.style("display", "none"); tooltip.transition().duration(500).style("opacity", 0); })
   .on("mousemove", mousemove);

function mousemove() {
const x0 = xScale.invert(d3.mouse(this)[0]),
     i = bisectDate(dataset, x0, 1),
     d0 = dataset[i - 1],
     d1 = dataset[i],
     d = x0 - d0.wavelength > d1.wavelength - x0 ? d1 : d0;
 focus.attr("transform", "translate(" + xScale(d.wavelength) + "," + yScale(d.absorbance) + ")");
 focus.select(".tooltip-absorbance").text(() => (d.absorbance).toFixed(4)+' a.u.');
 focus.select(".tooltip-wavelength").text(() => (d.wavelength).toFixed(1) +' cm-1');
 focus.select(".tooltip-bonds").text(() => d.bonds);
 focus.select(".x-hover-line").attr("y2", h-padding - yScale(d.absorbance));
 focus.select(".y-hover-line").attr("x2", w + w);
}

  })
  .catch((error) => alert(error));
})
})