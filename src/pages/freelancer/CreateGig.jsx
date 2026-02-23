import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleDescriptionStep from '../../components/freelancer/CreateGigSteps/TitleDescriptionStep';
import PricingStep from '../../components/freelancer/CreateGigSteps/PricingStep';
import PortfolioStep from '../../components/freelancer/CreateGigSteps/PortfolioStep';
import PreviewStep from '../../components/freelancer/CreateGigSteps/PreviewStep';
import PublishStep from '../../components/freelancer/CreateGigSteps/PublishStep';

const steps = [
    'Title and description',
    'Pricing',
    'Portfolio',
    'Preview',
    'Publish'
];

export default function CreateGig() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    // Form State
    const [gigData, setGigData] = useState({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        tags: [],
        packages: [
            { type: 'BASIC', price: '', description: '', delivery_days: '', revisions: '' },
            { type: 'STANDARD', price: '', description: '', delivery_days: '', revisions: '' },
            { type: 'PREMIUM', price: '', description: '', delivery_days: '', revisions: '' },
        ],
        media: [] // { url: string, type: 'IMAGE' | 'VIDEO' }
    });

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <TitleDescriptionStep gigData={gigData} setGigData={setGigData} nextStep={nextStep} />;
            case 1:
                return <PricingStep gigData={gigData} setGigData={setGigData} nextStep={nextStep} prevStep={prevStep} />;
            case 2:
                return <PortfolioStep gigData={gigData} setGigData={setGigData} nextStep={nextStep} prevStep={prevStep} />;
            case 3:
                return <PreviewStep gigData={gigData} nextStep={nextStep} prevStep={prevStep} />;
            case 4:
                return <PublishStep gigData={gigData} prevStep={prevStep} />;
            default:
                return <TitleDescriptionStep gigData={gigData} setGigData={setGigData} nextStep={nextStep} />;
        }
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-20">
            <div className="max-w-5xl mx-auto px-6 pt-10">
                <h1 className="text-4xl font-serif font-bold mb-8">Create a <span className="italic font-light">new</span> gig</h1>

                {/* Progress Tabs */}
                <div className="flex gap-2 mb-12 overflow-x-auto pb-4 hide-scrollbar">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`px-6 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-colors cursor-pointer ${index === currentStep
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            onClick={() => {
                                // Allow clicking to previous steps only
                                if (index < currentStep) setCurrentStep(index);
                            }}
                        >
                            {step}
                        </div>
                    ))}
                </div>

                {/* Step Content Area */}
                <div className="w-full">
                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
}
