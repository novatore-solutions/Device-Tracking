import axios from 'axios';
import { apiBaseUrl } from '@/config';

export interface QueryParams {
    page?: number;
    perPage?: number;
    filter?: string;
}

export const getUrl = (path: string) => `${apiBaseUrl}/${path}`;

export const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    // timeout: 1000,
    // headers: { 'X-Custom-Header': 'foobar' }
});
