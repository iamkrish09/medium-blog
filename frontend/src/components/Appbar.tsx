import { Avatar } from "./BlogCard"
import { Link, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query";
import scryb_logo from "../assets/scryb_logo.png"
import { apiClient } from "../lib/axios";

export const Appbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      // Ask the server to delete the HTTP-only cookie.
      // The frontend cannot delete it directly — only the server can.
      await apiClient.post('/api/v1/user/logout');
    } catch {
      // Even if the request fails, clear the cached auth state
      // so the UI doesn't remain stuck in an "authenticated" view.
    } finally {
      // Clear the cached /me response so ProtectedRoute re-validates
      queryClient.removeQueries({ queryKey: ['auth-me'] });
      navigate('/signin');
    }
  };

  return (
    <div className="flex items-center justify-between px-6 border-b">
      <Link to="/blogs" className="flex items-center h-24">
        <img
          src={scryb_logo}
          alt="Scryb Logo"
          className="h-30 w-auto object-contain"
        />
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/my-blogs"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          My Blogs
        </Link>
        <Link
          to="/publish"
          className="inline-flex items-center rounded-full bg-green-800 px-4 py-2.5 text-sm font-medium text-white"
        >
          New
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
        <Avatar size={"big"} name="Krishna" />
      </div>
    </div>
  )
}