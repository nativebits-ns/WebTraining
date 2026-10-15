import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faCheck, faXmark, faBook } from '@fortawesome/free-solid-svg-icons';


enum Status {
  Done = 'done',
  Pending = 'pending',
}

enum Filter {
  All = 'all',
  Done = 'done',
  Pending = 'pending'
}

interface Task {
  task: string,
  status: Status
}

const App = () => {
  const [todoInput, setTodoInput] = useState("")
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editInput, setEditInput] = useState("")
  const [filteredOn, setFilteredOn] = useState<Filter>(Filter.All)
  const [modalDeleteConfirmation, setModalDeleteConfirmation] = useState<Task | null>(null)

  const addNewTask = (taskToAdd: string) => {
      if (taskToAdd.trim() === "") return

      const task = {
        task: taskToAdd,
        status: Status.Pending
      }

      setTasks((prevTasks) => [...prevTasks, task])
      setTodoInput("")
  }

  const deleteTask = () => {
    if(modalDeleteConfirmation) {
      setTasks(((tasks) => tasks.filter((filterTask) => filterTask.task !== modalDeleteConfirmation.task)))
      setModalDeleteConfirmation(null)
      alert("Task deleted successfully!")
    }
  }

  const markTaskAsComplete = (task: Task) => {
    setTasks((mapTask) => mapTask.map( mappedTask => {
      if(mappedTask.task === task.task) {
        if(mappedTask.status == Status.Pending) return { ...mappedTask, status: Status.Done }

        return {...mappedTask, status: Status.Pending}
      }

      return mappedTask
    }))
  }

  const updateTask = () => {
    setTasks((mapTask) => mapTask.map( mappedTask => {
      if( editingTask && mappedTask.task === editingTask.task) {
        return { ...mappedTask, task: editInput }
      }

      return mappedTask
    }))

    cancelEdit()
  }

  const editTask = (task: Task) => {
      setEditingTask(task)
      setEditInput(task.task)
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditInput("")
  }

  const filterButtonClass = (filter: Filter) =>
    `flex-1 mx-2 first:ml-0 last:mr-0 py-2 text-sm text-white cursor-pointer transition-colors ${
      filteredOn === filter ? 'bg-[#006f7d]' : 'bg-[#008b9c] hover:bg-[#007a8a]'
    }`

  return (
    <div className='max-w-xl mx-auto px-3 py-5 text-slate-800'>
      <h1 className='text-2xl text-center mb-3'>TodoInput</h1>

      <div className='border border-slate-300 rounded p-3 bg-white'>
        <div className='flex items-stretch border border-slate-300 rounded overflow-hidden'>
          <span className='flex items-center justify-center w-9 bg-[#008b9c] text-white'>
            <FontAwesomeIcon icon={faBook} className='w-3.5 h-3.5' />
          </span>
          <input
            type="text"
            className='flex-1 px-3 py-2 text-sm outline-none'
            value={todoInput}
            onChange={e => setTodoInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addNewTask(todoInput) }}
            placeholder='New Todo'
          />
        </div>

        <button
          className='w-full mt-3 py-2 text-sm text-white bg-[#008b9c] hover:bg-[#007a8a] cursor-pointer transition-colors rounded-sm'
          onClick={() => addNewTask(todoInput)}
        >
          Add new task
        </button>
      </div>

      {/* Todo list */}
      <h2 className='text-2xl text-center mt-5 mb-3'>TodoList</h2>

      {tasks.length > 0 ?
      <>
      <div className='flex flex-row'>
        <button className={filterButtonClass(Filter.All)} onClick={()=>setFilteredOn(Filter.All)}>All</button>
        <button className={filterButtonClass(Filter.Done)} onClick={()=>setFilteredOn(Filter.Done)}>Done</button>
        <button className={filterButtonClass(Filter.Pending)} onClick={()=>setFilteredOn(Filter.Pending)}>Todo</button>
      </div>

      <div className='flex flex-col gap-3 mt-8'>
          {tasks.filter(x => {
            if(filteredOn===Filter.Done) return x.status === Status.Done
            else if(filteredOn===Filter.Pending) return x.status === Status.Pending
            else return true
          }).sort((a, b) => (a.status === Status.Done ? 0 : 1) - (b.status === Status.Done ? 0 : 1)).map((task) => {
            const isEditing = editingTask?.task === task.task

            return (
          <div key={task.task} className='px-4 py-3 border border-slate-300 rounded-sm w-full bg-white flex items-center justify-between gap-3'>
            {isEditing ? (
              <input
                type="text"
                autoFocus
                className='flex-1 min-w-0 px-2 py-1 border border-[#008b9c] rounded-sm text-sm outline-none'
                value={editInput}
                onChange={e => setEditInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') updateTask()
                  if (e.key === 'Escape') cancelEdit()
                }}
              />
            ) : (
              <span className={`text-sm break-words min-w-0 ${task.status === Status.Done ? 'line-through text-red-500' : 'font-semibold'}`}>{task.task}</span>
            )}

            <div className='flex flex-row items-center gap-3 shrink-0'>
            {isEditing ? (
              <>
                <button
                  onClick={() => updateTask()}
                  className="text-green-600 cursor-pointer"
                  title="Save Changes"
                >
                  <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => cancelEdit()}
                  className="text-slate-500 cursor-pointer"
                  title="Cancel"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={()=>markTaskAsComplete(task)}
                  className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center ${task.status === Status.Done ? 'border-green-600 text-green-600' : 'border-slate-500 cursor-pointer'}`}
                  title={task.status === Status.Pending ? "Mark as Complete" : "Completed"}
                  disabled={task.status===Status.Done}
                >
                  {task.status === Status.Done && <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />}
                </button>
                <button
                  onClick={()=>editTask(task)}
                  className="text-amber-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Edit Item"
                  disabled={task.status===Status.Done}
                >
                  <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={()=>setModalDeleteConfirmation(task)}
                  className="text-red-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Delete Item"
                  disabled={task.status!==Status.Done}
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            </div>
          </div>
          )})}
      </div>
      </> :
      <div className='flex flex-row text-red-500 justify-center'>
        NO TASK IS AVAILABLE
      </div>
        }

      {modalDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white shadow-xl border border-slate-100 p-6 w-full max-w-md mx-4">
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setModalDeleteConfirmation(null)}}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTask()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-800"
              >
                Confirm deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
