import { apiClient } from "../lib/axios";
import { Appbar } from "../components/Appbar"
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    return (
        <div>
            <Appbar />
            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    <input
                        type="text"
                        className="w-full border border-gray-200 rounded-2xl bg-white shadow-sm 
                        focus-within:ring-2 focus-within:ring-blue-500 transition text-grey-900 text-sm rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 
                        p-2.5 shadow-xs placeholder:text-body"
                        placeholder="Title"
                        required
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }}
                    />

                    <TextEditor
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                    />


                    <div className="flex justify-between">
                        <button
                            onClick={async () => {
                                // Auth is guaranteed by ProtectedRoute — no need to
                                // re-check localStorage here. The cookie is sent
                                // automatically by apiClient (withCredentials: true).
                                setLoading(true);
                                try {
                                    const response = await apiClient.post('/api/v1/post', {
                                        title,
                                        content: description
                                    });
                                    navigate(`/blog/${response.data.id}`);
                                } catch (error) {
                                    console.error("Error publishing post", error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            type="submit"
                            className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 text-white 
                        hover:bg-blue-700 transition focus:outline-none mt-8 disabled:bg-blue-300"
                        >
                            {loading ? 'Publishing...' : 'Publish'}
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="mt-8 px-4 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:border-slate-400"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <form>
            <div className="w-full pt-4">
                {/* Editor Card */}
                <div className="border border-gray-200 rounded-2xl bg-white shadow-sm 
            focus-within:ring-2 focus-within:ring-blue-500 transition">

                    {/* Textarea */}
                    <div className="p-4">
                        <label htmlFor="editor" className="sr-only">
                            Publish post
                        </label>

                        <textarea
                            id="editor"
                            rows={12}
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