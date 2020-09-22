export const colorLegend = (selection, props) => {
  const {
    colorScale,
    swatchSize,
    swatchWidth = swatchSize,
    swatchHeight = swatchSize,
    width = 600,
    height = 350,
    columns = 3,
    ySpacing = 50,
  } = props;

  // Compute horizontal spacing
  const xSpacing = width / columns;

  // Legend svg
 const svg = selection.select('#legend')
  .attr('width', width)
  .attr('height', height);
      
  // Group container
  let g = svg.selectAll('.legend-group').data([null]);
  g = g.enter().append('g')
    .merge(g)
      .attr('class', 'legend-group')
      .attr('transform', 'translate(50, 0)');    

  // Legend item groups
  const groups = g.selectAll('g')
    .data(colorScale.domain());
  // Remove old groups before appending new ones
  groups.exit().remove();
  const groupsEnter = groups.enter().append('g');
  groupsEnter
    .merge(groups)
    	.attr('transform', (d, i) => 
            `translate(${i % columns * xSpacing}, ${Math.floor(i / columns) * ySpacing})`);
  	
  // Append rects
  groupsEnter
    .append('rect')
    .attr('class', 'legend-item')
		.merge(groups.select('rect'))
      .attr('fill', colorScale)
      .attr('fill-opacity', 0.7)
      .attr('width', swatchWidth)
  		.attr('height', swatchHeight);

  // Append text
  groupsEnter
    .append('text')
    .attr('class', 'legend-text')
    .merge(groups.select('text'))
      .text(d => d)
      .attr('y', 20)
      .attr('x', 40); 
}