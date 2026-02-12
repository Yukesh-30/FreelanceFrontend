const Developers = () => {
    return (
        <section className="py-24 bg-[#F5F5F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                    Built by Developers, For Professionals.
                </h2>
                <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto font-light">
                    Crafted with precision and trust-first engineering by Shailesh and Yukesh.
                </p>

                <div className="flex justify-center gap-12 sm:gap-24">
                    <div className="text-center group">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white border-2 border-gray-200 mx-auto mb-6 flex items-center justify-center shadow-sm group-hover:border-black transition-colors duration-300">
                            <span className="text-2xl sm:text-3xl font-serif font-bold text-gray-300 group-hover:text-black">S</span>
                        </div>
                        <h3 className="text-lg font-bold text-black">Shailesh S</h3>
                        <p className="text-sm text-gray-500">Co-Creator</p>
                    </div>

                    <div className="text-center group">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white border-2 border-gray-200 mx-auto mb-6 flex items-center justify-center shadow-sm group-hover:border-black transition-colors duration-300">
                            <span className="text-2xl sm:text-3xl font-serif font-bold text-gray-300 group-hover:text-black">Y</span>
                        </div>
                        <h3 className="text-lg font-bold text-black">Yukesh D</h3>
                        <p className="text-sm text-gray-500">Co-Creator</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Developers;

