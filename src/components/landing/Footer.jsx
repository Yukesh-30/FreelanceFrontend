import { Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="text-2xl font-bold text-white tracking-tight mb-4 inline-block">
                            Freelance<span className="text-gray-500">.</span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Secure, transparent, and professional freelancing for the modern era.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col space-y-4">
                        <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
                        <Link to="/security" className="text-gray-400 hover:text-white transition-colors text-sm">Security</Link>
                    </div>

                    {/* Social / Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Contact</h3>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="mailto:contact@example.com" className="text-gray-400 hover:text-white transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {currentYear} All Rights Reserved</p>
                    <p className="mt-2 md:mt-0">Developed by Shailesh & Yukesh</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
