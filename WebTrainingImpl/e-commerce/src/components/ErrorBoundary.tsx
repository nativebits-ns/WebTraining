import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onReset: () => void
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  private reset = () => {
    this.props.onReset()
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="text-lg font-semibold text-red-900">We couldn't load the products</h3>
          <p className="mt-1 text-sm text-red-800">{this.state.error.message}</p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
