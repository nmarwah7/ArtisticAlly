import React from 'react';
import './BackgroundVideo.css';

const BackgroundVideo = () => {
    return (
        <div className="video-background">
            <video autoPlay loop muted>
                <source src={`${process.env.PUBLIC_URL}/background.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default BackgroundVideo;
