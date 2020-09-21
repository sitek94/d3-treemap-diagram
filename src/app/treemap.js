import * as d3 from 'd3';
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

  // General update pattern
  const g = selection.selectAll('.treemap-container').data([null]);
  const gEnter = g.enter().append('g')
    .attr('class', 'treemap-container');
  gEnter.merge(g)
    // Margin convention
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Function that takes data and returns root node
  const treemapLayout = data => d3.treemap()
      .size([innerWidth, innerHeight])
      .padding(1)
    (d3.hierarchy(data)
      // Compute id for each data item
      .eachBefore(d => {
        // Remove invalid characters that break id or url (clip-path)
        const name = d.data.name.replace(/[,'":()]|\s/g, '');
        d.data.id = (d.parent ? d.parent.data.id + '.' : '') + name;
      })
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value))

  const headerG = selection.selectAll('.header').data([null]);
  const headerGEnter = headerG.enter().append('g')
      .attr('class', 'header');
    headerGEnter.merge(headerG)
      .attr('transform', `translate(${width / 2}, 100)`)
      .attr('text-anchor', 'middle');

  // Title
  const titleEl = headerGEnter.append('text')
      .attr('id', 'title')
      .attr('class', 'title')
    .merge(headerG.select('#title')) 
      .text(title)
      //.attr('y', 50);

  // Description
  const descriptionEl = headerGEnter.append('text')
      .attr('id', 'description')
      .attr('class', 'description')
    .merge(headerG.select('#description'))
      .text(description)
      .attr('y', 50);

  // Root data node
  const root = treemapLayout(data);

  // Get tooltip event handlers
  const { handleMouseover, handleMouseout } = tooltip();

  /* 
      # TODO 
      # GENERAL UPDATE PATTERN
      # 
  */
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
    .attr('fill', d => { while (d.depth > 1) d = d.parent; return colorScale(d.data.name); })
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
}


