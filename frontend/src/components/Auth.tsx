import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import type{ SignupInput } from "@krishna1505/medium-common";
import { apiClient } from "../lib/axios";

export const Auth = ({type}: {type: "signup" | "signin"}) => {

    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    });

    async function sendRequest(){
        try {
            // Server sets the HTTP-only cookie automatically on success.
            // No JWT is returned in the response body — nothing to store.
            await apiClient.post(
                `/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            );
            navigate("/blogs")
        } catch (error) {
            //alert the user here that the request failed
            alert("Error while Signing up");
        }
    }
    return(
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            {type === "signup" ? "Create an Account" : "Login to your Account"}
                        </div>
                        <div className="text-slate-400">
                            {type === "signup" ? "Already have an Account?" : "Don't have an Account"}
                            <Link className="pl-2 underline" to={type === "signup" ? "/signin":"/signup"}>{type === "signup"?"SignIn":"SignUp"}</Link> 
                        </div>
                    </div>

                    <div className="pt-8">
                        {type === "signup" ? <LabelledInput label="Name" placeholder="Krishna..." onChange={(e) => {
                            // Using this method we are overriding the the exisiting values with the new values and retains you with exisitng names and passwords
                            setPostInputs({
                                ...postInputs,
                                name: e.target.value
                            }) 
                        }}/> : null}

                        <LabelledInput label="Username" placeholder="example@gmail.com" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                email: e.target.value
                            }) 
                        }}/>

                        <LabelledInput label="Password" type={"password"} placeholder="your_password" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value
                            }) 
                        }}/>

                        <button
                            type="button"
                            onClick={sendRequest}
                            className="mt-8 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {type === "signup" ? "Sign up" :"Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface LabelledInputType {
    label:string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInput({ label, placeholder, onChange, type}: LabelledInputType) {
    return <div>
        <div>
            <label className="block mb-2.5 text-sm font-bold text-black pt-2">{label}</label>
            <input onChange={onChange} type={type ||"text"} id="first_name" className="bg-gray-50 border border-grey-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-border-blue-500 block w-full px-3 py-2.5" placeholder={placeholder}required />
        </div>
    </div>
}