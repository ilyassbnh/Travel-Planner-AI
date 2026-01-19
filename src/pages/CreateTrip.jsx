import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTrip } from '../redux/tripsSlice';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaMagic, FaCalendarAlt, FaMapMarkerAlt, FaImage, FaEuroSign } from 'react-icons/fa';

const CreateTrip = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);

    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        coverImage: '',
        description: ''
    });

    const handleGenerateAI = () => {
        if (!formData.destination) {
            alert("Veuillez d'abord entrer une destination !");
            return;
        }

        setIsGenerating(true);

        setTimeout(() => {
            const city = formData.destination;
            const aiText = `Préparez-vous à découvrir ${city} ! Cette destination offre un mélange parfait de culture et de détente. Ne manquez pas les spécialités locales et les points de vue panoramiques. Ce voyage promet d'être inoubliable avec un budget maîtrisé de ${formData.budget || '...'} €.`;

            setFormData((prev) => ({ ...prev, description: aiText }));
            setIsGenerating(false);
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalImage = formData.coverImage
            ? formData.coverImage
            : `https://loremflickr.com/640/480/${formData.destination},city`;

        const newTrip = {
            ...formData,
            budget: Number(formData.budget),
            coverImage: finalImage
        };

        dispatch(addTrip(newTrip)).then(() => {
            navigate('/');
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
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-text-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="Ex: 1500"
                            />
                        </div>
                    </div>

                    {/* AI Generator */}
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/20">
                        <div className="flex justify-between items-center mb-4">
                            <label className="font-semibold text-indigo-300 flex items-center gap-2">
                                <FaMagic /> Description (IA Assistant)
                            </label>
                            <motion.button
                                type="button"
                                onClick={handleGenerateAI}
                                disabled={isGenerating}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${isGenerating
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
                                        <span>✨ Générer avec l'IA</span>
                                    </>
                                )}
                            </motion.button>
                        </div>

                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 text-text-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                            placeholder="Laissez l'IA rédiger une description inspirante pour votre voyage..."
                        />
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-primary justify-center text-lg mt-8"
                    >
                        <FaPaperPlane />
                        Créer le voyage
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default CreateTrip;