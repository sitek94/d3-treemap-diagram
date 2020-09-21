export const colorLegend = (selection, props) => {
  const {
    colorScale,
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
    .attr('class', 'legend__item__box')
		.merge(groups.select('div'))
      .style('background-color', colorScale)
      .style('width', '20px')
  		.style('height', '20px');
  
   groupsEnter
    .append('span')
    .attr('class', 'legend__item__text')
		.merge(groups.select('span'))
      .text(d => d)
  		// Center text vertically trick
  		.attr('y', 0)
  		.attr('x', 10);

}