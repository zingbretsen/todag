import * as d3 from 'd3'

let d3Chart = {
  create: function (el, props, state) {
    const { width, height } = props

    d3.select(el)
      .append('svg')
      .attr('class', 'd3')
      .attr('width', width)
      .attr('height', height)
  },

  update: function (el, state, nodemap) {
    // Re-compute the scales, and render the data points
    // const scales = this._scales(el, state.domain)
    const svg = d3.select(el).select('svg')
    const { dag } = state
    const steps = dag.size()
    const nodeRadius = 6
    const interp = d3.interpolateRainbow
    const colorMap = {}
    const scalingFactor = 180
    const scale = d3.scaleLinear().domain([0, 5]).range([0, scalingFactor])
    for (const [i, node] of dag.idescendants().entries()) {
      colorMap[node.id] = interp(i / steps)
    }

    // How to draw edges
    const line = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x((d) => scale(d.x) * 3)
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
      .attr(
        'transform',
        ({ x, y }) => `translate(${scale(x) * 3}, ${scale(y)})`
      )

    // Plot node circles
    nodes
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (n) => colorMap[n.id])

      // Add text to nodes
      // nodes
      .append('title')
      // .text((d) => d.id)
      .text((d) => nodemap[d.data.id].name)
      .attr('class', 'tooltip')
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
}

export default d3Chart
