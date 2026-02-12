import { Shield, MessageSquare, CheckCircle, Clock, Award, Scale } from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: "Secure Escrow Payments",
        description: "Funds are held safely until work is approved. No risk for either party."
    },
    {
        icon: MessageSquare,
        title: "Real-Time Chat System",
        description: "Seamless communication with built-in file sharing and history."
    },
    {
        icon: CheckCircle,
        title: "Work Verification Process",
        description: "Automated and manual verification steps to ensure quality delivery."
    },
    {
        icon: Clock,
        title: "Milestone-Based Tracking",
        description: "Break complex projects into manageable steps with clear deadlines."
    },
    {
        icon: Award,
        title: "Freelancer Skill Verification",
        description: "Rigorous testing and portfolio review for all professional talent."
    },
    {
        icon: Scale,
        title: "Dispute Resolution System",
        description: "Fair and transparent arbitration process if things go wrong."
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 bg-[#F5F5F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Built for Trust. Designed for Professionals.
                    </h2>
                    <div className="h-1 w-20 bg-black mx-auto mt-6"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 mb-6">
                                <feature.icon className="w-6 h-6 text-black" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
