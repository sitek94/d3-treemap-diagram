import {
  select,
  json,
  hierarchy,
  tree,
} from 'd3';
import * as d3 from 'd3';

import { colorLegend } from './colorLegend';
import { tooltip } from './tooltip';
import { dropdown } from './dropdown';
import { treemap } from './treemap';

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

const { clientWidth, clientHeight } = document.body;
const width = clientWidth > 800 ? clientWidth - 20 : 800;
const height = clientHeight;
const xOffset = clientWidth > 800 ? 60 : 20;

// STATE
let selectedData = datasets.kickstarter;
let fetchedData;

const handleSelectOption = option => {
  selectedData = datasets[option];
  render()
}



// Select svg and set its dimensions
const svg = rootElement.append('svg')
  .attr('id', 'treemap')
  .attr('class', 'treemap')
  .attr('height', height)
  .attr('width', width);

// Color scale
const color = d3.scaleOrdinal(d3.schemeCategory10)

function render() {
  
  // Title 
  select('#dropdown-container')
    .call(dropdown, {
      options: Object.values(datasets),
      onOptionClick: handleSelectOption
    });

  
  svg.call(treemap, {
    title: 'Test title',
    description: 'Test',
    width,
    height,
    margin: {
      top: 100,
      right: xOffset,
      bottom: 20,
      left: xOffset,
    },
    data: fetchedData
  })

 
}

json(selectedData.url)
  .then(data => {
    fetchedData = data;

    render();
  })