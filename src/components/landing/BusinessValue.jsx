import { Check } from 'lucide-react';

const valuePoints = [
    "Transparent ACID-Based Payment System",
    "Client & Freelancer Protection",
    "Secure Escrow Logic",
    "Structured Project Management",
    "Clean Professional Environment"
];

const BusinessValue = () => {
    return (
        <section className="py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-gray-400 text-lg mb-12 max-w-lg font-light">
                            We've stripped away the noise to focus on what matters: security, clarity, and results.
                        </p>

                        <div className="space-y-6">
                            {valuePoints.map((point, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-200">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="aspect-square border border-white/20 rounded-full flex items-center justify-center p-12">
                            <div className="w-full h-full border border-white/40 rounded-full flex items-center justify-center p-12">
                                <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-6xl font-serif italic text-white/20">Trust</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessValue;
