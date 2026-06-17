class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    // Update state → triggers fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log to error reporting service
    logErrorToService(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fallback">
          <h2>Something went wrong</h2>
          <button onClick={() =>
            this.setState({ hasError: false })
          }>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}