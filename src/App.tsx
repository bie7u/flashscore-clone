import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import MatchDetailsPage from './pages/MatchDetails';
import LeagueOverview from './pages/LeagueOverview';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/match/:matchId" element={<MatchDetailsPage />} />
              <Route path="/leagues" element={<LeagueOverview />} />
              <Route path="/fixtures" element={<Home />} />
              <Route path="/standings" element={<LeagueOverview />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
