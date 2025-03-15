import React, { useState, useEffect } from 'react';

const ErrorPage = () => {
    const [seconds, setSeconds] = useState(10);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (seconds === 0) {
            window.location.href = '/';
        }
    }, [seconds]);

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-stone-800 h-2" />

                <div className="p-8">
                    <div className="flex items-center mb-6">
                        <div className="bg-stone-500 h-12 w-12 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-stone-900 text-2xl font-bold ml-4">Error 404</h1>
                    </div>

                    <p className="text-stone-700 text-lg mb-6">The page you're looking for cannot be found.</p>

                    <div className="space-y-4">
                        <div className="h-2 bg-stone-200 rounded-full w-full overflow-hidden">
                            <div
                                className="bg-stone-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(seconds / 10) * 100}%` }}
                            />
                        </div>

                        <p className="text-stone-500 text-sm">
                            Redirecting to homepage in {seconds} seconds
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                                className="bg-stone-800 hover:bg-stone-900 text-white py-2 px-4 rounded-md transition-colors"
                                onClick={() => window.location.href = '/'}
                            >
                                Go to Homepage
                            </button>
                            <button
                                className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 py-2 px-4 rounded-md transition-colors"
                                onClick={() => window.history.back()}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-stone-100 px-8 py-4 border-t border-stone-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-2 sm:space-y-0">
                        <div className="text-stone-500 text-sm">
                            Need help? Contact <a href="#" className="text-stone-700 hover:text-stone-900 underline">support</a>
                        </div>
                        <div className="flex space-x-2">
                            {[300, 500, 700, 900].map((shade) => (
                                <div
                                    key={shade}
                                    className={`h-3 w-3 rounded-full bg-stone-${shade}`}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;