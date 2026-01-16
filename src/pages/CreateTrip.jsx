import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTrip } from '../redux/tripsSlice';
import { generateTripDescription } from '../services/aiService';

const CreateTrip = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // État pour gérer le chargement de l'IA
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    coverImage: '',
    description: '' // <--- NOUVEAU CHAMP
  });

  // --- FONCTION SIMULATION IA ---
  const handleGenerateAI = () => {
    if (!formData.destination) {
      alert("Veuillez d'abord entrer une destination !");
      return;
    }

    setIsGenerating(true);

    // On simule un délai réseau (2 secondes) comme si on appelait ChatGPT
    setTimeout(() => {
      const city = formData.destination;
      
      // Ici, on pourrait appeler une vraie API. 
      // Pour le fil rouge, ce script génère un texte crédible :
      const aiText = `Préparez-vous à découvrir ${city} ! Cette destination offre un mélange parfait de culture et de détente. Ne manquez pas les spécialités locales et les points de vue panoramiques. Ce voyage promet d'être inoubliable avec un budget maîtrisé de ${formData.budget || '...'} €.`;
      
      setFormData((prev) => ({ ...prev, description: aiText }));
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Image automatique si vide
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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🌍 Nouveau Voyage</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* DESTINATION */}
        <div>
          <label>Destination :</label>
          <input 
            type="text" 
            required
            value={formData.destination}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ex: Tokyo, Paris..."
          />
        </div>

        {/* --- NOUVEAU : GENERATEUR IA --- */}
        <div style={{ background: '#f0f8ff', padding: '15px', borderRadius: '8px', border: '1px solid #0066CC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <label style={{ fontWeight: 'bold' }}>Description (IA Assistant) :</label>
            
            {/* BOUTON MAGIQUE */}
            <button 
              type="button" 
              onClick={handleGenerateAI}
              disabled={isGenerating}
              style={{ 
                background: isGenerating ? '#ccc' : 'purple', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {isGenerating ? '✨ L\'IA écrit...' : '✨ Générer description'}
            </button>
          </div>

          <textarea 
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Cliquez sur le bouton magique ou écrivez vous-même..."
          />
        </div>

        {/* RESTE DU FORMULAIRE */}
        <div>
          <label>Image URL (Optionnel) :</label>
          <input 
            type="url" 
            value={formData.coverImage}
            onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label>Début :</label>
            <input 
              type="date" 
              required
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Fin :</label>
            <input 
              type="date" 
              required
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>

        <div>
          <label>Budget Global (€) :</label>
          <input 
            type="number" 
            required
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ex: 1500"
          />
        </div>

        <button type="submit" style={{ padding: '12px', background: '#0066CC', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
          Créer le voyage
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;