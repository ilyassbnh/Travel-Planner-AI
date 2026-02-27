import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTrip } from '../redux/tripsSlice';
import { addActivity } from '../redux/activitiesSlice';
import { generateTripDescription } from '../services/aiService';
import { fetchCityImage } from '../services/unsplashService';

import { motion } from 'framer-motion';
import { FaPaperPlane, FaMagic, FaCalendarAlt, FaMapMarkerAlt, FaImage, FaEuroSign, FaEdit, FaEye, FaCheckCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const CreateTrip = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [previewMode, setPreviewMode] = useState(true);

    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        coverImage: '',
        description: ''
    });
    const [generatedActivities, setGeneratedActivities] = useState([]);

    const handleGenerateAI = async () => {
        if (!formData.destination) {
            toast.error("Veuillez d'abord entrer une destination !");
            return;
        }

        setIsGenerating(true);
        // Force preview mode so they see the result properly formatted once done
        setPreviewMode(true);

        try {
            // true signals n8n to generate activities
            const { description, activities } = await generateTripDescription(formData.destination, formData.budget || 1000, true);
            setFormData((prev) => ({ ...prev, description: description }));
            if (activities && activities.length > 0) {
                setGeneratedActivities(activities);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la génération avec l'IA");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(formData.budget) <= 0) {
            toast.error("Le budget doit être supérieur à 0.");
            return;
        }

        const finalImage = formData.coverImage
            ? formData.coverImage
            : await fetchCityImage(formData.destination);

        const newTrip = {
            ...formData,
            budget: Number(formData.budget),
            coverImage: finalImage
        };

        dispatch(addTrip(newTrip)).then((action) => {
            // action.payload contains the newly created trip object if the thunk was fulfilled
            const createdTripData = action.payload;

            // Dispatch activities if AI generated them
            if (generatedActivities.length > 0 && createdTripData && createdTripData.id) {
                generatedActivities.forEach(activity => {
                    // Provide default formatted activity object
                    const newActivity = {
                        tripId: createdTripData.id,
                        name: activity.name,
                        cost: Number(activity.cost) || 0,
                        category: activity.category || 'Loisir',
                        date: new Date().toISOString()
                    };
                    dispatch(addActivity(newActivity));
                })
            }

            setIsSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1200);
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-secondary/50 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Planifier un nouveau voyage
                    </h1>
                    <p className="text-text-dim">Remplissez les détails ci-dessous pour commencer votre aventure</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Destination */}
                    <div className="relative group">
                        <label className="block text-sm font-medium text-text-dim mb-1">Destination</label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                required
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-text-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="Ex: Tokyo, Paris..."
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="relative group">
                        <label className="block text-sm font-medium text-text-dim mb-1">Image URL (Optionnel)</label>
                        <div className="relative">
                            <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                            <input
                                type="url"
                                value={formData.coverImage}
                                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-text-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dates */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-dim mb-1">Début</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-text-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-dim mb-1">Fin</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="date"
                                    required
                                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-text-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="relative group">
                        <label className="block text-sm font-medium text-text-dim mb-1">Budget Global (€)</label>
                        <div className="relative">
                            <FaEuroSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-text-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="Ex: 1500"
                            />
                        </div>
                    </div>

                    {/* AI Generator */}
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-1 md:p-6 rounded-xl border border-indigo-500/20">
                        <div className="p-4 md:p-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <label className="font-semibold text-indigo-300 flex items-center gap-2 text-lg md:text-base">
                                <FaMagic /> Description (IA Assistant)
                            </label>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {/* Toggle Preview/Edit Tabs */}
                                {formData.description && !isGenerating && (
                                    <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-700/50">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewMode(true)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${previewMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <FaEye /> Aperçu
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewMode(false)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${!previewMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <FaEdit /> Éditer
                                        </button>
                                    </div>
                                )}

                                <motion.button
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors flex-1 justify-center md:flex-none ${isGenerating
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
                                            Génération...
                                        </>
                                    ) : (
                                        <>
                                            <span>✨ Auto-générer</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        <div className="relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900/50">
                            {isGenerating ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center gap-6 bg-slate-900/30">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                                        <div className="w-16 h-16 border-4 border-slate-700/50 border-t-indigo-500 rounded-full animate-spin"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg font-medium text-indigo-300">
                                            L'IA explore les possibilités...
                                        </p>
                                        <p className="text-sm text-slate-400 animate-pulse">
                                            Création de votre itinéraire sur-mesure ! ✨
                                        </p>
                                    </div>
                                </div>
                            ) : previewMode && formData.description ? (
                                <div className="p-4 md:p-6 prose prose-invert prose-indigo max-w-none text-text-light custom-scrollbar overflow-y-auto max-h-[400px]">
                                    <ReactMarkdown>{formData.description}</ReactMarkdown>
                                </div>
                            ) : (
                                <textarea
                                    rows="6"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-transparent p-4 text-text-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-y custom-scrollbar min-h-[150px]"
                                    placeholder="Laissez l'IA rédiger une description inspirante pour votre voyage..."
                                />
                            )}
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isSuccess}
                        whileHover={!isSuccess ? { scale: 1.02 } : {}}
                        whileTap={!isSuccess ? { scale: 0.98 } : {}}
                        className={`w-full justify-center text-lg mt-8 transition-all ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-600 text-white cursor-default py-3 px-6 rounded-xl font-semibold flex items-center gap-2' : 'btn-primary'}`}
                    >
                        {isSuccess ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-2"
                            >
                                <FaCheckCircle className="text-xl" /> Voyage Créé !
                            </motion.div>
                        ) : (
                            <>
                                <FaPaperPlane /> Créer le voyage
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default CreateTrip;