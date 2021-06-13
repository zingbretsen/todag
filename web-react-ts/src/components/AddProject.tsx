import React from 'react'
import { useRef, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { v4 as uuid } from 'uuid'

const ADD_PROJECT = gql`
  mutation AddProject($name: String!, $projectId: ID!) {
    mergeProject(name: $name, projectId: $projectId) {
      name
      projectId
    }
  }
`

interface setter {
  setNewProjectData: any
}

export interface projecttype {
  name: string
  nextActions: any[]
  projectId: string
  __typename: string
}

const AddProject = ({ setNewProjectData }: setter) => {
  const [addProject] = useMutation(ADD_PROJECT)
  const [newProjectName, setNewProjectName] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <input
        type="text"
        ref={inputRef}
        onChange={(event) => setNewProjectName(event.target.value)}
      />
      <input
        type="button"
        value="Add Project"
        onClick={() => {
          // If project name is entered, create new project via mutation,
          // clear input box,
          // and update new project name in parent component
          // in case we want to optimistically add the project to our list
          if (inputRef.current?.value) {
            let data: projecttype = {
              nextActions: [],
              name: newProjectName,
              projectId: uuid(),
              __typename: 'Project',
            }
            addProject({
              variables: data,
            })
            inputRef.current.value = ''
            setNewProjectData((prevProjects: any[]) => [data, ...prevProjects])
          }
        }}
      />
    </div>
  )
}

export default AddProject
