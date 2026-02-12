import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import BusinessValue from '../components/landing/BusinessValue';
import Metrics from '../components/landing/Metrics';
import Developers from '../components/landing/Developers';
import CallToAction from '../components/landing/CallToAction';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <BusinessValue />
            <Metrics />
            <Developers />
            <CallToAction />
            <Footer />
        </div>
    );
};

export default LandingPage;
