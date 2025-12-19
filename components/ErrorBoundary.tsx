import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-500">
            <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            The app encountered an unexpected error. Don't worry, your progress is saved locally.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
            >
              Reload Application
            </button>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 px-6 rounded-xl transition-all"
            >
              Reset Data (Hard Fix)
            </button>
          </div>
          {this.state.error && (
              <div className="mt-8 p-4 bg-slate-100 dark:bg-black rounded text-left overflow-auto max-w-lg w-full max-h-40 text-xs font-mono text-red-500">
                  {this.state.error.toString()}
              </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}