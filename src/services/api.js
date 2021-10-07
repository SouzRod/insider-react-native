import axios from 'axios';


export const key = '57b476ff2a18ef63d9be0d7d24e7d9f9';

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3'
});

export default api;