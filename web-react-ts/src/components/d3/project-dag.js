import * as d3 from 'd3'
import dag from 'd3-dag'

let d3Chart = {
  create: function (el, props, state) {
    const { width, height } = props

    d3.select(el)
      .append('svg')
      .attr('class', 'd3')
      .attr('width', width)
      .attr('height', height)
      .append('defs') // For gradients
  },

  update: function (el, state) {
    // Re-compute the scales, and render the data points
    // const scales = this._scales(el, state.domain)
    const svg = d3.select(el).select('svg')
    console.log(svg)
    const { dag } = state
    console.log(dag)
    const steps = dag.size()
    const nodeRadius = 3
    const interp = d3.interpolateRainbow
    const colorMap = {}
    const defs = svg.select('defs')
    const scalingFactor = 180
    const scale = d3.scaleLinear().domain([0, 2.5]).range([0, scalingFactor])
    for (const [i, node] of dag.idescendants().entries()) {
      colorMap[node.id] = interp(i / steps)
    }

    // How to draw edges
    const line = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x((d) => scale(d.x))
      .y((d) => scale(d.y))

    // Plot edges
    svg
      .append('g')
      .selectAll('path')
      .data(dag.links())
      .enter()
      .append('path')
      .attr('d', ({ points }) => line(points))
      .attr('fill', 'none')
      .attr('stroke-width', 3)
      .attr('stroke', 'rgb(150,150,150)')

    // Select nodes
    const nodes = svg
      .append('g')
      .selectAll('g')
      .data(dag.descendants())
      .enter()
      .append('g')
      .attr('transform', ({ x, y }) => `translate(${scale(x)}, ${scale(y)})`)

    // Plot node circles
    nodes
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (n) => colorMap[n.id])

    // const arrow = d3
    //   .symbol()
    //   .type(d3.symbolTriangle)
    //   .size((nodeRadius * nodeRadius) / 5.0)
    // svg
    //   .append('g')
    //   .selectAll('path')
    //   .data(dag.links())
    //   .enter()
    //   .append('path')
    //   .attr('d', arrow)
    //   .attr('transform', ({ source, target, points }) => {
    //     const [end, start] = points.slice().reverse()
    //     // This sets the arrows the node radius (20) + a little bit (3) away from the node center, on the last line segment of the edge. This means that edges that only span ine level will work perfectly, but if the edge bends, this will be a little off.
    //     const dx = start.x - end.x
    //     const dy = start.y - end.y
    //     const scale = (nodeRadius * 1.15) / Math.sqrt(dx * dx + dy * dy)
    //     // This is the angle of the last line segment
    //     const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 90
    //     console.log(angle, dx, dy)
    //     return `translate(${end.x + dx * scale}, ${
    //       end.y + dy * scale
    //     }) rotate(${angle})`
    //   })
    //   .attr('fill', ({ target }) => colorMap[target.id])
    //   .attr('stroke', 'white')
    //   .attr('stroke-width', 1.5)

    // Add text to nodes
    nodes
      .append('text')
      // .text((d) => d.id)
      .text((d) => 'asdf')
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'black')
      .attr('dy', '-5px')
      .attr('dx', '5px')
      .attr('text-anchor', 'start')
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
