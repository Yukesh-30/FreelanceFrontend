import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-32 bg-white text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 tracking-tight">
                    Start Your Secure Freelancing Journey Today.
                </h2>
                <div className="flex justify-center">
                    <Link
                        to="/signup"
                        className="px-10 py-4 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        Create Free Account
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
