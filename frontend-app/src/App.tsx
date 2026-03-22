import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/Login'
import { Dashboard } from './pages/Dashboard'
import { MainLayout } from './layouts/MainComponent'

function App() {

  return (
  <Routes> 
    <Route path='/' element={<Navigate to="/login" replace />} />
    <Route path='/login' element={<LoginPage />} />

    <Route element={<MainLayout />}>
      <Route path='/dashboard' element={<Dashboard />} />
    </Route>
  </Routes>
  )
}

export default App
