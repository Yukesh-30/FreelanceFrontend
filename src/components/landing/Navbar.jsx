import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-black tracking-tight">
                            Freelance<span className="text-gray-400">.</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Home</Link>
                        <Link to="#features" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Features</Link>
                        <Link to="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">How It Works</Link>
                        <Link to="#pricing" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Pricing</Link>
                        <Link to="#about" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">About</Link>
                        <Link to="/login" className="text-sm font-medium text-black hover:text-gray-700 transition-colors">Login</Link>
                        <Link
                            to="/signup"
                            className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-black focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">
                    <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
                        <Link to="/" className="block px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md">Home</Link>
                        <Link to="#features" className="block px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black rounded-md">Features</Link>
                        <Link to="#how-it-works" className="block px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black rounded-md">How It Works</Link>
                        <Link to="#pricing" className="block px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black rounded-md">Pricing</Link>
                        <Link to="#about" className="block px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black rounded-md">About</Link>
                        <Link to="/login" className="block px-3 py-3 text-base font-medium text-black hover:bg-gray-50 rounded-md">Login</Link>
                        <div className="pt-4 pb-2">
                            <Link
                                to="/signup"
                                className="block w-full text-center bg-black text-white px-5 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-all"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
