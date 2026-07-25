import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Diary } from './pages/Diary'
import { WeeksList } from './pages/WeeksList'
import { WeekDetail } from './pages/WeekDetail'
import { Reports } from './pages/Reports'
import { Practices } from './pages/Practices'
import { Assessments } from './pages/Assessments'
import { AssessmentDetail } from './pages/AssessmentDetail'
import { DataSettings } from './pages/DataSettings'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/weeks" element={<WeeksList />} />
        <Route path="/weeks/:number" element={<WeekDetail />} />
        <Route path="/practices" element={<Practices />} />
        <Route path="/tests" element={<Assessments />} />
        <Route path="/tests/:stage" element={<AssessmentDetail />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/data" element={<DataSettings />} />
      </Route>
    </Routes>
  )
}

export default App
