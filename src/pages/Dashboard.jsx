import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrips } from '../redux/tripsSlice';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaPlane, FaCalendarAlt, FaMoneyBillWave, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { list, status, error } = useSelector((state) => state.trips);

    // State for Search & Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('destination'); // 'destination' | 'date' | 'budget'
    const [filterValue, setFilterValue] = useState('');

    // State for Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTrips());
        }
    }, [status, dispatch]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, filterValue]);

    // Derived unique sorted destinations for the dropdown
    const uniqueDestinations = [...new Set(list.map(trip => trip.destination))].sort((a, b) => a.localeCompare(b));

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

    // Normalize helper for robust search (ignores accents, case, and spacing)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    // Filter Logic
    const filteredTrips = list.filter(trip => {
        const matchesSearch = normalizeText(trip.destination).includes(normalizeText(searchTerm));

        let matchesFilter = true;
        if (filterValue) {
            if (filterType === 'destination') {
                matchesFilter = trip.destination === filterValue;
            } else if (filterType === 'date') {
                matchesFilter = new Date(trip.startDate) >= new Date(filterValue);
            } else if (filterType === 'budget') {
                matchesFilter = parseFloat(trip.budget) <= parseFloat(filterValue);
            }
        }

        return matchesSearch && matchesFilter;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTrips.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top of list if needed, or just keep position
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Mon Tableau de Bord
                    </h1>
                    <p className="text-text-dim mt-2">Gérez vos prochaines aventures</p>
                </div>

                <Link to="/create" className="btn-primary group whitespace-nowrap">
                    <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Nouveau Voyage</span>
                </Link>
            </div>

            {/* Combined Search & Filter Bar */}
            <div className="bg-secondary/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center relative z-50">
                {/* Search Input */}
                <div className="relative flex-grow w-full md:w-auto">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-dim" />
                    <input
                        type="text"
                        placeholder="Rechercher une destination..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-primary/50 border border-white/10 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none text-white placeholder-text-dim transition-all"
                    />
                </div>

                {/* Filter Type Dropdown */}
                <div className="w-full md:w-48">
                    <select
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setFilterValue(''); // Reset value when type changes
                        }}
                        className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg focus:border-accent outline-none text-white appearance-none cursor-pointer"
                    >
                        <option value="destination">Par Ville</option>
                        <option value="date">Par Date</option>
                        <option value="budget">Par Budget Max</option>
                    </select>
                </div>

                {/* Dynamic Filter Input */}
                <div className="w-full md:w-64">
                    {filterType === 'destination' && (
                        <select
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg focus:border-accent outline-none text-white appearance-none cursor-pointer"
                        >
                            <option value="">Toutes les villes</option>
                            {uniqueDestinations.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    )}

                    {filterType === 'date' && (
                        <div className="w-full">
                            <DatePicker
                                selected={filterValue}
                                onChange={(date) => setFilterValue(date)}
                                placeholderText="Sélectionner une date"
                                className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg focus:border-accent outline-none text-white placeholder-text-dim"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    )}

                    {filterType === 'budget' && (
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                placeholder="Budget Max (€)"
                                value={filterValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || parseFloat(val) >= 0) {
                                        setFilterValue(val);
                                    }
                                }}
                                className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg focus:border-accent outline-none text-white placeholder-text-dim"
                            />
                        </div>
                    )}
                </div>
                {/* Reset Button */}
                {(searchTerm || filterValue) && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterValue('');
                        }}
                        className="px-4 py-2 text-sm text-text-dim hover:text-white transition-colors whitespace-nowrap"
                    >
                        Réinitialiser
                    </button>
                )}
            </div>

            {/* Grille des cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode='wait'>
                    {currentItems.map((trip) => (
                        <motion.div
                            key={trip.id}
                            layout
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.9 }}
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
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-secondary border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                    >
                        <FaChevronLeft />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center transition-all ${currentPage === page
                                ? 'bg-accent text-white font-bold scale-105'
                                : 'bg-secondary text-text-dim hover:bg-white/5'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-secondary border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}

            {filteredTrips.length === 0 && (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-slate-700"
                >
                    <FaPlane className="mx-auto text-6xl text-slate-600 mb-4" />
                    <p className="text-xl text-text-dim">Aucun voyage trouvé.</p>
                    {searchTerm || filterValue ? (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterValue('');
                            }}
                            className="text-accent hover:underline mt-2 inline-block"
                        >
                            Réinitialiser les filtres
                        </button>
                    ) : (
                        <Link to="/create" className="text-accent hover:underline mt-2 inline-block">
                            Commencez par en créer un !
                        </Link>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default Dashboard;