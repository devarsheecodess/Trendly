import React, { useState, useEffect } from 'react';

const DetailPopup = ({ isOpen, onClose, itemType, itemData }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            setTimeout(() => setMounted(false), 300);
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!mounted) return null;

    const renderScriptDetails = () => (
        <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h3 className="text-xl font-semibold text-stone-800">{itemData.title}</h3>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-stone-600">{itemData.date}</p>
                    <p className="text-sm text-stone-600">{itemData.wordCount} words</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-stone-800">Content</h4>
                <div className="bg-stone-50 p-4 rounded-lg">
                    <p className="text-stone-800">{itemData.content || "Content preview not available"}</p>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-medium text-stone-800">Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-50 p-4 rounded-lg">
                        <p className="text-sm text-stone-600">Status</p>
                        <p className="text-stone-800">{itemData.status}</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-lg">
                        <p className="text-sm text-stone-600">Created</p>
                        <p className="text-stone-800">{itemData.date}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSEODetails = () => (
        <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
                <h3 className="text-xl font-semibold text-stone-800">{itemData.title}</h3>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-stone-600">{itemData.date}</p>
                    <p className="text-sm text-stone-600">{itemData.keywords} keywords</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-stone-800">Score</h4>
                <div className="bg-stone-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <p className="text-stone-800">{itemData.score}%</p>
                        <div className="w-full max-w-md bg-stone-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${itemData.score}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-medium text-stone-800">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                    {itemData.keywordList ? itemData.keywordList.map((keyword, index) => (
                        <span key={index} className="bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                        </span>
                    )) : (
                        <p className="text-stone-600">No keywords available</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
            <div className="absolute inset-0 bg-black/95 bg-opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10 transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center p-6 border-b border-stone-200">
                    <h2 className="text-xl font-bold text-stone-800">{itemType === 'script' ? 'Script Details' : 'SEO Analysis Details'}</h2>
                    <button
                        onClick={onClose}
                        className="text-stone-500 hover:text-stone-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                    {itemType === 'script' ? renderScriptDetails() : renderSEODetails()}
                </div>
                <div className="p-6 border-t border-stone-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailPopup;