import axios from "axios";
import { Appbar } from "../components/Appbar"
import { BACKEND_URL } from "../config";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    return (
        <div>
            <Appbar/>
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

                    <button
                        onClick={async () => {
                            const token = localStorage.getItem("token");
                            if (!token) {
                                navigate("/signin");
                                return;
                            }
                            setLoading(true);
                            try {
                                const response = await axios.post(`${BACKEND_URL}/api/v1/post`, {
                                    title,
                                    content: description
                                }, {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
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

                </div>
            
            </div>
        </div>
    );
};

function TextEditor({onChange}: {onChange : (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
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