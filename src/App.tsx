import { BrowserRouter, Navigate } from 'react-router';
import './App.css';
import { Router } from './router';

function App() {

  const auth = localStorage.getItem('userinfo');

  if (!auth) {
    <Navigate replace to={'/'} />
  }

  return (
      <BrowserRouter>
        <Router />
      </BrowserRouter>
  )
}

export default App
