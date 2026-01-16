import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, addActivity } from '../redux/activitiesSlice'; // Import addActivity
import { fetchTrips } from '../redux/tripsSlice';

const TripDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // State local pour le formulaire
    const [formData, setFormData] = useState({
        name: '',
        cost: '',
        category: 'Loisir'
    });

    const trip = useSelector((state) =>
        state.trips.list.find((t) => t.id === id)
    );

    const { list: activities } = useSelector((state) => state.activities);

    useEffect(() => {
        if (!trip) {
            dispatch(fetchTrips());
        }
        dispatch(fetchActivities(id));
    }, [dispatch, id, trip]);

    // Fonction pour soumettre le formulaire
    const handleAdd = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.cost) return;

        const newActivity = {
            tripId: id, // Important : on lie l'activité à CE voyage
            name: formData.name,
            cost: Number(formData.cost),
            category: formData.category,
            date: new Date().toISOString() // Date d'aujourd'hui
        };

        // On envoie à Redux (qui envoie à l'API)
        dispatch(addActivity(newActivity));

        // Reset du formulaire
        setFormData({ name: '', cost: '', category: 'Loisir' });
    };

    if (!trip) return <div>Chargement...</div>;

    const totalSpent = activities.reduce((acc, curr) => acc + Number(curr.cost), 0);
    const remainingBudget = trip.budget - totalSpent;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/" style={{ color: '#666' }}>← Retour au Dashboard</Link>

            {/* Header */}
            <div style={{ marginTop: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
                <h1 style={{ marginBottom: '10px' }}>{trip.destination}</h1>
                {/* Description IA */}
                {trip.description && (
                    <div style={{ background: '#eef', padding: '10px', borderRadius: '5px', margin: '10px 0', fontStyle: 'italic', color: '#555' }}>
                        ✨ {trip.description}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📅 {new Date(trip.startDate).toLocaleDateString()}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Budget: {trip.budget} €</span>
                </div>

                {/* Jauge */}
                <div style={{ marginTop: '15px', background: '#eee', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${Math.min((totalSpent / trip.budget) * 100, 100)}%`,
                        background: remainingBudget < 0 ? 'red' : '#4CAF50',
                        height: '100%',
                        transition: 'width 0.5s ease'
                    }}></div>
                </div>
                <p>Reste : <strong>{remainingBudget.toFixed(2)} €</strong></p>
            </div>

            {/* --- NOUVEAU : FORMULAIRE D'AJOUT --- */}
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
                <h3>➕ Ajouter une dépense</h3>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Nom (ex: Restaurant)"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ padding: '8px', flex: 1 }}
                    />
                    <input
                        type="number"
                        placeholder="Prix (€)"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        style={{ padding: '8px', width: '100px' }}
                    />
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ padding: '8px' }}
                    >
                        <option value="Loisir">Loisir</option>
                        <option value="Nourriture">Nourriture</option>
                        <option value="Transport">Transport</option>
                        <option value="Logement">Logement</option>
                    </select>
                    <button type="submit" style={{ padding: '8px 15px', background: '#0066CC', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                        Ajouter
                    </button>
                </form>
            </div>

            {/* Liste */}
            <div style={{ marginTop: '30px' }}>
                <h2>Dépenses</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {activities.map((act) => (
                        <li key={act.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                            <span>{act.name} <small style={{ color: '#888' }}>({act.category})</small></span>
                            <span style={{ fontWeight: 'bold' }}>-{act.cost} €</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TripDetail;