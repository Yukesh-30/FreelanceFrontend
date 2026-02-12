import React from 'react';
import AncientVideo from '../assets/Ancient404.mp4';
import Button from '../components/Button';

const Ancient404 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
            <div className="relative w-full max-w-4xl aspect-video overflow-hidden mb-8">
                <video
                    src={AncientVideo}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="text-center max-w-2xl px-6">
                <h4 className='text-2xl font-playfair font-thin tracking-wide text-gray-500'>The page you are looking for does not exist.</h4>
                <Button link="/" text="Go Back" />
            </div>
        </div>
    );
};

export default Ancient404;
