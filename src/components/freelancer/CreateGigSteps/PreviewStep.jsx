import React from 'react';

export default function PreviewStep({ gigData, nextStep, prevStep }) {

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h2 className="text-xl font-bold font-serif mb-2">Preview</h2>
                <p className="text-sm text-gray-500 mb-6 border-b pb-6">Review your gig details before publishing.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-8 shadow-sm">
                <h1 className="text-3xl font-bold font-serif mb-6">{gigData.title || 'Untitled Gig'}</h1>

                {/* Media Preview (First image/video) */}
                {gigData.media.length > 0 ? (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 mb-8 border border-gray-200">
                        {gigData.media[0].type === 'IMAGE' ? (
                            <img src={gigData.media[0].url} alt="Gig Cover" className="w-full h-full object-cover" />
                        ) : (
                            <video src={gigData.media[0].url} className="w-full h-full object-cover" controls />
                        )}
                    </div>
                ) : (
                    <div className="aspect-video w-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 mb-8 border border-gray-200">
                        No media uploaded
                    </div>
                )}

                {/* Tag & Category */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {gigData.category && (
                        <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded">
                            {gigData.category}
                        </span>
                    )}
                    {gigData.subcategory && (
                        <span className="px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded">
                            {gigData.subcategory}
                        </span>
                    )}
                </div>

                {/* Description */}
                <div className="mb-10">
                    <h3 className="font-bold mb-3">About This Gig</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {gigData.description || "No description provided."}
                    </p>
                </div>

                {/* Packages Overview */}
                <div className="mb-10">
                    <h3 className="font-bold mb-4">Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {gigData.packages.map((pkg, idx) => (
                            <div key={idx} className="border border-gray-200 rounded p-5 flex flex-col">
                                <div className="text-center font-bold font-serif mb-2 border-b pb-2">{pkg.type}</div>
                                <div className="text-2xl font-bold text-center mb-4">
                                    {pkg.price ? `₹${pkg.price}` : 'Free'}
                                </div>
                                <p className="text-xs text-gray-600 mb-4 min-h-[40px]">
                                    {pkg.description || "..."}
                                </p>
                                <div className="mt-auto pt-4 border-t text-xs space-y-2 text-gray-500">
                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span className="font-semibold text-black">{pkg.delivery_days || '-'} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Revisions</span>
                                        <span className="font-semibold text-black">{pkg.revisions || '0'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                {gigData.tags.length > 0 && (
                    <div>
                        <h3 className="font-bold mb-3 text-sm">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {gigData.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center bg-white mt-8">
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
                    Continue to Publish
                </button>
            </div>
        </div>
    );
}
