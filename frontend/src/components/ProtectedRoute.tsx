import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

interface MeResponse {
  authenticated: boolean;
  user?: { id: string; email: string; name: string };
}

/**
 * Validates the session by calling GET /api/v1/user/me.
 * The server reads the HTTP-only cookie and confirms whether the user is
 * authenticated — no localStorage involved.
 *
 * Renders a loading state while the check is in flight to prevent a flash
 * redirect to /signin on page load.
 */
export const ProtectedRoute = () => {
  const { data, isLoading } = useQuery<MeResponse>({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/user/me');
      return response.data as MeResponse;
    },
    retry: false,               // Don't retry on 401 — treat it as unauthenticated immediately
    staleTime: 1000 * 60 * 5,  // Cache for 5 min to avoid re-checking on every navigation
  });

  if (isLoading) {
    // Prevent a premature redirect while the /me request is in-flight
    return null;
  }

  if (!data?.authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};
