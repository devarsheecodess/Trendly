import React, { useState } from 'react';

const History = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    return (
        <div className="md:ml-64 p-4 md:p-6 bg-stone-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-stone-800 mb-2">History</h1>
            </div>
        </div>
    );
}

export default History;