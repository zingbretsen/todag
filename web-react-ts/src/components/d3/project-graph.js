import * as d3 from 'd3'
import dag from 'd3-dag'

let d3Chart = {
  create: function (el, props, state) {
    const svg = d3
      .select(el)
      .append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height)
      .append('g')
      .attr('class', 'd3-points')
  },

  update: function (el, state) {
    // Re-compute the scales, and render the data points
    // const scales = this._scales(el, state.domain)
    this._drawPoints(el, state.data)
  },

  destroy: function (el) {
    // Any clean-up would go here
    // in this example there is nothing to do
    console.log('destroying el')
  },

  _drawPoints: function (el, data) {
    const g = d3.select(el).selectAll('.d3-points')

    const point = g.selectAll('.d3-point').data(data, (d) => d.id)

    point
      .enter()
      .append('circle')
      .merge(point)
      .attr('class', 'd3-point')
      .transition()
      .duration(2000)
      .attr('cx', function (d) {
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })
      .attr('r', function (d) {
        return d.z
      })

    point.exit().remove()
  },
}

export default d3Chart
