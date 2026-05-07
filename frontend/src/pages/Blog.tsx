import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import { FullBlog } from "../components/FullBlog";
import { Appbar } from "../components/Appbar";
import { BlogCardSkeleton } from "../components/BlogCardSkeleton";

export const Blog = () => {
    const { id } = useParams();
    const {loading, blog} = useBlog({
        id: id || ""
    });
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
        if (!blog) {
        return <div>Blog not found</div>;
    }
    return (
        <div>
            <FullBlog blog={blog}/>
        </div>
    )
}