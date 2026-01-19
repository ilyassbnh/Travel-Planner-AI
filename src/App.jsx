import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail';
import CreateTrip from './pages/CreateTrip';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTrip />} />
        <Route path="/trip/:id" element={<TripDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden text-text-light selection:bg-accent selection:text-white">
        {/* Animated Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <nav className="p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            TravelAI
          </h1>
          {/* Add navigation links here if needed */}
        </nav>

        <main className="container mx-auto px-4 py-8">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
