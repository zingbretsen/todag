const { readFileSync } = require('fs')

const parse = require('csv-parse/lib/sync')
const { gql } = require('@apollo/client')

const definitions = [
  {
    query: gql`
      mutation mergeProjects($projectId: ID!, $name: String!) {
        Project: mergeProject(projectId: $projectId, name: $name) {
          projectId
          name
        }
      }
    `,
    filename: './src/seed/data/projects.csv',
  },
  {
    query: gql`
      mutation mergeUsers($userId: ID!, $name: String!) {
        User: mergeUser(userId: $userId, name: $name) {
          userId
          name
        }
      }
    `,
    filename: './src/seed/data/users.csv',
  },
  {
    query: gql`
      mutation mergeTodos($todoId: ID!, $name: String!, $description: String) {
        Todo: mergeTodo(
          todoId: $todoId
          name: $name
          description: $description
        ) {
          todoId
          name
          description
        }
      }
    `,
    filename: './src/seed/data/todos.csv',
  },
  {
    query: gql`
      mutation mergeProjectDependencies($projectId: ID!, $todoId: ID!) {
        Project: mergeProjectDependency(
          projectId: $projectId
          todoId: $todoId
        ) {
          projectId
        }
      }
    `,
    filename: './src/seed/data/project_dependencies.csv',
  },
  {
    query: gql`
      mutation mergeTodoDependencies($todoId1: ID!, $todoId2: ID!) {
        Todo: mergeTodoDependency(todoId1: $todoId1, todoId2: $todoId2) {
          todoId
        }
      }
    `,
    filename: './src/seed/data/todo_dependencies.csv',
  },
]

const whatever = ({ query, filename }) => {
  let data = readFileSync(filename)
  const records = parse(data, { columns: true })
  const mutations = generateMutations(query, records)
  return mutations
}

export const getSeedMutations = async () => {
  return definitions.map((definition) => whatever(definition))
}

const generateMutations = (query, records) => {
  return records.map((rec) => {
    return {
      mutation: query,
      variables: rec,
    }
  })
}
