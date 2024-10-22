import React, { useState } from 'react';
import axios from '../axiosConfig';  // Adjust the path if necessary

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
    <div>
      <h2>Upload Writing Sample</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Persona Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="writingSample">Writing Sample:</label>
          <textarea
            id="writingSample"
            value={writingSample}
            onChange={(e) => setWritingSample(e.target.value)}
            required
            rows={10}
            cols={50}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadSample;
