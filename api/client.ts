import axios from 'axios';

export const RESTAURANT_URL = '/restaurant-service';
export const USER_SERVICE = '/user-service';
export const AUTH_SERVICE = '/auth-service';

const client = axios.create();

client.defaults.baseURL='http://localhost:8000';
export default client;
