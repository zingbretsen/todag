import React from 'react'
import * as d3 from 'd3'
import * as dag from 'd3-dag'
import { useState, useEffect, useRef } from 'react'

import d3Chart from './d3/project-graph'
import d3Dag from './d3/project-dag'

function D3test(props: any) {
  const rref = useRef<HTMLDivElement>(null)
  const [data, setData] = useState([
    { id: 1, x: 10, y: 10, z: 2 },
    { id: 2, x: 20, y: 20, z: 2 },
    { id: 3, x: 40, y: 30, z: 10 },
  ])
  const [ddag, setDdag] = useState(
    dag.sugiyama().decross(dag.decrossTwoLayer()).coord(dag.coordGreedy())(
      dag.dagStratify()([
        {
          id: '0',
          parentIds: [],
        },
        {
          id: '1',
          parentIds: ['0'],
        },
        {
          id: '2',
          parentIds: ['0'],
        },
        {
          id: '3',
          parentIds: ['1', '2'],
        },
        {
          id: '4',
          parentIds: ['0'],
        },
        {
          id: '5',
          parentIds: ['4'],
        },
      ])
    )
  )

  useEffect(() => {
    d3Dag.create(rref.current, { width: 200, height: 200 }, ddag)
    return () => d3Dag.destroy(rref)
  }, [])

  useEffect(() => {
    d3Dag.update(rref.current, ddag)
    console.log('data updated')
  }, [data])
  return (
    <>
      <p>d3 graph</p>
      <div ref={rref} />
      <input
        type="button"
        value="Cleek"
        onClick={() =>
          setData([
            { id: 1, x: Math.random() * 200, y: 10, z: 2 },
            { id: 2, x: Math.random() * 200, y: 20, z: 2 },
            { id: 3, x: Math.random() * 200, y: 30, z: 10 },
            { id: 4, x: Math.random() * 200, y: 60, z: 5 },
          ])
        }
      />
    </>
  )
}

export default D3test
