import { JobApplicationWizard } from './components/JobApplicationWizard'

export const App = () => {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Job application</h1>
      <JobApplicationWizard />
    </main>
  )
}

export default App
