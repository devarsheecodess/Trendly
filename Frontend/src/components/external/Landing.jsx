import React from 'react';
import { Mic, FileText, BarChart2, Image, MessageSquare, Upload, LineChart } from 'lucide-react';

const Landing = () => {
    return (
        <div className="bg-stone-50 text-stone-800">
            {/* Hero Section */}
            <section className="bg-stone-800 text-white py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                                Create Better <span className="text-stone-300">YouTube</span> Content with AI
                            </h1>
                            <p className="text-stone-300 text-lg mb-8">
                                Trendly helps content creators streamline their workflow from script writing to analytics tracking.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button onClick={() => window.location.href = '/auth'} className="bg-stone-600 hover:bg-stone-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    Get Started
                                </button>
                                <button className="bg-transparent border border-stone-500 text-stone-200 font-medium py-3 px-8 rounded-lg hover:bg-stone-700 transition-all duration-300">
                                    See Demo
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <div className="bg-stone-700 p-4 rounded-xl shadow-2xl">
                                <div className="bg-stone-900 rounded-lg p-6 relative">
                                    <div className="flex space-x-2 absolute top-3 left-3">
                                        <div className="w-3 h-3 bg-stone-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-stone-300 rounded-full"></div>
                                    </div>
                                    <div className="mt-4 pt-2">
                                        <div className="bg-stone-800 p-4 rounded-md mb-3">
                                            <p className="text-stone-300 text-sm mb-2">Generate script for:</p>
                                            <p className="text-white">10 minute tech review video</p>
                                        </div>
                                        <div className="bg-stone-700 p-4 rounded-md">
                                            <p className="text-stone-300 text-sm mb-1">AI Generated Script:</p>
                                            <p className="text-stone-100">
                                                <span className="text-stone-400">Intro (0:00-0:30):</span> Hey everyone, welcome back to the channel! Today we're diving into this brand new tech...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need to Create Engaging Content</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            Streamline your entire YouTube content creation process with our powerful AI-driven tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200">
                            <div className="bg-stone-100 p-3 rounded-lg inline-block mb-4">
                                <FileText className="h-6 w-6 text-stone-700" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Script Writing</h3>
                            <p className="text-stone-600">
                                Generate engaging scripts tailored to your niche and audience. Our AI adapts to your style and tone.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200">
                            <div className="bg-stone-100 p-3 rounded-lg inline-block mb-4">
                                <MessageSquare className="h-6 w-6 text-stone-700" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Content Strategy</h3>
                            <p className="text-stone-600">
                                Get data-driven content ideas that are trending in your niche to maximize your channel's growth.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200">
                            <div className="bg-stone-100 p-3 rounded-lg inline-block mb-4">
                                <Mic className="h-6 w-6 text-stone-700" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Voice Over</h3>
                            <p className="text-stone-600">
                                Convert your scripts into natural-sounding voiceovers with customizable voices and inflections.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200">
                            <div className="bg-stone-100 p-3 rounded-lg inline-block mb-4">
                                <Image className="h-6 w-6 text-stone-700" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Thumbnail Generator</h3>
                            <p className="text-stone-600">
                                Create eye-catching thumbnails that drive clicks and views with our AI-powered image generator.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200">
                            <div className="bg-stone-100 p-3 rounded-lg inline-block mb-4">
                                <BarChart2 className="h-6 w-6 text-stone-700" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">SEO Analyzer</h3>
                            <p className="text-stone-600">
                                Optimize your video titles, descriptions, and tags for maximum discoverability on YouTube.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200">
                            <div className="bg-stone-100 p-3 rounded-lg inline-block mb-4">
                                <Upload className="h-6 w-6 text-stone-700" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Automated Posting</h3>
                            <p className="text-stone-600">
                                Schedule and automatically post your videos at optimal times to maximize engagement.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <div className="bg-white p-6 rounded-xl shadow-md mx-auto max-w-lg border border-stone-200">
                            <div className="bg-stone-100 p-3 rounded-lg inline-block mb-4">
                                <LineChart className="h-6 w-6 text-stone-700" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                            <p className="text-stone-600">
                                Track your channel's performance with comprehensive analytics and actionable insights.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="bg-stone-100 py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <div className="relative">
                                <div className="bg-stone-800 rounded-lg p-6 relative z-10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-stone-700 rounded-md p-4">
                                            <div className="h-32 flex items-center justify-center">
                                                <div className="text-center">
                                                    <h4 className="text-stone-200 font-bold text-xl">5.2M+</h4>
                                                    <p className="text-stone-400 text-sm">Videos Created</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-stone-700 rounded-md p-4">
                                            <div className="h-32 flex items-center justify-center">
                                                <div className="text-center">
                                                    <h4 className="text-stone-200 font-bold text-xl">87%</h4>
                                                    <p className="text-stone-400 text-sm">Time Saved</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-stone-700 rounded-md p-4">
                                            <div className="h-32 flex items-center justify-center">
                                                <div className="text-center">
                                                    <h4 className="text-stone-200 font-bold text-xl">43%</h4>
                                                    <p className="text-stone-400 text-sm">View Increase</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-stone-700 rounded-md p-4">
                                            <div className="h-32 flex items-center justify-center">
                                                <div className="text-center">
                                                    <h4 className="text-stone-200 font-bold text-xl">10K+</h4>
                                                    <p className="text-stone-400 text-sm">Creators</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-full h-full bg-stone-600 rounded-lg -z-10"></div>
                            </div>
                        </div>
                        <div className="md:w-1/2 md:pl-12">
                            <h2 className="text-3xl font-bold mb-6">About Trendly</h2>
                            <p className="text-stone-700 mb-6">
                                Trendly was created by a team of YouTube content creators who were frustrated with the fragmented tools available for video production. We wanted to build the all-in-one platform we wished we had when starting our channels.
                            </p>
                            <p className="text-stone-700 mb-6">
                                Our mission is to democratize content creation by giving creators of all sizes access to professional-grade tools powered by artificial intelligence. We believe everyone has a story to tell, and we're here to help you tell it better.
                            </p>
                            <p className="text-stone-700 mb-8">
                                With Trendly, you can focus on what matters most—creating great content that resonates with your audience—while we handle the technical aspects of production, optimization, and analytics.
                            </p>
                            <button className="bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                Learn More About Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-stone-800 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Content Creation?</h2>
                    <p className="text-stone-300 max-w-2xl mx-auto mb-10">
                        Join thousands of content creators who are saving time, increasing views, and growing their channels with Trendly.
                    </p>
                    <button onClick={() => window.location.href = '/auth'} className="bg-stone-600 hover:bg-stone-500 text-white font-medium py-3 px-12 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-lg">
                        Get Started For Free
                    </button>
                    <p className="text-stone-400 mt-6">No credit card required • 14-day free trial</p>
                </div>
            </section>
        </div>
    );
};

export default Landing;