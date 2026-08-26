import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import './DownloadTruckButton.css';

const DownloadTruckButton = ({ onDownload, isDownloading }) => {
  const buttonRef = useRef(null);
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handlePointerDown = () => {
      if (animating) return;
      gsap.to(button, { '--scale': 0.975, duration: 0.15 });
    };

    const handlePointerUpOrLeave = () => {
      if (animating) return;
      gsap.to(button, { '--scale': 1, duration: 0.15 });
    };

    button.addEventListener('pointerdown', handlePointerDown);
    button.addEventListener('pointerup', handlePointerUpOrLeave);
    button.addEventListener('pointerleave', handlePointerUpOrLeave);

    return () => {
      button.removeEventListener('pointerdown', handlePointerDown);
      button.removeEventListener('pointerup', handlePointerUpOrLeave);
      button.removeEventListener('pointerleave', handlePointerUpOrLeave);
    };
  }, [animating]);

  const handleClick = (e) => {
    e.preventDefault();
    if (animating) return;

    const button = buttonRef.current;
    setAnimating(true);

    if (done) {
      gsap.to(button, { '--success-o': 0, duration: 0.15 });
      gsap.to(button, {
        '--default-o': 1,
        duration: 0.4,
        clearProps: true,
        onComplete() {
          setAnimating(false);
          setDone(false);
        }
      });
      return;
    }

    // Trigger the actual download logic
    if (onDownload) {
      onDownload();
    }

    gsap.to(button, {
      '--rotate': '-90deg',
      '--y': '25px',
      '--default-o': 0,
      duration: 0.2
    });

    gsap.to(button, {
      keyframes: [
        { '--truck-base-x': '-4px', duration: 0.5 },
        { '--truck-base-x': '0px', duration: 0.2 },
        {
          '--truck-base-x': '60px',
          '--box-x': '-60px',
          duration: 0.5,
          onStart() {
            setTimeout(() => {
              gsap.to(button, {
                keyframes: [
                  { '--box-y': '10px', '--box-r': '-8deg', duration: 0.2 },
                  { '--box-r': '0deg', duration: 0.2 }
                ]
              });
            }, 200);
          }
        },
        { '--truck-base-x': '56px', '--box-x': '-56px', duration: 0.4 },
        { '--light-opacity': 0, duration: 0.3, delay: 0.2 }
      ],
      onComplete() {
        setTimeout(() => {
          setDone(true);
          setAnimating(false);
          gsap.to(button, {
            keyframes: [
              { '--rotate': '0deg', '--y': '0px', duration: 0.2 },
              { '--success-offset': '0px', '--success-o': 1, duration: 0.2 }
            ]
          });
        }, 500);
      }
    });
  };

  return (
    <button 
      ref={buttonRef} 
      className={`dl-button ${animating ? 'animating' : ''} ${done ? 'done' : ''}`}
      onClick={handleClick}
      disabled={isDownloading}
    >
      <span className="default">Download all</span>
      <span className="success">
        Download started
        <svg viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </svg>
      </span>
      <div className="truck-wrapper">
        <div className="truck">
          <div className="wheel"></div>
          <div className="back">
            <div className="shadow"></div>
            <div className="logo">
              <svg width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.8383 5.61481C20.7936 4.64191 19.1997 4.6419 18.155 5.61481L14.178 9.31858C13.6251 9.83349 13.6251 10.7252 14.178 11.2401L18.155 14.9439C19.1997 15.9168 20.7936 15.9168 21.8383 14.9439L25.8153 11.2402C26.3682 10.7252 26.3682 9.8335 25.8153 9.31858L21.8383 5.61481Z" fill="#20D8F9"/>
                <g filter="url(#filter0_dddddd)">
                  <path d="M15.5918 8.0018L18.1549 10.3888C19.1996 11.3617 20.7935 11.3617 21.8382 10.3888L24.4013 8.0018L21.8382 5.61481C20.7935 4.64191 19.1996 4.6419 18.1549 5.61481L15.5918 8.0018Z" fill="white"/>
                </g>
                <path d="M21.8383 1.15366C20.7936 0.180755 19.1997 0.180753 18.155 1.15366L14.178 4.85742C13.6251 5.37234 13.6251 6.26408 14.178 6.779L18.155 10.4828C19.1997 11.4557 20.7936 11.4557 21.8383 10.4828L25.8153 6.779C26.3682 6.26408 26.3682 5.37234 25.8153 4.85743L21.8383 1.15366Z" fill="white"/>
                <defs>
                  <filter id="filter0_dddddd" x="0.00846195" y="4.88513" width="39.9761" height="40.0372" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dy="0.504208"/>
                    <feGaussianBlur stdDeviation="0.215615"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0851008 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dy="1.21168"/>
                    <feGaussianBlur stdDeviation="0.518154"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0729119 0"/>
                    <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dy="2.28149"/>
                    <feGaussianBlur stdDeviation="0.975638"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0530192 0"/>
                    <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dy="4.06979"/>
                    <feGaussianBlur stdDeviation="1.74037"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0381988 0"/>
                    <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dy="7.6121"/>
                    <feGaussianBlur stdDeviation="3.25517"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0435211 0"/>
                    <feBlend mode="normal" in2="effect4_dropShadow" result="effect5_dropShadow"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dy="18.2205"/>
                    <feGaussianBlur stdDeviation="7.79167"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                    <feBlend mode="normal" in2="effect5_dropShadow" result="effect6_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect6_dropShadow" result="shape"/>
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="box"></div>
          </div>
          <div className="front"></div>
          <div className="light"></div>
        </div>
      </div>
    </button>
  );
};

export default DownloadTruckButton;
