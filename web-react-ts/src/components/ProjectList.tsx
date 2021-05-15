import React from 'react'
import { useRef, useState } from 'react'
import VisNetworkReactComponent from "vis-network-react";

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  SortDirection,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel,
  TextField,
} from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'

import Title from './Title'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 700,
      marginTop: theme.spacing(3),
      overflowX: 'auto',
      margin: 'auto',
    },
    table: {
      minWidth: 700,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      minWidth: 300,
    },
  })

const GET_PROJECT = gql`
  query projectsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [ProjectSort]
    $filter: ProjectWhere
  ) {
    projects(
      options: { limit: $first, skip: $offset, sort: $orderBy }
      where: $filter
    ) {
      name
      depends_on {
        name
      }
    }
  }
`

function ProjectList(props: any) {
  const { classes } = props
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = React.useState('name')
  const [page] = React.useState(0)
  const [rowsPerPage] = React.useState(10)
  const [filterState, setFilterState] = React.useState({ projectnameFilter: '' })

  const [ graphdata, setGraphdata ] = useState( {
    nodes: [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
      { id: 5, label: "Node 5" },
    ],
    edges: [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 },
    ]
  } );


  const getFilter = () => {
    return filterState.projectnameFilter.length > 0
      ? { name_CONTAINS: filterState.projectnameFilter }
      : {}
  }

  const { loading, data, error } = useQuery(GET_PROJECT, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: { [orderBy]: order.toUpperCase() },
      filter: getFilter(),
    },
  })

  const handleSortRequest = (property: any) => {
    const newOrderBy = property
    let newOrder: SortDirection = 'desc'

    if (orderBy === property && order === 'desc') {
      newOrder = 'asc'
    }

    setOrder(newOrder)
    setOrderBy(newOrderBy)
  }

  const handleFilterChange = (filterName: any) => (event: any) => {
    const val = event.target.value

    setFilterState((oldFilterState) => ({
      ...oldFilterState,
      [filterName]: val,
    }))
  }

  return (
    <>
        <Paper className={classes.root}>
      <Title>Project List</Title>
      <TextField
        id="search"
        label="Project Name Contains"
        className={classes.textField}
        value={filterState.projectnameFilter}
        onChange={handleFilterChange('projectnameFilter')}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input,
        }}
      />
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}
      {data && !loading && !error && (
          <>
              <VisNetworkReactComponent
                  data={graphdata}
                  options={{}}
              />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                key="name"
                sortDirection={orderBy === 'name' ? order : false}
              >
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={order}
                    onClick={() => handleSortRequest('name')}
                  >
                    Name
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.projects.map((n: any) => {
              return n.depends_on.map((m: any) => {
                return (
                  <TableRow key={n.id + m.name}>
                    <TableCell component="th" scope="row">
                      {n.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {m.name}
                    </TableCell>
                  </TableRow>
                )
              })
            })}
          </TableBody>
        </Table>
</>      )}
    </Paper>
    </>
  )
}

export default withStyles(styles)(ProjectList)
