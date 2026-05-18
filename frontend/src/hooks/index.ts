import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/axios";


export interface Blog {
    "content": string,
    "title": string,
    "id": string,
    "author": {
        "name": string
    }
}

export const useBlog = ({ id }: { id: string }) => {
    const {
        data: blog,
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["blog", id],
        queryFn: async () => {
            const response = await apiClient.get(`/api/v1/post/${id}`);
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
            const response = await apiClient.get(`/api/v1/post/bulk`);
            return response.data.posts as Blog[];
        },
    });

    return {
        loading,
        blogs,
        error,
    };
};

// Hook to fetch my blogs
export const useMyBlogs = () => {
    const {
        data: blogs = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["my-blogs"],
        queryFn: async () => {
            const response = await apiClient.get(`/api/v1/post/my-blogs`);
            return response.data.posts as Blog[];
        },
    });

    return {
        loading,
        blogs,
        error,
    };
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string | number) => {
            const response = await apiClient.delete(`/api/v1/post/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
        },
    });
};