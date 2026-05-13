import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/Login'
import { Dashboard } from './pages/Dashboard'
import { MainLayout } from './layouts/MainComponent'
import { AlteracoesPage } from './pages/Alteracoes'
import { EscalaPage } from './pages/Escala'
import { SpedPage } from './pages/Sped'
import { ConfiguracoesPage } from './pages/Configuracoes'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {

  return (
  <Routes>
    <Route path='/' element={<Navigate to="/login" replace />} />
    <Route path='/login' element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/alteracoes' element={<AlteracoesPage />} />
        <Route path='/escala' element={<EscalaPage />} />
        <Route path='/sped' element={<SpedPage />} />
        <Route path='/configuracoes' element={<ConfiguracoesPage />} />
      </Route>
    </Route>
  </Routes>
  )
}

export default App
