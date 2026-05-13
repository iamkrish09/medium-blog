import { useState, useEffect, type ChangeEvent } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar"
import { BACKEND_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../hooks";
import { useQueryClient } from "@tanstack/react-query";

export const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { blog, loading: blogLoading } = useBlog({ id: id || "" });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (blog) {
            setTitle(blog.title);
            setDescription(blog.content);
        }
    }, [blog]);

    if (blogLoading) {
        return <div>
            <Appbar />
            <div className="flex justify-center w-full pt-8">
                <div>Loading...</div>
            </div>
        </div>
    }

    return (
        <div>
            <Appbar />
            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    <input
                        type="text"
                        value={title}
                        className="w-full border border-gray-200 rounded-2xl bg-white shadow-sm 
                        focus-within:ring-2 focus-within:ring-blue-500 transition text-gray-900 text-sm 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 
                        p-2.5 shadow-xs placeholder:text-gray-400"
                        placeholder="Title"
                        required
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }}
                    />

                    <TextEditor
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                    />

                    <div className="flex justify-between">
                        <button
                            onClick={async () => {
                                const token = localStorage.getItem("token");
                                if (!token) {
                                    navigate("/signin");
                                    return;
                                }
                                setLoading(true);
                                try {
                                    await axios.put(`${BACKEND_URL}/api/v1/post`, {
                                        id,
                                        title,
                                        content: description
                                    }, {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    });
                                    // Invalidate caches
                                    queryClient.invalidateQueries({ queryKey: ["blogs"] });
                                    queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
                                    queryClient.invalidateQueries({ queryKey: ["blog", id] });
                                    navigate(`/blog/${id}`);
                                } catch (error) {
                                    console.error("Error updating post", error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading || !title || !description}
                            type="submit"
                            className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 text-white 
                        hover:bg-blue-700 transition focus:outline-none mt-8 disabled:bg-blue-300"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="mt-8 px-4 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:border-slate-400"
                        >
                            ← Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function TextEditor({ value, onChange }: { value: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <form>
            <div className="w-full pt-4">
                <div className="border border-gray-200 rounded-2xl bg-white shadow-sm 
            focus-within:ring-2 focus-within:ring-blue-500 transition">
                    <div className="p-4">
                        <label htmlFor="editor" className="sr-only">
                            Publish post
                        </label>
                        <textarea
                            id="editor"
                            rows={12}
                            value={value}
                            onChange={onChange}
                            className="w-full resize-none text-gray-800 text-base leading-relaxed 
                    bg-transparent border-none focus:outline-none focus:ring-0 
                    placeholder-gray-400"
                            placeholder="Start writing your blog here..."
                            required
                        ></textarea>
                    </div>
                </div>
            </div>
        </form>
    );
}
