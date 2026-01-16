// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrips } from '../redux/tripsSlice';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const dispatch = useDispatch();

    // On récupère les données depuis le Store Redux
    const { list, status, error } = useSelector((state) => state.trips);

    // Au chargement de la page, on lance l'appel API
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTrips());
        }
    }, [status, dispatch]);

    if (status === 'loading') return <div style={{ padding: "20px" }}>Chargement des voyages...</div>;
    if (status === 'failed') return <div style={{ color: "red" }}>Erreur: {error}</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Mon Tableau de Bord ✈️</h1>
            <Link to="/create" style={{ padding: '10px 20px', background: 'green', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                + Nouveau Voyage
            </Link>
            {/* Grille des cartes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>

                {list.map((trip) => (
                    <div key={trip.id} style={{ border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

                        {/* Image de couverture */}
                        <img
                            src={trip.coverImage}
                            alt={trip.destination}
                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />

                        <div style={{ padding: '15px' }}>
                            <h3>{trip.destination}</h3>
                            <p style={{ color: '#666' }}>
                                📅 {new Date(trip.startDate).toLocaleDateString()}
                            </p>
                            <p style={{ fontWeight: 'bold', color: '#0066CC' }}>
                                💰 {trip.budget} €
                            </p>

                            {/* Lien vers le détail (on créera cette page après) */}
                            <Link to={`/trip/${trip.id}`} style={{ display: 'block', marginTop: '10px', textDecoration: 'none', color: 'blue' }}>
                                Voir le planning →
                            </Link>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Dashboard;