export const dropdown = (selection, props) => {
  const { 
    options,
    onOptionClick
  } = props;

  let select = selection.selectAll('select').data([null]);
  select = select.enter().append('select')
    .merge(select)
    // Use normal function (not fat arrow) to preserve 'this' keyword
    .on('change', function() {
        // Invoke option click event handler
        onOptionClick(this.value);
      });

  const option = select.selectAll('option').data(options)
  const optionEnter = option.enter().append('option')
    .merge(option)
      .attr('value', d => d.name)
      .html(d => d.title)
}