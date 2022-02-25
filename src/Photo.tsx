import React from "react";
import './photo.css';

interface PhotoProps{
    /**
     * Variant of photo render
     */
    variant?: 'circle' | 'square',
    /**
     * Photo size
     */
    size?: 'small' | 'medium' | 'large',
    /**
     * Image URL source
     */
    src: string,
    /**
     * Alternative text for image
     */
    alt?: string
}

/**
 * Photo component
 */
export const Photo = ({
    variant = 'circle',
    size = 'medium',
    alt = '',
    src
}: PhotoProps) => {
    const realImage = src ? (src.startsWith('http') ? src : `https://firebasestorage.googleapis.com/v0/b/dd-asia.appspot.com/o/${src.replace('/', '%2F')}?alt=media`) : undefined;
    return <div className={['photo', 'photo-root', `photo-root--${variant}`, `photo-root--${size}`].join(' ')}>
        <img src={realImage} alt={alt} className={['photo', 'photo-image', `photo-image--${variant}`, `photo-image--${size}`].join(' ')}/>
    </div>
}