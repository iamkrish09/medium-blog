import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Blog {
    "content": string,
    "title": string,
    "id": number,
    "author": {
        "name": string
    }
}

// Helper function for authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Authentication token not found");
    }
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const useBlog = ({ id }: { id: string }) => {
    const {
        data: blog,
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["blog", id],
        queryFn: async () => {
            const response = await axios.get(
                `${BACKEND_URL}/api/v1/post/${id}`,
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data.post as Blog;
        },
        enabled: !!id, // Only run the query if id exists
    });

    return {
        loading,
        blog,
        error,
    };
};

// Hook to fetch all blogs
export const useBlogs = () => {
    const {
        data: blogs = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["blogs"],
        queryFn: async () => {
            const response = await axios.get(
                `${BACKEND_URL}/api/v1/post/bulk`,
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data.posts as Blog[];
        },
    });

    return {
        loading,
        blogs,
        error,
    };
};