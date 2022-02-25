import React from "react";
import './badge.css';
import ReactTooltip from 'react-tooltip';

interface BadgeProps{
    image: string;
    size?: 'small' | 'middle' | 'large',
    title?: string;
    description?: string;
    // backgroundColor?: string,
    // color?: string,
    // transparency?: number
}

function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export const Badge = ({
    title,
    description,
    size = 'middle',
    // backgroundColor,
    // color,
    // transparency,
    image
}: BadgeProps) => {
    // const rgbBackgroundColor = backgroundColor ? hexToRgb(backgroundColor) : undefined;
    //style={backgroundColor ? {background: `rgba(${rgbBackgroundColor?.r}, ${rgbBackgroundColor?.g}, ${rgbBackgroundColor?.b}, ${transparency})`} : {}}
    const realImage = image ? (image.startsWith('http') ? image : `https://firebasestorage.googleapis.com/v0/b/dd-asia.appspot.com/o/${image.replace('/', '%2F')}?alt=media`) : undefined;
    return <div>
        <div className={`badge badge--${size}`} data-tip={`Значок "${title}"`}> 
            <img className={`badge-image badge-image--${size}`} alt={title} src={realImage}/>
        </div>
        <ReactTooltip effect="solid"/>
    </div>
}