import { Avatar } from "./BlogCard"
import { Link } from "react-router-dom"
import scryb_logo from "../assets/scryb_logo.png"

export const Appbar = () => {
  return (
    <div className="flex items-center justify-between px-6 border-b">
      <Link to="/blogs" className="flex items-center h-24">
        <img
          src={scryb_logo}
          alt="Scryb Logo"
          className="h-30 w-auto object-contain"
        />
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/publish"
          className="inline-flex items-center rounded-full bg-green-800 px-4 py-2.5 text-sm font-medium text-white"
        >
          New
        </Link>
        <Avatar size={"big"} name="Krishna" />
      </div>
    </div>
  )
}