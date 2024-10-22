import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/',  // Adjust the baseURL if needed
});

export default instance;
