import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Diary } from './pages/Diary'
import { WeeksList } from './pages/WeeksList'
import { WeekDetail } from './pages/WeekDetail'
import { Reports } from './pages/Reports'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/weeks" element={<WeeksList />} />
        <Route path="/weeks/:number" element={<WeekDetail />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}

export default App
