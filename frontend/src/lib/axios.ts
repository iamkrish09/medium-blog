import axios from 'axios';
import { BACKEND_URL } from '../config';

/**
 * Shared axios instance for all API calls.
 *
 * - baseURL: pre-configured so callers only need relative paths (e.g. '/api/v1/...')
 * - withCredentials: true — required for the browser to send the HTTP-only auth
 *   cookie on every cross-origin request to the Cloudflare Worker backend.
 */
export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});
