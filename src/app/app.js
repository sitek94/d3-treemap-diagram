import {
  select,
  json,
  hierarchy,
  treemap
} from 'd3';
import * as d3 from 'd3';

const kickstarterUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';
const moviesUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
const videoGamesUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

// Client dimensions
const width = document.body.clientWidth;
const height = document.body.clientHeight;

// Margin convention
const margin = {
	top: 20,
  right: 100,
  bottom: 20,
  left: 75,
};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Select svg and set its dimensions
const svg = select('svg')
  .attr('height', height)
  .attr('width', width);

// Append group element to svg to complete margin convention
const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Function that takes data and returns root node
const treemapLayout = data => treemap()
    .size([innerWidth, innerHeight])
    .padding(1)
    .round(true)
  (hierarchy(data)
    // Compute id for each data item
    .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

// Color scale
const color = d3.scaleOrdinal(d3.schemeCategory10)

// Fetch data
Promise.all([
  json(kickstarterUrl),
  json(moviesUrl),
  json(videoGamesUrl)
]).then(([
  kickstarterData,
  moviesData,
  videoGamesData
]) => {
  
  // Root node
  const root = treemapLayout(kickstarterData);

  // Cell group element
  const cell = g.selectAll('g')
    .data(root.leaves())
    .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

  // Append rectangle to cell
  cell.append('rect')
    .attr('fill', d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
    .attr('fill-opacity', 0.6)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0);

  // Clip overlapping 
  cell.append('clipPath')
      .attr('id', d => 'clip-' + d.data.id)
    .append('use')
      .attr('xlink:href', d => '#' + d.data.id);
  
  cell.append("text")
    .attr("clip-path", d => "url(#clip-" + d.data.id + ")")
  .selectAll("tspan")
    .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
  .enter().append("tspan")
    .attr("x", 4)
    .attr("y", function(d, i) { return 13 + i * 10; })
  console.log(kickstarterData);









})