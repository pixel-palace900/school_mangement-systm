import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'), {
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error, errorInfo);
  },
  onCaughtError: (error, errorInfo) => {
    console.error('Caught error:', error, errorInfo.componentStack);
  }
});

root.render(<App />);



