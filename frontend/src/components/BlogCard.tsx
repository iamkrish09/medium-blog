import { Link } from "react-router-dom";

interface BlogCardProps {
    authorName: string;
    title:string;
    content:string;
    publishedDate:string;
    id:string;
    showActions?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const BlogCard = ({
    authorName,
    title,
    content,
    publishedDate,
    id,
    showActions,
    onEdit,
    onDelete
}:BlogCardProps) => {
    return <Link to={`/blog/${id}`}>
      <div className="p-4 border-b border-slate-200 pb-4 max-w-screen-lg cursor-pointer">
        <div className="flex">
            <div className="flex justify-center flex-col">
                <Avatar name={authorName}/> 
            </div>
            <div className="flex justify-center flex-col font-extralight pl-2 text-sm">
                {authorName}
            </div>
            <div className="flex justify-center flex-col pl-2">
                <Circle/>
            </div>
            <div className="flex justify-center flex-col pl-2 font-thin text-slate-500 text-sm">
                {publishedDate}
            </div>
        </div>
        <div className="text-xl font-semibold pt-2">
            {title}
        </div>
        <div className="text-md font-thin">
            {content.slice(0, 100) + "..."}
        </div>
        <div className="font-thin text-slate-500 text-sm pt-2">
            {`${Math.ceil(content.length /100)} minutes(s) read`}
        </div>
        {showActions && (
            <div className="flex gap-4 pt-4 mt-4 border-t border-slate-100">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onEdit) onEdit(id);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Edit
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onDelete) onDelete(id);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                    Delete
                </button>
            </div>
        )}
    </div>
    </Link>
}

export function Avatar ({name, size = "small" }: {name:string, size?: "small" | "big" }) {
    return <div className={`relative inline-flex items-center justify-center ${size === "small" ? "w-6 h-6" : "w-10 h-10"}  overflow-hidden bg-gray-600 rounded-full dark:bg-gray-600`}>
    <span className="text-xs font-extralight text-white">{name[0]}</span>
    </div>  
}

function Circle (){
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}