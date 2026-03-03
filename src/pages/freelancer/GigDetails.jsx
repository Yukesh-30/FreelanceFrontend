import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const GigDetails = () => {
    const { id } = useParams();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMediaLoading, setIsMediaLoading] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState(null);
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        category: '',
        subcategory: ''
    });

    const [editingPackageType, setEditingPackageType] = useState(null);
    const [editPackageForm, setEditPackageForm] = useState({
        package_type: '',
        price: '',
        description: '',
        delivery_days: '',
        revisions: ''
    });

    useEffect(() => {
        const fetchGigDetails = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(API_PATH.GIGS.GET_BY_ID(id));
                if (response.data?.gig) {
                    const fetchedGig = response.data.gig;
                    setGig(fetchedGig);
                    setEditForm({
                        title: fetchedGig.title || '',
                        description: fetchedGig.description || '',
                        category: fetchedGig.category || '',
                        subcategory: fetchedGig.subcategory || ''
                    });
                } else {
                    setError("Gig format unexpected.");
                }
            } catch (err) {
                console.error("Failed to fetch gig details:", err);
                setError("Could not load gig details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGigDetails();
        }
    }, [id]);

    const handleUpdate = async () => {
        try {
            await axiosInstance.patch(API_PATH.GIGS.UPDATE(id), editForm);
            setGig({ ...gig, ...editForm });
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update gig:", err);
            alert("Failed to update gig");
        }
    };

    const handleEditPackageClick = (pkg) => {
        setEditingPackageType(pkg.type);
        setEditPackageForm({
            package_type: pkg.type || '',
            price: pkg.price || '',
            description: pkg.description || '',
            delivery_days: pkg.delivery_days || '',
            revisions: pkg.revisions || ''
        });
    };

    const handleCancelPackageEdit = () => {
        setEditingPackageType(null);
    };

    const handlePackageUpdate = async () => {
        try {
            await axiosInstance.patch(API_PATH.GIGS.UPDATE_PACKAGE(id), editPackageForm);

            // Update local state
            const updatedPackages = gig.packages.map(pkg =>
                pkg.type === editingPackageType ? { ...pkg, ...editPackageForm } : pkg
            );
            setGig({ ...gig, packages: updatedPackages });
            setEditingPackageType(null);
        } catch (err) {
            console.error("Failed to update package:", err);
            alert("Failed to update package");
        }
    };

    const handleMediaUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setIsMediaLoading(true);
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('media', file);
            });

            const response = await axiosInstance.post(API_PATH.GIGS.POST_MEDIA(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data?.media) {
                const formattedMedia = response.data.media.map(m => ({
                    id: m.id,
                    url: m.media_url,
                    type: m.media_type
                }));

                setGig(prevGig => ({
                    ...prevGig,
                    media: [...(prevGig.media || []), ...formattedMedia]
                }));
            }
        } catch (err) {
            console.error("Failed to upload media:", err);
            alert("Failed to upload media");
        } finally {
            setIsMediaLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeleteClick = (mediaId) => {
        setMediaToDelete(mediaId);
    };

    const confirmDeleteMedia = async () => {
        if (!mediaToDelete) return;

        setIsMediaLoading(true);
        try {
            await axiosInstance.delete(API_PATH.GIGS.DELETE_MEDIA, {
                data: { id: mediaToDelete }
            });

            setGig(prevGig => ({
                ...prevGig,
                media: prevGig.media.filter(m => m.id !== mediaToDelete)
            }));
            setMediaToDelete(null);
        } catch (err) {
            console.error("Failed to delete media:", err);
            alert("Failed to delete media");
        } finally {
            setIsMediaLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading gig details...</div>;
    }

    if (error || !gig) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{error || "Gig not found."}</p>
                <Link to="/freelancer/profile" className="text-black font-semibold hover:underline">← Back to Profile</Link>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link to="/freelancer/profile" className="inline-block text-sm text-gray-500 hover:text-black font-medium transition-colors">
                    ← Back to Profile
                </Link>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="bg-black hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
                        Edit Gig Details
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleUpdate} className="bg-black hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-200">

                {/* Header Information */}
                <div className="mb-8 border-b border-gray-100 pb-8">
                    {isEditing ? (
                        <div className="space-y-4 mb-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                                    <input type="text" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Category" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subcategory</label>
                                    <input type="text" value={editForm.subcategory} onChange={e => setEditForm({ ...editForm, subcategory: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Subcategory" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gig Title</label>
                                <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-lg font-serif font-bold focus:ring-1 focus:ring-black outline-none" placeholder="I will do something amazing..." />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-2 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <span>{gig.category}</span>
                                <span>•</span>
                                <span>{gig.subcategory}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                                {gig.title}
                            </h1>
                        </>
                    )}

                    {/* Tags */}
                    {gig.tags && gig.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {gig.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Media & Description */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Media Gallery */}
                        {(gig.media && gig.media.length > 0) || isEditing ? (
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 font-serif text-xl border-b border-gray-100 pb-2">Portfolio</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {gig.media && gig.media.map((item) => (
                                        <div key={item.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                                            {item.type === 'IMAGE' ? (
                                                <img
                                                    src={item.url}
                                                    alt="Gig media"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <video src={item.url} controls className="w-full h-full object-cover" />
                                            )}

                                            {isEditing ? (
                                                <div
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <button
                                                        onClick={() => handleDeleteClick(item.id)}
                                                        className="bg-white/90 hover:bg-red-50 text-red-500 p-2.5 rounded-full shadow-lg transition-all hover:scale-110"
                                                        title="Delete Media"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                    {item.type}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Upload New File Placeholder */}
                                    {isEditing && (
                                        <div
                                            onClick={() => !isMediaLoading && fileInputRef.current?.click()}
                                            className={`aspect-video rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:bg-gray-100 transition-colors ${isMediaLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isMediaLoading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <svg className="animate-spin h-6 w-6 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                    </svg>
                                                    <span className="text-sm font-medium">Processing...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-3xl mb-1">+</span>
                                                    <span className="text-sm font-semibold">Add Media</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Hidden File Input */}
                                {isEditing && (
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleMediaUpload}
                                    />
                                )}
                            </div>
                        ) : null}

                        {/* Description */}
                        <div>
                            <h3 className="font-bold text-gray-900 font-serif text-xl mb-4 border-b border-gray-100 pb-2">About This Gig</h3>
                            {isEditing ? (
                                <textarea
                                    value={editForm.description}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-black outline-none min-h-[150px] resize-y"
                                    placeholder="Describe your gig..."
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {gig.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Packages */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-900 font-serif text-xl border-b border-gray-100 pb-2">Pricing Packages</h3>
                        {gig.packages && gig.packages.length > 0 ? (
                            <div className="space-y-4">
                                {gig.packages.map((pkg) => (
                                    <div key={pkg.id} className="border border-gray-200 rounded-xl p-5 hover:border-black transition-colors bg-gray-50 relative group/pkg">

                                        {editingPackageType === pkg.type ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-gray-900 tracking-wide">{pkg.type}</h4>
                                                    <div className="flex gap-2">
                                                        <button onClick={handleCancelPackageEdit} className="text-xs font-semibold text-gray-500 hover:text-gray-700">Cancel</button>
                                                        <button onClick={handlePackageUpdate} className="text-xs bg-black text-white px-2 py-1 rounded font-semibold hover:bg-gray-800">Save</button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price ($)</label>
                                                    <input type="number" value={editPackageForm.price} onChange={e => setEditPackageForm({ ...editPackageForm, price: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none" />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                                                    <textarea value={editPackageForm.description} onChange={e => setEditPackageForm({ ...editPackageForm, description: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none min-h-[80px]" />
                                                </div>

                                                <div className="flex gap-3">
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Delivery Days</label>
                                                        <input type="number" value={editPackageForm.delivery_days} onChange={e => setEditPackageForm({ ...editPackageForm, delivery_days: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Revisions</label>
                                                        <input type="number" value={editPackageForm.revisions} onChange={e => setEditPackageForm({ ...editPackageForm, revisions: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-bold text-gray-900 tracking-wide">{pkg.type}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEditPackageClick(pkg)}
                                                            className="text-gray-400 hover:text-black p-1 rounded-full transition-colors opacity-0 group-hover/pkg:opacity-100"
                                                            title="Edit Package"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <span className="text-xl font-bold text-gray-900">${pkg.price}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">
                                                    {pkg.description}
                                                </p>
                                                <div className="flex flex-col gap-2 text-xs font-medium text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        {pkg.delivery_days} Days Delivery
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                        {pkg.revisions} Revisions
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No packages defined for this gig.</p>
                        )}
                    </div>

                </div>
            </div>
            {/* Delete Confirmation Modal */}
            {mediaToDelete && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-red-100 text-red-500 p-3 rounded-full mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Media?</h3>
                            <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this media file? This action cannot be undone.</p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setMediaToDelete(null)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl transition-colors"
                                    disabled={isMediaLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteMedia}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors flex justify-center items-center"
                                    disabled={isMediaLoading}
                                >
                                    {isMediaLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                    ) : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GigDetails;
