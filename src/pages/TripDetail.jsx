import { sendTripToWebhook } from '../services/n8nService';
import { FaPaperPlane, FaArrowLeft, FaPlus, FaMoneyBillWave, FaUtensils, FaTicketAlt, FaHotel, FaBus, FaEdit, FaTrash, FaCheck, FaTimes, FaCamera, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

// ... (existing imports)

const TripDetail = () => {
    // ... (existing state)
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ... (existing state vars)

    // Email Sending State
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [sendingStatus, setSendingStatus] = useState('idle'); // idle, sending, success, error

    // ... (existing useEffects)

    const handleSendEmail = async () => {
        if (!emailInput) return;

        setSendingStatus('sending');
        try {
            await sendTripToWebhook({
                tripData: trip,
                activities: activities,
                email: emailInput
            });
            setSendingStatus('success');
            setTimeout(() => {
                setIsSendingEmail(false);
                setSendingStatus('idle');
                setEmailInput('');
            }, 2000);
        } catch (error) {
            console.error("Failed to send email", error);
            setSendingStatus('error');
        }
    };

    // ... (existing handlers: handleAdd, handleUpdateBudget, etc)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto pb-10"
        >
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="inline-flex items-center gap-2 text-text-dim hover:text-accent transition-colors">
                    <FaArrowLeft /> Retour au Dashboard
                </Link>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsSendingEmail(true)}
                        className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <FaEnvelope /> Envoyer par Email
                    </button>
                    <button
                        onClick={openDetailsEdit}
                        className="px-4 py-2 bg-slate-800 text-text-light hover:bg-slate-700 rounded-lg text-sm flex items-center gap-2 transition-colors border border-white/10"
                    >
                        <FaEdit /> Modifier Infos
                    </button>
                    <button
                        onClick={handleDeleteTrip}
                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm flex items-center gap-2 transition-colors border border-red-500/20"
                    >
                        <FaTrash /> Supprimer Voyage
                    </button>
                </div>
            </div>

            {/* Email Modal */}
            {isSendingEmail && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FaEnvelope className="text-accent" /> Envoyer le voyage
                        </h3>
                        <p className="text-text-dim mb-6 text-sm">
                            Entrez l'adresse email du destinataire pour envoyer le détail complet du voyage.
                        </p>

                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="ami@exemple.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent outline-none"
                                autoFocus
                            />

                            {sendingStatus === 'success' && (
                                <p className="text-green-400 text-sm flex items-center gap-2">
                                    <FaCheck /> Envoyé avec succès !
                                </p>
                            )}
                            {sendingStatus === 'error' && (
                                <p className="text-red-400 text-sm flex items-center gap-2">
                                    <FaTimes /> Erreur lors de l'envoi.
                                </p>
                            )}

                            <div className="flex gap-4 justify-end pt-4">
                                <button
                                    onClick={() => {
                                        setIsSendingEmail(false);
                                        setSendingStatus('idle');
                                    }}
                                    className="px-4 py-2 text-text-dim hover:text-white transition-colors"
                                >
                                    Fermer
                                </button>
                                <button
                                    onClick={handleSendEmail}
                                    disabled={sendingStatus === 'sending' || !emailInput}
                                    className={`btn-primary px-6 flex items-center gap-2 ${sendingStatus === 'sending' ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {sendingStatus === 'sending' ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
                                            Envoi...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane /> Envoyer
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl group">
                <div className="absolute inset-0 bg-slate-900/60 z-10 transition-opacity duration-300 group-hover:bg-slate-900/40"></div>
                <ImageWithFallback
                    src={trip.coverImage}
                    alt={trip.destination}
                    fallbackText={trip.destination}
                    className="w-full h-64 object-cover"
                />

                {/* Edit Image Button */}
                <button
                    onClick={() => {
                        setImageUrlInput(trip.coverImage || '');
                        setIsEditingImage(true);
                    }}
                    className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    title="Modifier l'image"
                >
                    <FaCamera size={18} />
                </button>

                {/* Edit Details Modal */}
                {isEditingDetails && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaEdit className="text-accent" /> Modifier les informations
                                </h3>
                                <button onClick={() => setIsEditingDetails(false)} className="text-text-dim hover:text-white">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-dim">Destination</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-3 text-slate-400" />
                                            <input
                                                type="text"
                                                value={detailsForm.destination}
                                                onChange={(e) => setDetailsForm({ ...detailsForm, destination: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-accent outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-dim">Dates</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                value={detailsForm.startDate}
                                                onChange={(e) => setDetailsForm({ ...detailsForm, startDate: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-accent outline-none"
                                            />
                                            <input
                                                type="date"
                                                value={detailsForm.endDate}
                                                onChange={(e) => setDetailsForm({ ...detailsForm, endDate: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-accent outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm text-text-dim">Description</label>
                                            <button
                                                onClick={handleGenerateDescription}
                                                type="button"
                                                className="text-xs text-accent hover:text-white flex items-center gap-1 bg-accent/10 hover:bg-accent/20 px-2 py-1 rounded transition-colors"
                                            >
                                                ✨ Régénérer (IA)
                                            </button>
                                        </div>
                                        <textarea
                                            rows="5"
                                            value={detailsForm.description}
                                            onChange={(e) => setDetailsForm({ ...detailsForm, description: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent outline-none resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 flex gap-4 justify-end bg-slate-900 rounded-b-2xl">
                                <button
                                    onClick={() => setIsEditingDetails(false)}
                                    className="px-4 py-2 text-text-dim hover:text-white transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={saveDetailsUpdate}
                                    className="btn-primary px-6"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Image Modal/Input Overlay */}
                {isEditingImage && (
                    <div className="absolute inset-0 z-40 bg-slate-900/90 flex flex-col items-center justify-center p-8 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-4">Modifier l'image de couverture</h3>
                        <div className="w-full max-w-md space-y-4">
                            <input
                                type="url"
                                placeholder="https://..."
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent outline-none"
                                autoFocus
                            />
                            <div className="flex gap-4 justify-end">
                                <button
                                    onClick={() => setIsEditingImage(false)}
                                    className="px-4 py-2 text-text-dim hover:text-white transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleUpdateImage}
                                    className="btn-primary"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                            <p className="text-sm text-text-dim italic leading-relaxed whitespace-pre-wrap">
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
                </div>



                {/* Right Column: Activities List */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Dépenses & Activités</h2>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsAddingActivity(!isAddingActivity)}
                            className={`p-3 rounded-full shadow-lg transition-colors ${isAddingActivity
                                ? 'bg-red-500/20 text-red-400 rotate-45'
                                : 'bg-accent text-white'
                                }`}
                        >
                            <FaPlus className={`transition-transform duration-300 ${isAddingActivity ? 'rotate-45' : ''}`} />
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {isAddingActivity && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-6"
                            >
                                <div className="card border-accent/20 bg-slate-800/80 p-4">
                                    <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 items-end">
                                        <div className="flex-1 w-full">
                                            <label className="text-xs text-text-dim mb-1 block">Nom</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Restaurant..."
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-accent focus:outline-none text-white"
                                                autoFocus
                                            />

                                        </div>
                                        <div className="w-full md:w-24">
                                            <label className="text-xs text-text-dim mb-1 block">Prix (€)</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.cost}
                                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-accent focus:outline-none text-white"
                                            />
                                        </div>
                                        <div className="w-full md:w-40">
                                            <label className="text-xs text-text-dim mb-1 block">Catégorie</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-accent focus:outline-none text-white"
                                            >
                                                <option value="Loisir">Loisir</option>
                                                <option value="Nourriture">Nourriture</option>
                                                <option value="Transport">Transport</option>
                                                <option value="Logement">Logement</option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto btn-primary py-2.5 px-6 justify-center"
                                        >
                                            <FaCheck />
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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