import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail';
import CreateTrip from './pages/CreateTrip';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';
function AnimatedRoutes({ session }) {
  const location = useLocation();

  if (!session) {
    return (
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTrip />} />
        <Route path="/trip/:id" element={<TripDetail />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden text-text-light selection:bg-accent selection:text-white">
        <Toaster position="top-center" reverseOrder={false} />
        {/* Animated Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <nav className="p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            TravelAI
          </h1>

          {session && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-dim hidden sm:inline-block">
                {session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/50"
                title="Déconnexion"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline-block">Déconnexion</span>
              </button>
            </div>
          )}
        </nav>

        <main className="container mx-auto px-4 py-8">
          <AnimatedRoutes session={session} />
        </main>
      </div>
    </Router>
  );
}

export default App;
