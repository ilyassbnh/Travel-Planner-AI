import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, addActivity, deleteActivity, updateActivity } from '../redux/activitiesSlice';
import { fetchTrips, updateTripBudget } from '../redux/tripsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaMoneyBillWave, FaUtensils, FaTicketAlt, FaHotel, FaBus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const TripDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        cost: '',
        category: 'Loisir'
    });

    const trip = useSelector((state) =>
        state.trips.list.find((t) => t.id === id)
    );

    const { list: activities } = useSelector((state) => state.activities);

    // Budget Editing State
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budgetInput, setBudgetInput] = useState('');

    // Activity Editing State
    const [editingActivityId, setEditingActivityId] = useState(null);
    const [editActivityForm, setEditActivityForm] = useState({ name: '', cost: '', category: '' });

    useEffect(() => {
        if (!trip) {
            dispatch(fetchTrips());
        }
        dispatch(fetchActivities(id));
    }, [dispatch, id, trip]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.cost) return;

        const newActivity = {
            tripId: id,
            name: formData.name,
            cost: Number(formData.cost),
            category: formData.category,
            date: new Date().toISOString()
        };

        dispatch(addActivity(newActivity));
        setFormData({ name: '', cost: '', category: 'Loisir' });
    };

    const handleUpdateBudget = () => {
        if (!budgetInput || parseFloat(budgetInput) < 0) return;
        dispatch(updateTripBudget({ id: trip.id, budget: parseFloat(budgetInput) }));
        setIsEditingBudget(false);
    };

    const handleDeleteActivity = (activityId) => {
        if (confirm('Voulez-vous vraiment supprimer cette activité ?')) {
            dispatch(deleteActivity(activityId));
        }
    };

    const startEditingActivity = (activity) => {
        setEditingActivityId(activity.id);
        setEditActivityForm({
            name: activity.name,
            cost: activity.cost,
            category: activity.category
        });
    };

    const saveActivityUpdate = () => {
        dispatch(updateActivity({
            id: editingActivityId,
            ...editActivityForm,
            cost: Number(editActivityForm.cost)
        }));
        setEditingActivityId(null);
    };

    if (!trip) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
    );

    const totalSpent = activities.reduce((acc, curr) => acc + Number(curr.cost), 0);
    const remainingBudget = trip.budget - totalSpent;
    const progress = Math.min((totalSpent / trip.budget) * 100, 100);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Nourriture': return <FaUtensils className="text-orange-400" />;
            case 'Transport': return <FaBus className="text-blue-400" />;
            case 'Logement': return <FaHotel className="text-purple-400" />;
            default: return <FaTicketAlt className="text-green-400" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto pb-10"
        >
            <Link to="/" className="inline-flex items-center gap-2 text-text-dim hover:text-accent transition-colors mb-6">
                <FaArrowLeft /> Retour au Dashboard
            </Link>

            {/* Header / Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
                <img
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'}
                    alt={trip.destination}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-bold text-white mb-2"
                    >
                        {trip.destination}
                    </motion.h1>
                    <div className="flex flex-wrap gap-4 text-white/80">
                        <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-sm border border-white/20">
                            📅 {new Date(trip.startDate).toLocaleDateString()}
                        </span>
                        <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-sm border border-white/20">
                            💰 Budget: {trip.budget} €
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Budget & Info */}
                <div className="space-y-6">
                    {/* Description */}
                    {trip.description && (
                        <div className="card bg-slate-800/50 border-slate-700/50">
                            <h3 className="font-semibold text-text-light mb-2 flex items-center gap-2">
                                ✨ L'avis de l'IA
                            </h3>
                            <p className="text-sm text-text-dim italic leading-relaxed">
                                {trip.description}
                            </p>
                        </div>
                    )}

                    {/* Budget Card */}
                    <div className="card bg-slate-800/50 border-slate-700/50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-text-light flex items-center gap-2">
                                <FaMoneyBillWave className="text-green-400" />
                                Budget
                            </h3>
                            {!isEditingBudget ? (
                                <button
                                    onClick={() => {
                                        setBudgetInput(trip.budget);
                                        setIsEditingBudget(true);
                                    }}
                                    className="text-text-dim hover:text-accent transition-colors"
                                >
                                    <FaEdit />
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleUpdateBudget} className="text-green-400 hover:text-green-300">
                                        <FaCheck />
                                    </button>
                                    <button onClick={() => setIsEditingBudget(false)} className="text-red-400 hover:text-red-300">
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditingBudget && (
                            <div className="mb-4">
                                <input
                                    type="number"
                                    min="0"
                                    value={budgetInput}
                                    onChange={(e) => setBudgetInput(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-accent outline-none text-white"
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`absolute top-0 left-0 h-full ${remainingBudget < 0 ? 'bg-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-400'}`}
                            />
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-dim">Dépensé: {totalSpent} €</span>
                            <span className={`font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                Reste: {remainingBudget.toFixed(2)} €
                            </span>
                        </div>
                    </div>

                    {/* Add Expense Form */}
                    <div className="card border-accent/20 bg-slate-800/80">
                        <h3 className="font-semibold text-text-light mb-4">➕ Ajouter une dépense</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nom (ex: Restaurant)"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none text-white"
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Prix (€)"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none text-white"
                                />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none text-white"
                                >
                                    <option value="Loisir">Loisir</option>
                                    <option value="Nourriture">Nourriture</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Logement">Logement</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full btn-primary py-2 text-sm justify-center">
                                Ajouter
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Activities List */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6">Dépenses & Activités</h2>

                    {activities.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                            <p className="text-text-dim">Aucune activité pour le moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {activities.map((act) => (
                                    <motion.div
                                        key={act.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-secondary p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between hover:border-slate-600 transition-colors gap-4"
                                    >
                                        {editingActivityId === act.id ? (
                                            // Edit Mode
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 items-center w-full">
                                                <div className="md:col-span-5">
                                                    <input
                                                        type="text"
                                                        value={editActivityForm.name}
                                                        onChange={(e) => setEditActivityForm({ ...editActivityForm, name: e.target.value })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <select
                                                        value={editActivityForm.category}
                                                        onChange={(e) => setEditActivityForm({ ...editActivityForm, category: e.target.value })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
                                                    >
                                                        <option value="Loisir">Loisir</option>
                                                        <option value="Nourriture">Nourriture</option>
                                                        <option value="Transport">Transport</option>
                                                        <option value="Logement">Logement</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <input
                                                        type="number"
                                                        value={editActivityForm.cost}
                                                        onChange={(e) => setEditActivityForm({ ...editActivityForm, cost: e.target.value })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 flex gap-2 justify-end">
                                                    <button onClick={saveActivityUpdate} className="p-2 text-green-400 bg-green-400/10 rounded hover:bg-green-400/20">
                                                        <FaCheck />
                                                    </button>
                                                    <button onClick={() => setEditingActivityId(null)} className="p-2 text-red-400 bg-red-400/10 rounded hover:bg-red-400/20">
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Display Mode
                                            <>
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg shadow-inner flex-shrink-0">
                                                        {getCategoryIcon(act.category)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-text-light">{act.name}</h4>
                                                        <span className="text-xs text-text-dim uppercase tracking-wider">{act.category}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <span className="font-bold text-lg text-white">-{act.cost} €</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => startEditingActivity(act)}
                                                            className="p-2 text-text-dim hover:text-accent hover:bg-white/5 rounded-lg transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteActivity(act.id)}
                                                            className="p-2 text-text-dim hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TripDetail;