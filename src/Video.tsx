import React, { LegacyRef, useRef } from "react";
import ReactPlayer from "react-player";
import './video.css';

interface VideoProps{
    /**
     * Video source URL
     */
    src: string;
    /**
     * Video title
     */
    title?: string;
    /**
     * Video description
     */
    description?: string;
    /**
     * Is player in light mode. In light mode player activates after click, before shown only preview
     */
    light?: boolean;
    height?: number,
    playing?: boolean
}

/**
 * Video component
 */
export const Video = ({
    title = "",
    description = "",
    light = true,
    height = 360,
    src,
    ...props
}: VideoProps) => {
    const ref = useRef<ReactPlayer>(null);
    return <div className="video-container">
        <ReactPlayer url={src} light={light} height={height} ref={ref} playing={props.playing}/>
        <div className="video-text">
            <h3 className="video-text-title">{title}</h3>
            <p className="video-text-description">{description}</p>
        </div>
    </div>
}