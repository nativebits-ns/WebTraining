import { useState } from 'react'
import { serverControl } from './api/usersApi'
import { UserForm } from './components/UserForm'
import { UserList } from './components/UserList'

const App = () => {
  const [fail, setFail] = useState(serverControl.shouldFail)

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">User management</h1>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={fail}
            onChange={(e) => {
              serverControl.shouldFail = e.target.checked
              setFail(e.target.checked)
            }}
          />
          Simulate server failure (create / delete)
        </label>
      </header>

      <UserForm />
      <UserList />
    </main>
  )
}

export default App
