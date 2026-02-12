const Metrics = () => {
    return (
        <section className="py-24 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12 text-center">
                    <div className="p-6">
                        <div className="text-5xl md:text-6xl font-black text-black mb-2 tracking-tighter">
                            100%
                        </div>
                        <p className="text-sm uppercase tracking-widest font-medium text-gray-500">
                            Escrow Protection
                        </p>
                    </div>
                    <div className="p-6 border-l-0 md:border-l border-r-0 md:border-r border-gray-100">
                        <div className="text-5xl md:text-6xl font-black text-black mb-2 tracking-tighter">
                            0%
                        </div>
                        <p className="text-sm uppercase tracking-widest font-medium text-gray-500">
                            Platform Bias
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="text-5xl md:text-6xl font-black text-black mb-2 tracking-tighter">
                            24/7
                        </div>
                        <p className="text-sm uppercase tracking-widest font-medium text-gray-500">
                            System Monitoring
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Metrics;
