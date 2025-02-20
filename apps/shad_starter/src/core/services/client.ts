import axios from 'axios';
import { type AxiosCacheInstance, setupCache } from 'axios-cache-interceptor';

export const client = axios.create({
	baseURL: `https://api.example.com`,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	},
	withCredentials: true
});

export const axiosClient: AxiosCacheInstance = setupCache(client, {
	methods: [],
	cachePredicate: {
		statusCheck: (status) => status === 200
	}
});
