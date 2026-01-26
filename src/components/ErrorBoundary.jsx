import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const message = this.state.error instanceof Error ? this.state.error.message : 'An unexpected error occurred.';

    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 sm:p-6">
          <h1 className="text-lg sm:text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            The app hit an error while rendering. You can try resetting the UI or reloading the page.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400 hover:bg-primary-600 dark:hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
            >
              Reload page
            </button>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-neutral-700 dark:text-neutral-300">Error details</summary>
            <pre className="mt-2 text-xs overflow-auto rounded-md bg-neutral-50 dark:bg-neutral-900 p-3 border border-neutral-200 dark:border-neutral-800">
              {message}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
