import React from 'react'
import * as d3 from 'd3'
import D3blackbox from 'd3blackbox'

const useD3 = function (render) {
  const refAnchor = React.useRef(null)
  React.useEffect(() => {
    render(refAnchor.current)
  })
  return refAnchor
}

export const BarchartWithHook = (props) => {
  const refAnchor = useD3(anchor => d3BarchartFunc({ anchor, ...props }))
  return <g ref={refAnchor} transform={`translate(${props.x}, ${props.y})`} />
}

export const Barchart = D3blackbox(function (anchor, props, state) {
  d3BarchartFunc({ anchor: anchor.current, ...props })
})

function d3BarchartFunc (props) {
  const { anchor } = props
  var svg = d3.select(anchor)

  var margin = { top: 20, right: 20, bottom: 30, left: 40 }

  var width = +props.width - margin.left - margin.right

  var height = +props.height - margin.top - margin.bottom

  var x = d3
    .scaleBand()
    .rangeRound([0, width])
    .padding(0.1)

  var y = d3.scaleLinear().rangeRound([height, 0])

  var g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  d3.tsv(
    'https://cdn.rawgit.com/mbostock/3885304/raw/a91f37f5f4b43269df3dbabcda0090310c05285d/data.tsv',
    function (d) {
      d.frequency = +d.frequency
      return d
    }
  ).then(function (data) {
    x.domain(
      data.map(function (d) {
        return d.letter
      })
    )
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.frequency
      })
    ])

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10, '%'))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency')

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) {
        return x(d.letter)
      })
      .attr('y', function (d) {
        return y(d.frequency)
      })
      .attr('width', x.bandwidth())
      .attr('height', function (d) {
        return height - y(d.frequency)
      })
  })
}
