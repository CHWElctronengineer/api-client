import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import LogViewer from './LogViewer/LogViewer';

export function App() {
  

  return (
    <div className="App">
      <LogViewer />
    </div>
  );
}
