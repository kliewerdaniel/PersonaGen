import React, { useState } from 'react';
import axios from '../axiosConfig'; // Adjust the path if necessary
import { useSearchParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, CircularProgress, Card, CardContent } from '@mui/material';

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
    <Box p={4} maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Generate Content
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Prompt"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a topic or prompt..."
        required
        sx={{ mb: 3 }}
      />
      <Button
        onClick={handleGenerate}
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Content'}
      </Button>
      {content && (
        <Card variant="outlined" sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {content.title || 'Untitled'}
            </Typography>
            <Typography variant="body1">
              {content.content}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default GenerateContent;
