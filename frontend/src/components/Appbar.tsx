import { Avatar } from "./BlogCard"
import { Link} from "react-router-dom"
export const Appbar = () => {
    return <div className="flex justify-between px-10 py-4 border-b">
        <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
            Medium
        </Link>
        <div>
        <Link
          to="/publish"
          className="mr-4 inline-flex items-center text-white bg-green-800 box-border border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
        >
          New
        </Link>
            <Avatar size={"big"} name="Krishna"/>
        </div>
    </div>
}