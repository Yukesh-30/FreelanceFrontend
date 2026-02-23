import React, { useState } from 'react';

export default function TitleDescriptionStep({ gigData, setGigData, nextStep }) {
    const [tagInput, setTagInput] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGigData({ ...gigData, [name]: value });
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = tagInput.trim();
            if (val && !gigData.tags.includes(val)) {
                setGigData({ ...gigData, tags: [...gigData.tags, val] });
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setGigData({
            ...gigData,
            tags: gigData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="border border-gray-200 rounded-lg p-8 mb-8 space-y-6">

                {/* Title */}
                <div className="flex flex-col md:flex-row gap-4 md:items-start">
                    <label className="w-48 text-sm font-semibold shrink-0 pt-3">Gig Title</label>
                    <div className="flex-1">
                        <input
                            type="text"
                            name="title"
                            value={gigData.title}
                            onChange={handleChange}
                            placeholder="I will do..."
                            className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col md:flex-row gap-4 md:items-start">
                    <label className="w-48 text-sm font-semibold shrink-0 pt-3">Gig description</label>
                    <div className="flex-1">
                        <textarea
                            name="description"
                            value={gigData.description}
                            onChange={handleChange}
                            placeholder="Describe what you will deliver..."
                            rows={8}
                            className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-8 space-y-6">
                {/* Category & Subcategory */}
                <div className="flex flex-col md:flex-row gap-4 md:items-start">
                    <label className="w-48 text-sm font-semibold shrink-0 pt-3">Category and <br /> Subcategory</label>
                    <div className="flex-1 flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            name="category"
                            value={gigData.category}
                            onChange={handleChange}
                            placeholder="Category (e.g., Programming)"
                            className="flex-1 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <input
                            type="text"
                            name="subcategory"
                            value={gigData.subcategory}
                            onChange={handleChange}
                            placeholder="Subcategory (e.g., Web Dev)"
                            className="flex-1 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-col md:flex-row gap-4 md:items-start">
                    <label className="w-48 text-sm font-semibold shrink-0 pt-3">Tags & keywords</label>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Type and press Enter..."
                            className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black transition-colors mb-3"
                        />
                        <div className="flex flex-wrap gap-2">
                            {gigData.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-black">
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={nextStep}
                    disabled={!gigData.title || !gigData.description || !gigData.category}
                    className="bg-black text-white px-8 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
