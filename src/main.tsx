import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LeaderboardPage } from './components/screens/LeaderboardPage.tsx'

const isLeaderboard = /^\/(leaderboard|learderboard)\/?$/i.test(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isLeaderboard ? <LeaderboardPage /> : <App />}</StrictMode>,
)
