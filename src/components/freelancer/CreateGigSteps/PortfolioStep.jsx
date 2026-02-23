import React, { useRef } from 'react';

export default function PortfolioStep({ gigData, setGigData, nextStep, prevStep }) {
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);

        // Create local object URLs to simulate upload for now
        const newMedia = files.map(file => {
            // Determine type based on file type
            const isVideo = file.type.startsWith('video/');
            return {
                url: URL.createObjectURL(file), // Mock URL
                type: isVideo ? 'VIDEO' : 'IMAGE',
                file: file // Keeping reference to actual file just in case it's needed later
            };
        });

        setGigData({
            ...gigData,
            media: [...gigData.media, ...newMedia]
        });

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeMedia = (index) => {
        const newMedia = [...gigData.media];
        newMedia.splice(index, 1);
        setGigData({ ...gigData, media: newMedia });
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h2 className="text-xl font-bold font-serif mb-2">Showcase your <span className="italic font-light">services</span> here</h2>
                <p className="text-sm text-gray-500 mb-6 border-b pb-6">Upload images or videos that showcase your work. This will be the cover of your gig.</p>
            </div>

            {/* Media Upload Area */}
            <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-sm mb-4">Photos & Videos</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                    {/* Existing Media */}
                    {gigData.media.map((item, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-md overflow-hidden bg-gray-100 group border border-gray-200">
                            {item.type === 'IMAGE' ? (
                                <img src={item.url} alt={`media-${idx}`} className="w-full h-full object-cover" />
                            ) : (
                                <video src={item.url} className="w-full h-full object-cover" controls />
                            )}

                            {/* Delete Overlay */}
                            <div
                                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                                onClick={() => removeMedia(idx)}
                            >
                                <span className="text-sm font-medium hover:underline">Remove</span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Button */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[4/3] rounded-md bg-gray-100 hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer text-gray-400"
                    >
                        <span className="text-3xl mb-1">+</span>
                        <span className="text-xs font-semibold">Browse</span>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-sm mb-2">Links</h3>
                <p className="text-xs text-gray-500 mb-4">Add a link to your external portfolio if you have one.</p>
                <input type="text" placeholder="https://..." className="w-full px-4 py-2 text-sm bg-gray-100 rounded focus:outline-none focus:bg-white focus:ring-1 focus:ring-black border border-transparent focus:border-black transition-all" />
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
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
