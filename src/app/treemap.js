import { hierarchy, treemap as d3_treemap } from 'd3';
import { tooltip } from './tooltip';

export const treemap = (selection, props) => {
  const {
    title,
    description,
    colorScale,
    width,
    height,
    margin,
    data,
  } = props;
  
  // Margin convention
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;  

  // Treemap layout constructor
  const treemapLayout = data => d3_treemap()
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
      .sort((a, b) => b.value - a.value));

  // Root data node
  const root = treemapLayout(data);

  // General update pattern
  let g = selection.selectAll('.treemap-container').data([null]);
  g = g.enter().append('g')
    .merge(g) 
      .attr('class', 'treemap-container')
      // Margin convention
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // Header - container for title and description
  const headerGroup = selection.selectAll('.header').data([null]);
  const headerGroupEnter = headerGroup.enter().append('g')
  headerGroupEnter.merge(headerGroup)
    .attr('class', 'header')
    .attr('transform', `translate(${width / 2}, 75)`)
    .attr('text-anchor', 'middle');

  // Title
  headerGroupEnter.append('text')
      .attr('id', 'title')
      .attr('class', 'title')
    .merge(headerGroup.select('#title')) 
      .text(title)
      //.attr('y', 50);

  // Description
  headerGroupEnter.append('text')
      .attr('id', 'description')
      .attr('class', 'description')
    .merge(headerGroup.select('#description'))
      .text(description)
      .attr('y', 30);

  // Get tooltip event handlers
  const { handleMouseover, handleMouseout } = tooltip();

  // Tile container
  const tile = g.selectAll('g')
    .data(root.leaves());
  
  const tileEnter = tile.enter().append('g');
  tileEnter
    .merge(tile)
      .attr('class', 'tile-group')
      .on('mousemove', handleMouseover)
      .on('mouseout', handleMouseout)
    .transition()
      .duration(1000)
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      // Event handlers
      tile.exit().remove();

  // Rectangle
  const rect = tile.select('rect');
  tileEnter.append('rect')
    .merge(rect)
      .attr('id', d => d.data.id)
      .attr('class', 'tile')
      // Data attributes
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
    .transition()
      .duration(1000)
      .attr('fill', d => { while (d.depth > 1) d = d.parent; return colorScale(d.data.name); })
      .attr('fill-opacity', 0.6)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0);      

  // Clip path
  const clipPath = tile.select('clipPath');
  tileEnter.append('clipPath')
    .merge(clipPath)
        .attr('id', d => 'clip-' + d.data.id)
      .append('use')
        .attr('xlink:href', d => '#' + d.data.id);

  // Text
  const text = tile.select('text');
  const textEnter = tileEnter.append('text')  
    .merge(text)
      .attr('class', 'tile-text')
      .attr('clip-path', d => 'url(#clip-' + d.data.id + ')');
  const tspan =  textEnter.selectAll('tspan')
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g));
  tspan.enter().append('tspan')
    .merge(tspan)
      .attr('x', 4)
      .attr('y', (d, i) => 13 + i * 10)
      .text(d => d);
}


