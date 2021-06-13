import React from 'react'
import { useState, useEffect } from 'react'

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  TextField,
} from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'

import Title from './Title'
import AddProject from './AddProject'
import { projecttype } from './AddProject'

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
    $filter: ProjectWhere
  ) {
    projects(options: { limit: $first, skip: $offset }, where: $filter) {
      name
      projectId
      nextActions {
        name
      }
    }
  }
`

function ProjectList(props: any) {
  const { classes } = props
  const [page] = React.useState(0)
  const [rowsPerPage] = React.useState(10)
  const [filterState, setFilterState] = React.useState({
    projectnameFilter: '',
  })

  const [newProjectData, setNewProjectData] = useState<projecttype[]>([])
  const [projects, setProjects] = useState<projecttype[]>([])

  const getFilter = () => {
    return filterState.projectnameFilter.length > 0
      ? { name_CONTAINS: filterState.projectnameFilter }
      : {}
  }

  const { loading, data, error } = useQuery(GET_PROJECT, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      filter: getFilter(),
    },
  })

  useEffect(() => {
    if (!loading && !error && data) {
      setProjects([...newProjectData, ...data.projects])
    }
  }, [data, error, loading, newProjectData])

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
        <AddProject setNewProjectData={setNewProjectData} />
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
            {projects.map((n: any) => {
              return (
                <div key={n.projectId}>
                  <h2>{n.name}</h2>
                  <Table className={classes.table}>
                    <TableBody>
                      {n.nextActions.map((m: any) => {
                        return (
                          <TableRow key={n.id + m.name}>
                            <TableCell component="td" scope="row">
                              {m.name}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )
            })}{' '}
          </>
        )}
      </Paper>
    </>
  )
}

export default withStyles(styles)(ProjectList)
