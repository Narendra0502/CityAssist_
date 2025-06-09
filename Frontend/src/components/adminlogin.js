import React, { useState, useEffect } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setLogin }) => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "admin"
    });

    const [verificationCode, setVerificationCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Generate a random 4-digit verification code on component mount
    useEffect(() => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(code);
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVerificationChange = (event) => {
        setVerificationCode(event.target.value);
    };

    const handleRoleSelection = (role) => {
        if (role === "user") {
            navigate("/login");
        } else {
            setFormData(prev => ({
                ...prev,
                role: "admin"
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if verification code matches
        if (verificationCode !== generatedCode) {
            toast.error("Invalid verification code");
            return;
        }

        try {
            const response = await fetch('https://cityassist-backend.onrender.com/admin/adminlogin', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("Response:", response);
            console.log("Data:", data);

            if (!response.ok) {
                toast.error(data.message || 'Login failed');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setLogin(true);
            toast.success('Welcome to CityAssist! Login Successful');
            navigate('/adminhome');
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Something went wrong! Try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-[#333333]">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-sm text-[#666666]">
                        Access your administrative dashboard
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
                                    ? "bg-[#FFB800] text-white shadow-md" 
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

                    {/* Verification Code Display */}
                    <p className="text-center font-bold text-lg">Verification Code: {generatedCode}</p>
                    <input
                        type="text"
                        placeholder="Enter 4-digit code"
                        value={verificationCode}
                        onChange={handleVerificationChange}
                        required
                        className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent transition-all duration-300"
                    />

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

                    {/* Signup Link for New Users */}
                    <p className="text-center mt-4 text-sm text-[#666666]">
                        New user?{" "}
                        <span 
                            className="text-[#2F80ED] font-medium cursor-pointer hover:underline"
                            onClick={() => navigate('/adminsignup')}
                        >
                            Sign up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
