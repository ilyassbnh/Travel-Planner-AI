import { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackText }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 ${className} text-center p-4`}>
                <span className="text-white font-bold text-2xl drop-shadow-md">
                    {fallbackText || alt}
                </span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
};

export default ImageWithFallback;
