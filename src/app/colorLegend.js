export const colorLegend = (selection, props) => {
  const {
    colorScale,
    swatchSize,
    swatchWidth = swatchSize,
    swatchHeight = swatchSize,
  } = props;

  const groups = selection.selectAll('div')
    .data(colorScale.domain());
  const groupsEnter = groups.enter().append('div');
  groupsEnter
    .merge(groups)
    .attr('class', 'legend__item')
  groups.exit().remove();

  groupsEnter
    .append('div')
    .attr('class', 'legend__item__swatch')
		.merge(groups.select('div'))
      .style('background-color', colorScale)
      .style('width', swatchWidth + 'px')
  		.style('height', swatchHeight + 'px');
  
   groupsEnter
    .append('span')
    .attr('class', 'legend__item__text')
		.merge(groups.select('span'))
      .text(d => d)
}