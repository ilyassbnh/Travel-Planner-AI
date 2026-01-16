// src/pages/CreateTrip.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Pour rediriger après la création
import { addTrip } from '../redux/tripsSlice';

const CreateTrip = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Création de l'objet voyage
    const newTrip = {
      ...formData,
      budget: Number(formData.budget),
      // Astuce : Image dynamique basée sur le nom de la ville
      coverImage: `https://loremflickr.com/640/480/${formData.destination},city`
    };

    // Envoi à Redux
    dispatch(addTrip(newTrip)).then(() => {
      // Une fois fini, on retourne à l'accueil
      navigate('/');
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🌍 Nouveau Voyage</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
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