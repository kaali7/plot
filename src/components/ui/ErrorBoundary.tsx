import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-12 bg-red-900/10 border border-red-500/20 rounded-2xl text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-red-300/70 max-w-md mx-auto mb-6">
            An unexpected error occurred in this section. We've been notified and are looking into it.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
