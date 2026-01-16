// src/pages/TripDetail.jsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../redux/activitiesSlice';
import { fetchTrips } from '../redux/tripsSlice'; // Pour retrouver les infos du voyage (titre, budget)

const TripDetail = () => {
  const { id } = useParams(); // On récupère l'ID depuis l'URL (ex: /trip/1)
  const dispatch = useDispatch();

  // 1. Récupérer les infos du voyage actuel (depuis le store trips)
  const trip = useSelector((state) => 
    state.trips.list.find((t) => t.id === id)
  );

  // 2. Récupérer les activités (depuis le store activities)
  const { list: activities, status } = useSelector((state) => state.activities);

  // Charger les données au montage
  useEffect(() => {
    // Si on a refresh la page et perdu les trips, on les recharge
    if (!trip) {
      dispatch(fetchTrips());
    }
    // On charge les activités de ce voyage précis
    dispatch(fetchActivities(id));
  }, [dispatch, id, trip]);

  if (!trip) return <div>Chargement du voyage...</div>;

  // Calcul du budget dépensé
  const totalSpent = activities.reduce((acc, curr) => acc + Number(curr.cost), 0);
  const remainingBudget = trip.budget - totalSpent;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#666' }}>← Retour au Dashboard</Link>
      
      {/* Header Voyage */}
      <div style={{ marginTop: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
        <h1 style={{ marginBottom: '10px' }}>{trip.destination}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📅 Du {new Date(trip.startDate).toLocaleDateString()} au {new Date(trip.endDate).toLocaleDateString()}</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Budget: {trip.budget} €</span>
        </div>

        {/* JAUGE DE BUDGET (Feature Clé) */}
        <div style={{ marginTop: '15px', background: '#eee', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${Math.min((totalSpent / trip.budget) * 100, 100)}%`, 
            background: remainingBudget < 0 ? 'red' : '#4CAF50', 
            height: '100%',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
        <p>Reste : <strong>{remainingBudget} €</strong></p>
      </div>

      {/* Liste des Activités */}
      <div style={{ marginTop: '30px' }}>
        <h2>Activités prévues</h2>
        {activities.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#888' }}>Aucune activité pour le moment.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {activities.map((act) => (
              <li key={act.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                <span>{act.name} ({act.category})</span>
                <span style={{ fontWeight: 'bold' }}>-{act.cost} €</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TripDetail;