import React from 'react'
import * as dag from 'd3-dag'
import { useEffect, useRef } from 'react'

import d3Dag from './d3/project-dag'

interface nodemap {
  [identity: string]: { name: string; todoId: string }
}

function D3test(props: any) {
  const rref = useRef<HTMLDivElement>(null)

  let nodes: nodemap = {}
  for (let i = 0; i < props.data.nodes.length; i++) {
    let node = props.data.nodes[i]
    let identity: string = '' + node.identity.low
    let name: string = node.properties.name
    let todoId: string = node.properties.todoId
    nodes[identity] = { name: name, todoId: todoId }
  }

  let relationships = props.data.relationships.map((rel: any) => [
    '' + rel.start.low,
    '' + rel.end.low,
  ])

  const ddag = dag
    .sugiyama()
    .decross(dag.decrossTwoLayer())
    .coord(dag.coordGreedy())(dag.dagConnect()(relationships))

  useEffect(() => {
    d3Dag.create(rref.current, { width: 500, height: 200 }, ddag)
    return () => d3Dag.destroy(rref)
  }, [ddag])

  useEffect(() => {
    d3Dag.update(rref.current, ddag, nodes)
    console.log('data updated')
  }, [ddag, nodes])
  return <div ref={rref} />
}

export default D3test
