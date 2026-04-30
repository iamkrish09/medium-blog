import { Avatar } from "./BlogCard"
import { Link } from "react-router-dom"
export const Appbar = () => {
    return <div className="flex justify-between px-10 py-4 border-b">
        <Link to={'/'} className="flex flex-col justify-center cursor-pointer">
            Medium
        </Link>
        <div>
            <Avatar size={"big"} name="Krishna"/>
        </div>
    </div>
}