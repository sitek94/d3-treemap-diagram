import {
  select,
  json,
  hierarchy,
  treemap
} from 'd3';
import * as d3 from 'd3';

import { colorLegend } from './colorLegend';
import { tooltip } from './tooltip';
import { dropdown } from './dropdown';

const datasets = {
  kickstarter: {
    name: 'kickstarter',
    title: 'Kickstarter Pledges',
    description: 'Top 100 highest funded projects on Kickstarter grouped by category',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
  },
  videoGames: {
    name: 'videoGames',
    title: 'Video Games Sales',
    description: 'Top 100 best-selling video games grouped by platform',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
  },
  movies: {
    name: 'movies',
    title: 'Movie Sales',
    description: 'Top 100 highest grossing movies grouped by genre',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
  },
}

const rootElement = select('#root');
const dropdownContainer = select('.dropdown-container');



// Client dimensions
const { clientWidth, clientHeight } = document.body;
const width = clientWidth > 800 ? clientWidth - 20 : 800;
const height = clientHeight;
const xOffset = clientWidth > 800 ? 60 : 20;

// Margin convention
const margin = {
	top: 100,
  right: xOffset,
  bottom: 20,
  left: xOffset,
};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// STATE
let selectedData = datasets.kickstarter;
let fetchedData;

const handleSelectOption = option => {
  selectedData = datasets[option];
  render()
}

dropdown(dropdownContainer, {
  options: Object.values(datasets),
  onOptionClick: handleSelectOption
})

// Select svg and set its dimensions
const svg = rootElement.append('svg')
  .attr('id', 'treemap')
  .attr('class', 'treemap')
  .attr('height', height)
  .attr('width', width);

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

function render() {
  const { title, description } = selectedData;
  
  // Title
  svg.append('text')
    .attr('id', 'title')
    .attr('class', 'title')
    .attr('x', innerWidth / 2)
    .attr('y', 50)
    .attr('text-anchor', 'middle')
    .text(title);

  // Description
  svg.append('text')
    .attr('id', 'description')
    .attr('class', 'description')
    .attr('x', innerWidth / 2)
    .attr('y', 80)
    .attr('text-anchor', 'middle')
    .text(description);

    // Root node
    const root = treemapLayout(fetchedData);

    // Get tooltip event handlers
    const { handleMouseover, handleMouseout } = tooltip();

    // Tile group element
    const tile = g.selectAll('g')
      .data(root.leaves())
      .join('g')
        .attr('class', 'tile-group')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        // Event handlers
        .on('mousemove', handleMouseover)
        .on('mouseout', handleMouseout);

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
      .attr('class', 'tile-text')
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
}

json(selectedData.url)
  .then(data => {
    fetchedData = data;

    render();
  })