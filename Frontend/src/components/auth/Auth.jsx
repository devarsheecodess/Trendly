import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import LoginForm from './Login';
import SignupForm from './Signup';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-stone-900 rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-stone-800 py-6 px-8">
                    <h1 className="text-2xl font-bold text-white">Trendly</h1>
                    <p className="text-stone-400 mt-1">Track your content trends</p>
                </div>

                {/* Toggle */}
                <div className="flex border-b border-stone-700">
                    <button
                        className={`w-1/2 py-4 text-center transition-colors ${isLogin ? 'bg-stone-800 text-white font-medium' : 'bg-stone-900 text-stone-400'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`w-1/2 py-4 text-center transition-colors ${!isLogin ? 'bg-stone-800 text-white font-medium' : 'bg-stone-900 text-stone-400'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <div className="px-8 py-6">
                    {isLogin ? (
                        <LoginForm />
                    ) : (
                        <SignupForm />
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-stone-800 text-center">
                    <p className="text-stone-400 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            className="text-stone-300 hover:text-white font-medium transition-colors"
                            onClick={toggleAuthMode}
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;