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
};

const colorScheme20 = ["#705aa2", "#6bb541", "#a95bce", "#cea834", "#5e6fda", "#d16a2c", "#5f97d3", "#d54142", "#3fbfbc", "#ca4eac", "#5cbc82", "#d84a82", "#437d43", "#c990d4", "#a6ae59", "#a1507b", "#786d26", "#e38383", "#c68b52", "#a14a40"];

const rootElement = select('#root');
const dropdownContainer = select('.dropdown-container');

const { clientWidth, clientHeight } = document.body;
const width = clientWidth > 800 ? clientWidth - 20 : 800;
const height = clientHeight;
const xOffset = clientWidth > 800 ? 60 : 20;

// STATE
let selectedData = datasets.kickstarter;

// Handle select option
const handleSelectOption = option => {
  selectedData = datasets[option];
  render(selectedData);
}

// Treemap svg
const svg = rootElement.select('#treemap')
  .attr('height', height)
  .attr('width', width);

// Color scale


function render(selected) {
  
  json(selected.url)
    .then(data => {
      
      // Dropdown 
      dropdownContainer.call(dropdown, {
        options: Object.values(datasets),
        onOptionClick: handleSelectOption
      });

      // Color scale
      const colorScale = d3.scaleOrdinal()
        .domain(data.children.map(d => d.name))
        .range(colorScheme20);
      
      svg.call(treemap, {
        title: selectedData.title,
        description: selectedData.description,
        colorScale,
        width,
        height,
        margin: {
          top: 120,
          right: xOffset,
          bottom: 20,
          left: xOffset,
        },
        data
      })

      // Color legend
      rootElement.call(colorLegend, {
        colorScale,
        swatchSize: 30,
      })
  })
}

render(selectedData);