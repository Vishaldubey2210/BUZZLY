import React from 'react';
import { AppRouter } from './routes/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
