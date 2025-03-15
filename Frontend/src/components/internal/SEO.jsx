import React, { useState } from 'react';
import { Search, ArrowRight, RefreshCw, Check, X, ThumbsUp, AlertCircle } from 'lucide-react';

const SEO = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [briefValue, setBriefValue] = useState('');
    const [titleValue, setTitleValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsAnalyzing(true);

        // Simulate API call
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
        }, 3000);
    };

    const resetForm = () => {
        setBriefValue('');
        setTitleValue('');
        setShowResults(false);
    };

    return (
        <div className="md:ml-64 p-4 md:p-6 bg-stone-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-stone-800 mb-2">SEO Analysis</h1>
                <p className="text-stone-600 mb-8">Optimize your video title, description, and content for better visibility and engagement</p>

                {!showResults ? (
                    <div className="bg-stone-100 rounded-xl shadow-lg p-6 mb-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="content-brief" className="block text-sm font-medium text-stone-700 mb-2">
                                    Content Brief
                                </label>
                                <textarea
                                    id="content-brief"
                                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 bg-stone-50 transition"
                                    rows="4"
                                    placeholder="Describe your video content in detail to get better SEO recommendations..."
                                    value={briefValue}
                                    onChange={(e) => setBriefValue(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="video-title" className="block text-sm font-medium text-stone-700 mb-2">
                                    Proposed Video Title
                                </label>
                                <input
                                    type="text"
                                    id="video-title"
                                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 bg-stone-50 transition"
                                    placeholder="Enter your proposed title..."
                                    value={titleValue}
                                    onChange={(e) => setTitleValue(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center bg-stone-800 hover:bg-stone-900 text-white py-3 px-6 rounded-lg font-medium transition"
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="loader-container">
                                            <div className="loader">
                                                <svg className="circular" viewBox="25 25 50 50">
                                                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="ml-2">Analyzing Content...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search size={18} className="mr-2" />
                                        Analyze SEO
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Results Section */}
                        <div className="bg-stone-100 rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-stone-800 px-6 py-4">
                                <h2 className="text-xl font-semibold text-stone-50">SEO Analysis Results</h2>
                            </div>

                            <div className="p-6">
                                {/* Title Score */}
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-medium text-stone-800">Title Score</h3>
                                        <div className="bg-stone-200 text-stone-800 font-medium px-3 py-1 rounded-full text-sm">
                                            85/100
                                        </div>
                                    </div>

                                    <div className="w-full bg-stone-200 rounded-full h-2.5">
                                        <div className="bg-stone-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                    </div>

                                    <div className="mt-4 p-4 bg-stone-200 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Original Title</h4>
                                        <p className="text-stone-700">{titleValue}</p>

                                        <div className="my-3 border-t border-stone-300"></div>

                                        <h4 className="font-medium text-stone-800 mb-2">Optimized Title Suggestion</h4>
                                        <p className="text-stone-700">How to Boost Your Website Traffic with SEO Tactics in 2025 | Step-by-Step Guide</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Generated Description</h3>
                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <p className="text-stone-700 mb-3">
                                            Looking to increase your website's visibility? This comprehensive tutorial walks you through proven SEO strategies that actually work in 2025. We'll cover keyword research, on-page optimization techniques, backlink building strategies, and user experience improvements that will boost your organic traffic. Perfect for beginners and intermediate marketers who want actionable tips they can implement right away.
                                        </p>
                                        <p className="text-stone-700">
                                            #SEOTips #WebsiteTraffic #DigitalMarketing #ContentStrategy #2025SEO
                                        </p>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Recommended Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['SEO', 'Website Traffic', 'Digital Marketing', 'Content Strategy', 'SEO Tutorial', 'Traffic Generation', 'Organic Traffic', 'SEO Tips', 'Keyword Research', 'Website Optimization'].map((tag) => (
                                            <span key={tag} className="bg-stone-200 text-stone-800 px-3 py-1 rounded-full text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Improvement Suggestions */}
                                <div>
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Content Improvement Suggestions</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <Check size={18} className="text-stone-700 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-stone-700">Include step-by-step demonstrations of at least 3 SEO techniques</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check size={18} className="text-stone-700 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-stone-700">Show real examples of before/after results with these methods</span>
                                        </li>
                                        <li className="flex items-start">
                                            <AlertCircle size={18} className="text-stone-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-stone-700">Consider adding a section about mobile optimization (high search volume)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <X size={18} className="text-stone-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-stone-700">Avoid focusing only on theory; viewers want actionable advice</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Keywords Section */}
                        <div className="bg-stone-100 rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-stone-700 px-6 py-4">
                                <h2 className="text-xl font-semibold text-stone-50">Keyword Analysis</h2>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Primary Keywords</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { keyword: 'SEO techniques 2025', volume: 'High', difficulty: 'Medium' },
                                            { keyword: 'increase website traffic', volume: 'Very High', difficulty: 'High' },
                                            { keyword: 'SEO tutorial beginners', volume: 'Medium', difficulty: 'Low' },
                                            { keyword: 'organic traffic strategies', volume: 'Medium', difficulty: 'Medium' }
                                        ].map((item, index) => (
                                            <div key={index} className="flex justify-between bg-stone-50 p-3 rounded-lg border border-stone-300">
                                                <span className="font-medium text-stone-800">{item.keyword}</span>
                                                <div className="flex space-x-2">
                                                    <span className="text-sm text-stone-800 bg-stone-200 px-2 py-0.5 rounded">Vol: {item.volume}</span>
                                                    <span className="text-sm text-stone-800 bg-stone-200 px-2 py-0.5 rounded">Diff: {item.difficulty}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Long-tail Opportunities</h3>
                                    <ul className="space-y-2">
                                        {[
                                            'how to improve website SEO in one month',
                                            'best SEO tools for small business 2025',
                                            'SEO step by step guide for beginners free',
                                            'how to rank higher on Google search results'
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-center">
                                                <ArrowRight size={16} className="text-stone-600 mr-2" />
                                                <span className="text-stone-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Competitive Analysis */}
                        <div className="bg-stone-100 rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-stone-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-stone-50">Competitive Analysis</h2>
                            </div>

                            <div className="p-6">
                                <p className="text-stone-700 mb-4">Based on top performing videos in this niche, here's what's working:</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Optimal Video Length</h4>
                                        <p className="text-stone-700">12-18 minutes (detailed but concise)</p>
                                    </div>

                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Best Publishing Time</h4>
                                        <p className="text-stone-700">Tuesday/Wednesday, 10AM-2PM EST</p>
                                    </div>

                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Thumbnail Style</h4>
                                        <p className="text-stone-700">Before/After results with data visualization</p>
                                    </div>

                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Engagement Hooks</h4>
                                        <p className="text-stone-700">Specific numbers/percentages in title & intro</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={resetForm}
                                className="flex-1 flex items-center justify-center bg-stone-200 border border-stone-300 hover:bg-stone-300 text-stone-800 py-3 px-6 rounded-lg font-medium transition"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Start New Analysis
                            </button>

                            <button className="flex-1 flex items-center justify-center bg-stone-800 hover:bg-stone-900 text-white py-3 px-6 rounded-lg font-medium transition">
                                <ThumbsUp size={18} className="mr-2" />
                                Save Results
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SEO;