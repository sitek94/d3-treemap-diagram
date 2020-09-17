import {
  select,
  json,
} from 'd3';

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
  console.log(kickstarterData, moviesData, videoGamesData)
})