import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative bg-white pt-24 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Text Content */}
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.1] mb-6">
                            Work Without Fear. <br />
                            <span className="text-gray-400">Hire With Confidence.</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed font-light max-w-lg">
                            A trust-first freelance platform powered by escrow payments,
                            secure collaboration, and structured work verification.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/signup"
                                className="inline-flex justify-center items-center px-8 py-4 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="#features"
                                className="inline-flex justify-center items-center px-8 py-4 border-2 border-gray-200 text-black text-lg font-medium rounded-lg hover:border-black hover:bg-gray-50 transition-all"
                            >
                                Explore Features
                            </Link>
                        </div>
                    </div>

                    {/* Abstract Minimal Illustration */}
                    <div className="relative hidden lg:block">
                        <svg viewBox="0 0 600 600" className="w-full h-auto text-black opacity-100">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />

                            {/* Minimal geometric composition */}
                            <circle cx="300" cy="300" r="150" fill="none" stroke="currentColor" strokeWidth="2" />
                            <circle cx="300" cy="300" r="100" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                            <line x1="150" y1="300" x2="450" y2="300" stroke="currentColor" strokeWidth="2" />
                            <line x1="300" y1="150" x2="300" y2="450" stroke="currentColor" strokeWidth="2" />

                            {/* Floating elements representing nodes/connection */}
                            <circle cx="450" cy="300" r="8" fill="black" />
                            <circle cx="150" cy="300" r="8" fill="black" />
                            <circle cx="300" cy="150" r="8" fill="white" stroke="black" strokeWidth="2" />
                            <circle cx="300" cy="450" r="8" fill="white" stroke="black" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
