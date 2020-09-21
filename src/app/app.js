import {
  select,
  json,
  hierarchy,
  treemap
} from 'd3';
import * as d3 from 'd3';

import { colorLegend } from './colorLegend';

const datasets = {
  kickstarter: {
    title: 'Kickstarter Pledges',
    description: 'Top 100 highest funded projects on Kickstarter grouped by category',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
  },
  videoGames: {
    title: 'Video Games Sales',
    description: 'Top 100 best-selling video games grouped by platform',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
  },
  movies: {
    title: 'Movie Sales',
    description: 'Top 100 highest grossing movies grouped by genre',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
  },
}

// Client dimensions
const width = document.body.clientWidth > 800 ? document.body.clientWidth : 800;
const height = document.body.clientHeight;

// Margin convention
const margin = {
	top: 100,
  right: 20,
  bottom: 20,
  left: 20,
};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Select svg and set its dimensions
const svg = select('svg')
  .attr('height', height)
  .attr('width', width);

// Title
const title = svg.append('text')
  .attr('id', 'title')
  .attr('class', 'title')
  .attr('x', innerWidth / 2)
  .attr('y', 50)
  .attr('text-anchor', 'middle');

// Description
const description = svg.append('text')
  .attr('id', 'description')
  .attr('class', 'description')
  .attr('x', innerWidth / 2)
  .attr('y', 80)
  .attr('text-anchor', 'middle');

// Append group element to svg to complete margin convention
const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Function that takes data and returns root node
const treemapLayout = data => treemap()
    .size([innerWidth, innerHeight])
    .padding(1)
  (hierarchy(data)
    // Compute id for each data item
    .eachBefore(d => {
      // Remove invalid characters that break id or url (clip-path)
      const name = d.data.name.replace(/[,'":()]|\s/g, '');
      d.data.id = (d.parent ? d.parent.data.id + '.' : '') + name;
    })
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

// Color scale
const color = d3.scaleOrdinal(d3.schemeCategory10)

// Fetch data
Promise.all([
  json(datasets.kickstarter.url),
  json(datasets.movies.url),
  json(datasets.videoGames.url)
]).then(([
  kickstarterData,
  moviesData,
  videoGamesData
]) => {
  
  // Selected data set
  const selectedDataSet = videoGamesData;

  // Root node
  const root = treemapLayout(selectedDataSet);
  
  // Update title and description
  title.text(datasets.kickstarter.title)
  description.text(datasets.kickstarter.description)

  // Tile group element
  const tile = g.selectAll('g')
    .data(root.leaves())
    .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

  // Rectangle
  tile.append('rect')
    .attr('id', d => d.data.id)
    .attr('class', 'tile')
    .attr('fill', d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
    .attr('fill-opacity', 0.6)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    // Data attributes
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value);

  // Clip path
  tile.append('clipPath')
      .attr('id', d => 'clip-' + d.data.id)
    .append('use')
      .attr('xlink:href', d => '#' + d.data.id);
  
  // Text
  tile.append('text')
    .attr('clip-path', d => 'url(#clip-' + d.data.id + ')')
  .selectAll('tspan')
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
  .enter().append('tspan')
    .attr('x', 4)
    .attr('y', (d, i) => 13 + i * 10)
    .text(d => d);

  // Color legend
  colorLegend(select('#root'), {
    colorScale: color,
    swatchSize: 30,
  });

  console.log(selectedDataSet)
})