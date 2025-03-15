import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-stone-900 text-stone-300 py-6">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-stone-200 font-medium">© 2025 Trendly. All rights reserved.</p>
                        <p className="text-stone-400 text-sm mt-1">AI-powered tools for YouTube creators</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center">
                        <div className="flex space-x-4 mb-4 md:mb-0 md:mr-8">
                            <a href="#" className="text-stone-400 hover:text-white transition-colors duration-300">Terms</a>
                            <a href="#" className="text-stone-400 hover:text-white transition-colors duration-300">Privacy</a>
                            <a href="#" className="text-stone-400 hover:text-white transition-colors duration-300">Contact</a>
                        </div>

                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-stone-700 p-2 rounded-full hover:bg-stone-600 transition-all duration-300"
                            >
                                <Github size={20} className="text-stone-200" />
                            </a>

                            <a
                                href="https://linkedin.com/in/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-stone-700 p-2 rounded-full hover:bg-stone-600 transition-all duration-300"
                            >
                                <Linkedin size={20} className="text-stone-200" />
                            </a>

                            <a
                                href="mailto:your.email@example.com"
                                className="bg-stone-700 p-2 rounded-full hover:bg-stone-600 transition-all duration-300"
                            >
                                <Mail size={20} className="text-stone-200" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;