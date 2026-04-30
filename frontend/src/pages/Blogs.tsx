import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/Appbar"
import { useBlogs } from "../hooks";
import { BlogCardSkeleton } from "../components/BlogCardSkeleton";
export const Blogs = () => {

    const {loading, blogs} = useBlogs();

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

    return (
    <div>
        <Appbar/>
        <div className="p-4 flex justify-center">
            <div>
                {blogs.map(blog=>
                    <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"10 April"}
                />)}
            </div>
        </div>
    </div>
    )
}