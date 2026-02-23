import React from 'react';

export default function PricingStep({ gigData, setGigData, nextStep, prevStep }) {

    const handlePackageChange = (index, field, value) => {
        const updatedPackages = [...gigData.packages];
        updatedPackages[index] = { ...updatedPackages[index], [field]: value };
        setGigData({ ...gigData, packages: updatedPackages });
    };

    return (
        <div className="animate-fade-in border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 border-b border-gray-200">
                <div className="p-4 bg-gray-50 flex items-center justify-center font-semibold text-sm border-r border-gray-200">
                    Packages
                </div>
                <div className="p-4 flex items-center justify-center font-bold text-sm tracking-wider border-r border-gray-200">
                    BASIC
                </div>
                <div className="p-4 flex items-center justify-center font-bold text-sm tracking-wider border-r border-gray-200">
                    STANDARD
                </div>
                <div className="p-4 flex items-center justify-center font-bold text-sm tracking-wider">
                    PREMIUM
                </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 border-b border-gray-200">
                <div className="p-4 bg-gray-50 flex items-center justify-center font-medium text-xs text-center border-r border-gray-200">
                    Description
                </div>
                {gigData.packages.map((pkg, idx) => (
                    <div key={idx} className={`p-4 ${idx < 2 ? 'border-r border-gray-200' : ''}`}>
                        <textarea
                            placeholder="Brief description of what is included..."
                            value={pkg.description}
                            onChange={(e) => handlePackageChange(idx, 'description', e.target.value)}
                            className="w-full h-24 p-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-black resize-none"
                        />
                    </div>
                ))}
            </div>

            {/* Delivery Time */}
            <div className="grid grid-cols-4 border-b border-gray-200 hidden-mobile-row">
                <div className="p-4 bg-gray-50 flex items-center justify-center font-medium text-xs text-center border-r border-gray-200">
                    Delivery Time (Days)
                </div>
                {gigData.packages.map((pkg, idx) => (
                    <div key={idx} className={`p-4 flex items-center justify-center ${idx < 2 ? 'border-r border-gray-200' : ''}`}>
                        <input
                            type="number"
                            min="1"
                            placeholder="e.g. 2"
                            value={pkg.delivery_days}
                            onChange={(e) => handlePackageChange(idx, 'delivery_days', parseInt(e.target.value) || '')}
                            className="w-full p-2 text-center text-sm border border-gray-200 rounded focus:outline-none focus:border-black"
                        />
                    </div>
                ))}
            </div>

            {/* Revisions */}
            <div className="grid grid-cols-4 border-b border-gray-200">
                <div className="p-4 bg-gray-50 flex items-center justify-center font-medium text-xs text-center border-r border-gray-200">
                    Revisions
                </div>
                {gigData.packages.map((pkg, idx) => (
                    <div key={idx} className={`p-4 flex items-center justify-center ${idx < 2 ? 'border-r border-gray-200' : ''}`}>
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 1"
                            value={pkg.revisions}
                            onChange={(e) => handlePackageChange(idx, 'revisions', parseInt(e.target.value) || 0)}
                            className="w-full p-2 text-center text-sm border border-gray-200 rounded focus:outline-none focus:border-black"
                        />
                    </div>
                ))}
            </div>

            {/* Total Price */}
            <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50/50">
                <div className="p-4 bg-gray-50 flex items-center justify-center font-semibold text-sm border-r border-gray-200">
                    Total (INR)
                </div>
                {gigData.packages.map((pkg, idx) => (
                    <div key={idx} className={`p-4 flex items-center justify-center ${idx < 2 ? 'border-r border-gray-200' : ''}`}>
                        <input
                            type="number"
                            min="0"
                            placeholder="₹"
                            value={pkg.price}
                            onChange={(e) => handlePackageChange(idx, 'price', parseInt(e.target.value) || '')}
                            className="w-full p-2 text-center text-sm font-semibold border border-gray-300 rounded focus:outline-none focus:border-black"
                        />
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="p-6 flex justify-between items-center bg-white">
                <button
                    onClick={prevStep}
                    className="text-sm font-medium hover:underline px-4 py-2"
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    className="bg-black text-white px-8 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
