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
  const svg = selection.append("svg")
    .attr('id', 'legend')
    .attr('class', 'legend')
    .attr("width", width)
    .attr("height", height);
  
  // Legend group container
  const g = svg.append('g')
    .attr('transform', 'translate(50, 0)');

  console.log(colorScale.domain());

  // Legend item groups
  const groups = g.selectAll('g')
    .data(colorScale.domain());
  const groupsEnter = groups.enter().append('g')
    .append('g')
        .attr('class', '');
  groupsEnter
    .merge(groups)
    	.attr('transform', (d, i) => 
            `translate(${i % columns * xSpacing}, ${Math.floor(i / columns) * ySpacing})`)
  	groups.exit().remove();
  
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