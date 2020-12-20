import {
  select,
} from 'd3';

export const tooltip = () => {
  const tooltip = select('#tooltip')
  const tooltipDetails = select('#tooltip-details')

  // Mouse over handler
  const handleMouseover = (event, d) => {

    // Tooltip transition
    tooltip.transition()		
      .duration(100)		
      .style("opacity", .9);

    // Get details
    const { name, category, value } = d.data;

    // Construct details string
    const details = [
      `Name: ${name}`,
      `Category: ${category}`,
      `Value: ${value}`,
    ].join('<br>');
    
    // Update details
    tooltipDetails.html(details);

    // Get constants to construct tooltip position
    const { pageX, pageY } = event;
    const { scrollLeft, offsetLeft } =  document.body;
    const yOffset = -120;
    const xOffset = scrollLeft + offsetLeft;

    // Update tooltip position and data-year
    tooltip
      .attr('data-value', value)
      .style("left", pageX + xOffset + "px")		
      .style("top", pageY + yOffset + "px");
  }
  // Mouse out handler
  const handleMouseout = () => {
  tooltip.transition()		
    .duration(300)		
    .style("opacity", 0);	
  }

  return { handleMouseover, handleMouseout };
}