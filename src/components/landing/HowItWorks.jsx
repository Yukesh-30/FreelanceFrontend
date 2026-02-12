const steps = [
    {
        number: "01",
        title: "Post or Accept a Job",
        description: "Define requirements or find your next project."
    },
    {
        number: "02",
        title: "Fund Escrow",
        description: "Client deposits funds safely before work begins."
    },
    {
        number: "03",
        title: "Collaborate",
        description: "Work together with real-time tools and updates."
    },
    {
        number: "04",
        title: "Submit & Verify",
        description: "Review deliverables against requirements."
    },
    {
        number: "05",
        title: "Release Payment",
        description: "Funds are released instantly upon approval."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-16">
                        How It Works
                    </h2>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 rounded-full bg-white border border-black flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                        <span className="text-xl font-bold font-serif">{step.number}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-black mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-500 max-w-[200px]">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
