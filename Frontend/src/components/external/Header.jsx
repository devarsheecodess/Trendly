import React, { useState } from 'react';
import { animateScroll as scroll } from 'react-scroll';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleHome = () => {
        scroll.scrollToTop();
        toggleMenu();
    }

    const handleAbout = () => {
        scroll.scrollTo(500);
    }

    const handleMobAbout = () => {
        scroll.scrollTo(1100);
        toggleMenu();
    }

    return (
        <header className="sticky z-40 top-0 bg-stone-800/70 text-white">
            <div className="container mx-auto px-6 py-5">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-stone-50 tracking-wide">
                            Trendly
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-10">
                        <a
                            onClick={handleHome}
                            className="text-stone-200 hover:text-white relative py-2 group"
                        >
                            <p className='text-white font-bold'>Home</p>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-300 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a
                            onClick={handleAbout}
                            className="text-stone-200 hover:text-white relative py-2 group"
                        >
                            <p className='text-white font-bold'>About</p>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-300 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a
                            href="/auth"
                            className="bg-stone-600 hover:bg-stone-500 px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <p className='text-white font-bold'>Get Started</p>
                        </a>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden z-50">
                        <button
                            onClick={toggleMenu}
                            className="text-stone-100 hover:text-white focus:outline-none transition-all duration-300"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Full screen Mobile Navigation */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-40 md:hidden transition-all duration-300">
                    <nav className="flex flex-col items-center space-y-8 w-full px-12">
                        <a
                            className="text-stone-100 hover:text-white text-2xl font-medium transition-all duration-300 hover:scale-105 w-full text-center"
                            onClick={handleHome}
                        >
                            <p className='text-white font-bold'>Home</p>
                        </a>
                        <a
                            className="text-stone-100 hover:text-white text-2xl font-medium transition-all duration-300 hover:scale-105 w-full text-center"
                            onClick={handleMobAbout}
                        >
                            <p className='text-white font-bold'>About</p>
                        </a>
                        <a
                            href="/auth"
                            className="bg-stone-600 hover:bg-stone-500 px-8 py-3 rounded-lg text-white text-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 w-2/3 text-center mt-4"
                            onClick={toggleMenu}
                        >
                            <p className='text-white font-bold'>Get Started</p>
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;