import React from 'react'

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
import D3test from './D3test'

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
        projects(
            options: { limit: $first, skip: $offset }
            where: $filter
        ) {
            name
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
    const [filterState, setFilterState] = React.useState({ projectnameFilter: '' })

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
        {data && !loading && !error && <> {
            data.projects.map((n: any) => {
                return (
                    <div key={n.id}>
                        <h2>{n.name}</h2>
                        <D3test />
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
                                })
                                }
                            </TableBody>
                        </Table>
                    </div>
                )
            }
            )
        } </>
        }
      </Paper>
        </>
    )
}

export default withStyles(styles)(ProjectList)
