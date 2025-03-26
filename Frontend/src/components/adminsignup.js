import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

const AdminSignup = ({setlogin}) => {
    const navigate = useNavigate();
    const [FormData, setformdata] = useState({
        firstname: "",
        department: "",
        email: "",
        contact: "",
        address: "",
        city: "",
        password: "",
        confirmpassword: "",
        role: "admin"
    });
  
    function selectRole(role) {
        if(role === "user") {
            navigate("/signup");
        } else {
            setformdata((prev) => ({
                ...prev,
                role: "admin"
            }));
        }
    }

    const [showpassword, setshowpassword] = useState(false);
    const [showconfirmpassword, setshowconfirmpassword] = useState(false);

    function changehandler(event){
        setformdata((prev)=>({
            ...prev,
            [event.target.name]:event.target.value
        }));
    }

    async function submithandler(event){
        event.preventDefault();
        
        if(FormData.password !== FormData.confirmpassword){
            toast.error("Passwords do not match");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/admin/adminsignup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(FormData),
            });
    
            const data = await response.json();
            console.log("Server Response for signup:", data);
            if (!response.ok) {
                toast.error(data.message || "Signup failed");
                return;
            }
          
            localStorage.setItem("token", data.token);
            console.log("Stored Token in Local Storage:", localStorage.getItem("token"));
            console.log("Received signup from main Token:", data.token);
          
            setlogin(true);
            toast.success("Account created successfully");
            navigate("/adminhome");
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("Something went wrong! Try again.");
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-[#333333] mb-4">
                        Welcome to the Admin Signup Page
                    </h1>
                    <p className="text-[#666666] max-w-xl mx-auto">
                        CityAssist empowers cities with smart governance, making urban services more efficient, transparent, and citizen-centric—because a well-connected city is a thriving city.
                    </p>
                </div>

                <form 
                    onSubmit={submithandler} 
                    className="bg-white p-8 rounded-xl shadow-lg border border-[#E5E5E5] space-y-6"
                >
                    {/* Role Selection */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            type="button"
                            onClick={() => selectRole("user")}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                FormData.role === "user" 
                                    ? "bg-[#FFB800] text-white shadow-md" 
                                    : "bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5]"
                            }`}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            onClick={() => selectRole("admin")}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                FormData.role === "admin" 
                                    ? "bg-[#2F80ED] text-white shadow-md" 
                                    : "bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5]"
                            }`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Name and Department */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="firstname" className="block text-sm font-medium text-[#333333] mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="firstname"
                                type="text"
                                name="firstname"
                                required
                                placeholder="Full Name"
                                value={FormData.firstname}
                                onChange={changehandler}
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="department" className="block text-sm font-medium text-[#333333] mb-2">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="department"
                                type="text"
                                name="department"
                                required
                                placeholder="Department Name"
                                value={FormData.department}
                                onChange={changehandler}
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                    </div>

                    {/* Email and Contact */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                placeholder="Department Email"
                                value={FormData.email}
                                onChange={changehandler}
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="contact" className="block text-sm font-medium text-[#333333] mb-2">
                                Phone No.
                            </label>
                            <input
                                id="contact"
                                type="tel"
                                name="contact"
                                placeholder="Phone No."
                                value={FormData.contact}
                                onChange={changehandler}
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                    </div>

                    {/* Address and City */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="address" className="block text-sm font-medium text-[#333333] mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                required
                                placeholder="Address"
                                value={FormData.address}
                                onChange={changehandler}
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="city" className="block text-sm font-medium text-[#333333] mb-2">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="city"
                                type="text"
                                name="city"
                                required
                                placeholder="City"
                                value={FormData.city}
                                onChange={changehandler}
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                    </div>

                    {/* Password and Confirm Password */}
                    <div className="flex space-x-4">
                        <div className="w-1/2 relative">
                            <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="password"
                                type={showpassword ? "text" : "password"}
                                name="password"
                                required
                                placeholder="Password"
                                value={FormData.password}
                                onChange={changehandler}
                                autoComplete="new-password"
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setshowpassword(!showpassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-[#666666] hover:text-[#333333]"
                            >
                                {showpassword ? (
                                    <IoIosEyeOff className="h-5 w-5" />
                                ) : (
                                    <IoIosEye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <div className="w-1/2 relative">
                            <label htmlFor="confirmpassword" className="block text-sm font-medium text-[#333333] mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="confirmpassword"
                                type={showconfirmpassword ? "text" : "password"}
                                name="confirmpassword"
                                required
                                placeholder="Confirm Password"
                                value={FormData.confirmpassword}
                                onChange={changehandler}
                                autoComplete="new-password"
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setshowconfirmpassword(!showconfirmpassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-[#666666] hover:text-[#333333]"
                            >
                                {showconfirmpassword ? (
                                    <IoIosEyeOff className="h-5 w-5" />
                                ) : (
                                    <IoIosEye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#1A67C9] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:ring-opacity-75 transition-all duration-300 shadow-md"
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-[#666666]">
                            Already have an account?{' '}
                            <Link to="/Login" className="text-[#2F80ED] hover:text-[#1A67C9] transition-colors">
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminSignup