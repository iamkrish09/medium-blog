import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/Appbar"
import { useMyBlogs, useDeleteBlog } from "../hooks";
import { BlogCardSkeleton } from "../components/BlogCardSkeleton";
import { useNavigate } from "react-router-dom";

export const MyBlogs = () => {
    const { loading, blogs } = useMyBlogs();
    const deleteBlogMutation = useDeleteBlog();
    const navigate = useNavigate();

    const handleEdit = (id: number) => {
        // Since there is no edit page yet, we can navigate to an edit route or publish route with state
        // For now, let's navigate to a placeholder or publish page
        navigate(`/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            deleteBlogMutation.mutate(id);
        }
    };

    if (loading) {
        return <div>
            <Appbar />
            <div className="p-4 flex justify-center">
                <div className="w-full max-w-screen-lg">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <BlogCardSkeleton key={item} />
                    ))}
                </div>
            </div>
        </div>
    }

    if (blogs.length === 0) {
        return <div>
            <Appbar />
            <div className="p-4 flex justify-center">
                <div className="w-full max-w-screen-lg mt-10 text-center text-slate-500">
                    You haven't written any blogs yet.
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <Appbar />
            <div className="p-4 flex justify-center">
                <div>
                    {blogs.map(blog =>
                        <BlogCard
                            key={blog.id}
                            id={blog.id}
                            authorName={blog.author.name || "Anonymous"}
                            title={blog.title}
                            content={blog.content}
                            publishedDate={"10 April"}
                            showActions={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />)}
                </div>
            </div>
        </div>
    )
}
