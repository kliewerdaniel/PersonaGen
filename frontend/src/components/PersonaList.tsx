import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';  // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Saved Personas</h2>
      {personas.length === 0 ? (
        <p>No personas found.</p>
      ) : (
        <ul>
          {personas.map((persona) => (
            <li key={persona.id}>
              {persona.name}
              <button onClick={() => handleSelectPersona(persona.id)}>
                Generate Content
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PersonaList;
