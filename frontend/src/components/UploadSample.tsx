import React, { useState } from 'react';
import axios from '../axiosConfig'; // Adjust the path if necessary
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material';

const UploadSample: React.FC = () => {
  const [name, setName] = useState('');
  const [writingSample, setWritingSample] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      writing_sample: writingSample.trim(),
    };

    try {
      console.log('Payload being sent:', payload);
      const response = await axios.post('analyze/', payload);
      console.log('Response received:', response.data);
      setSuccess(`Persona "${response.data.name}" created successfully!`);
      setError(null);
      setName('');
      setWritingSample('');
    } catch (error: any) {
      console.error('Error uploading writing sample:', error);
      console.log('Error response:', error.response);
      if (error.response && error.response.data) {
        setError(JSON.stringify(error.response.data));
      } else {
        setError('An error occurred while uploading the writing sample.');
      }
      setSuccess(null);
    }
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Upload Writing Sample
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Persona Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            label="Writing Sample"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            value={writingSample}
            onChange={(e) => setWritingSample(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" size="large">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default UploadSample;
