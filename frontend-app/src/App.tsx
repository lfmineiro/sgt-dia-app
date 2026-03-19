import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/Login'

function App() {

  return (
  <Routes> 
    <Route path='/' element={<Navigate to="/login" replace />} />
    <Route path='/login' element={<LoginPage />} />
    
  </Routes>
  )
}

export default App
