// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrips } from '../redux/tripsSlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaPlane, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { list, status, error } = useSelector((state) => state.trips);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTrips());
        }
    }, [status, dispatch]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-center">
                Erreur: {error}
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Mon Tableau de Bord
                    </h1>
                    <p className="text-text-dim mt-2">Gérez vos prochaines aventures</p>
                </div>

                <Link to="/create" className="btn-primary group">
                    <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Nouveau Voyage</span>
                </Link>
            </div>

            {/* Grille des cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {list.map((trip) => (
                    <motion.div
                        key={trip.id}
                        variants={itemVariants}
                        className="card group cursor-pointer h-full flex flex-col"
                    >
                        {/* Image de couverture */}
                        <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-xl">
                            <img
                                src={trip.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'}
                                alt={trip.destination}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-2xl font-bold text-white drop-shadow-lg">{trip.destination}</h3>
                            </div>
                        </div>

                        <div className="space-y-4 flex-grow">
                            <div className="flex items-center text-text-dim space-x-2">
                                <FaCalendarAlt className="text-accent" />
                                <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-text-dim space-x-2">
                                <FaMoneyBillWave className="text-green-400" />
                                <span>{trip.budget} €</span>
                            </div>
                        </div>

                        <Link
                            to={`/trip/${trip.id}`}
                            className="mt-6 w-full py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-center text-sm font-medium text-accent transition-colors flex justify-center items-center gap-2 group-hover:gap-3"
                        >
                            Voir le planning <span className="transition-all">→</span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {list.length === 0 && (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-slate-700"
                >
                    <FaPlane className="mx-auto text-6xl text-slate-600 mb-4" />
                    <p className="text-xl text-text-dim">Aucun voyage pour le moment.</p>
                    <Link to="/create" className="text-accent hover:underline mt-2 inline-block">
                        Commencez par en créer un !
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Dashboard;