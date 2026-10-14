import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faClock, faCheck } from '@fortawesome/free-solid-svg-icons';


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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [modalTodoInput, setModalTodoInput] = useState("")
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
        mappedTask.task = modalTodoInput
        return mappedTask
      }

      return mappedTask
    }))

    setIsModalOpen(false)
      setEditingTask(null)
      setModalTodoInput("")
  }

  const editTask = (task: Task) => {
      setIsModalOpen(true)
      setEditingTask(task)
      setModalTodoInput(task.task)
  }


  return (
    <>
      <div className='text-5xl text-center'>Todo Application</div>
      
      <div className='flex flex-col items-center my-5'>
        <div className='flex items-center'>
          <input 
            type="text" 
            className='border-2 w-2xl p-2 rounded'
            value={todoInput}
            onChange={e => setTodoInput(e.target.value)} 
            placeholder='Add new Todo'
          />
          
          <button className='px-4 py-2 mx-2 bg-blue-400 cursor-pointer' onClick={() => addNewTask(todoInput)}>Add</button>
        </div>
      </div>

      

      {tasks.length > 0 ?
      <>
      <div className='flex flex-row justify-center'>
        <button className={`p-3 m-3 ${filteredOn === Filter.All ? 'bg-blue-500' : 'bg-blue-300'} cursor-pointer`} onClick={()=>setFilteredOn(Filter.All)}>All</button>
        <button className={`p-3 m-3 ${filteredOn === Filter.Done ? 'bg-blue-500' : 'bg-blue-300'} cursor-pointer`} onClick={()=>setFilteredOn(Filter.Done)}>Done</button>
        <button className={`p-3 m-3 ${filteredOn === Filter.Pending ? 'bg-blue-500' : 'bg-blue-300'} cursor-pointer`} onClick={()=>setFilteredOn(Filter.Pending)}>Pending</button>
      </div>

      <div className='flex flex-col items-center gap-2'>
          {tasks.filter(x => {
            if(filteredOn===Filter.Done) return x.status === Status.Done
            else if(filteredOn===Filter.Pending) return x.status === Status.Pending
            else return true
          }).sort((a, b) => (a.status === Status.Done ? 0 : 1) - (b.status === Status.Done ? 0 : 1)).map((task) => (
          <div className='p-2 border rounded w-full max-w-md bg-white flex justify-between'>
            <span className={`${task.status === Status.Done ? 'line-through text-green-600' : ''}`}>{task.task}</span>

            <div className='flex flex-row gap-2'>
            <button 
            onClick={()=>setModalDeleteConfirmation(task)} 
            className="p-2.5 rounded-lg bg-rose-500 text-white font-medium text-sm flex items-center justify-center transition-colors"
            title="Delete Item"
            disabled={task.status!==Status.Done}
            >
              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
            </button>
            <button 
            onClick={()=>markTaskAsComplete(task)} 
            className="p-2.5 rounded-lg bg-green-500 text-white font-medium text-sm flex items-center justify-center"
            title={task.status === Status.Pending ? "Mark as Complete" : "Completed"}
            disabled={task.status===Status.Done}
            >
              {task.status === Status.Pending ? <FontAwesomeIcon icon={faClock} className="w-4 h-4" /> : <FontAwesomeIcon icon={faCheck} className='"w-4 h-4'/>}
            </button>
             <button 
            onClick={()=>editTask(task)} 
            className="p-2.5 rounded-lg bg-slate-300 font-medium text-sm flex items-center justify-center transition-colors"
            title="Edit Item"
            disabled={task.status===Status.Done}
            >
              <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
            </button> 
            </div>
          </div>
          ))}
      </div> 
      </> : 
      <div className='flex flex-row text-red-500 justify-center'>
        NO TASK IS AVAILABLE
      </div>
        }


  {isModalOpen && editingTask && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white shadow-xl border border-slate-100 p-6 w-full max-w-md mx-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Edit Task</h3>
      <p className="text-xs text-slate-500 mb-4">Update the description of your task below.</p>
      
      <input
        type="text"
        defaultValue={editingTask.task}
        className="w-full px-3 py-2 border border-slate-200 text-sm text-slate-800 mb-6"
        value={modalTodoInput}
        onChange={e => setModalTodoInput(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => { setIsModalOpen(false); setEditingTask(null); setModalTodoInput("")}}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100"
        >
          Cancel
        </button>
        <button
          onClick={() => updateTask()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-400"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
{modalDeleteConfirmation && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white shadow-xl border border-slate-100 p-6 w-full max-w-md mx-4">
        <div className="flex justify-center gap-3">
        <button
          onClick={() => { setModalDeleteConfirmation(null)}}
          className="px-4 py-2 text-sm font-medium text-white  bg-slate-500"
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
    </>
  )
}

export default App