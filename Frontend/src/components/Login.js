import React, { useState, useEffect } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLogin, hideNavbar = true }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user"
    });

    const [showPassword, setShowPassword] = useState(false);

    // Effect to handle navbar visibility
    useEffect(() => {
        // Check if there's a method to hide navbar in the parent component
        if (hideNavbar && window.hideNavbar) {
            window.hideNavbar();
        }

        // Optional: Cleanup function to show navbar when component unmounts
        return () => {
            if (window.showNavbar) {
                window.showNavbar();
            }
        };
    }, [hideNavbar]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleRoleSelection = (role) => {
        if(role === "admin") {
            navigate("/adminlogin");
        } else {
            setFormData(prev => ({
                ...prev,
                role: "user"
            }));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Login failed');
                return;
            }

            localStorage.setItem('token', data.jwtToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            setLogin(true);
            toast.success('Welcome to CityAssist! Login Successful');
            
            // Show navbar after successful login
            if (window.showNavbar) {
                window.showNavbar();
            }
            
            setTimeout(() => navigate('/'), 1000);
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Something went wrong! Try again.');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-[#333333]">
                        Welcome to CityAssist
                    </h2>
                    <p className="mt-2 text-sm text-[#666666]">
                        Login to access your account
                    </p>
                </div>

                <form 
                    onSubmit={handleSubmit} 
                    className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg border border-[#E5E5E5]"
                >
                    {/* Role Selection */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            type="button"
                            onClick={() => handleRoleSelection("user")}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                formData.role === "user" 
                                    ? "bg-blue-500 text-white shadow-md" 
                                    : "bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5]"
                            }`}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleSelection("admin")}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                formData.role === "admin" 
                                    ? "bg-[#2F80ED] text-white shadow-md" 
                                    : "bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5]"
                            }`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent transition-all duration-300"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent transition-all duration-300 pr-10"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-[#666666] hover:text-[#333333] transition-colors"
                            >
                                {showPassword ? (
                                    <IoIosEyeOff className="h-5 w-5" />
                                ) : (
                                    <IoIosEye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#1A67C9] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:ring-opacity-75 transition-all duration-300 shadow-md"
                    >
                        Sign In
                    </button>

                    {/* Forgot Password */}
                    <div className="text-center">
                        <a 
                            href="#" 
                            className="text-sm text-[#2F80ED] hover:text-[#1A67C9] transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;