import React, { useState } from 'react';
import axios from '../axiosConfig';  // Adjust the path if necessary
import { useSearchParams } from 'react-router-dom';

interface BlogPost {
  id: number;
  persona: string;
  title: string;
  content: string;
  created_at: string;
}

const GenerateContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const personaIdParam = searchParams.get('personaId');
  const personaId = personaIdParam ? Number(personaIdParam) : null;
  const [prompt, setPrompt] = useState<string>('');
  const [content, setContent] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    if (!personaId) {
      setError('Invalid Persona ID.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('generate-content/', {
        persona_id: personaId,
        prompt: prompt,
      });
      setContent(response.data);
      setError(null);
      setPrompt('');
    } catch (err: any) {
      console.error('Error generating content:', err);
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Failed to generate content.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Generate Content</h2>
      <div>
        <label htmlFor="prompt">Prompt:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a topic or prompt..."
          rows={4}
          cols={50}
          required
        />
      </div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
      {error && <p className="error">Error: {error}</p>}
      {content && (
        <div>
          <h3>{content.title}</h3>
          <p>{content.content}</p>
        </div>
      )}
    </div>
  );
};

export default GenerateContent;
