import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import './PersonaList.css'; // Import the CSS file for styling

interface Persona {
  id: number;
  name: string;
  data: Record<string, any>;
}

const PersonaList: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await axios.get('personas/');
        setPersonas(response.data);
      } catch (err) {
        console.error('Error fetching personas:', err);
        setError('Failed to load personas.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  const handleSelectPersona = (personaId: number) => {
    navigate(`/generate?personaId=${personaId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="persona-list-container">
      <h2 className="title">Saved Personas</h2>
      {personas.length === 0 ? (
        <p className="no-personas">No personas found.</p>
      ) : (
        <div className="persona-cards">
          {personas.map((persona) => (
            <div key={persona.id} className="persona-card">
              <h3 className="persona-name">{persona.name}</h3>
              <button
                className="generate-button"
                onClick={() => handleSelectPersona(persona.id)}
              >
                Generate Content
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonaList;
