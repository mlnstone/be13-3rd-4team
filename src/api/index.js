import axios from 'axios';

const api = axios.create({
  baseURL: 'http://183.99.3.15:8087',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export default api;
