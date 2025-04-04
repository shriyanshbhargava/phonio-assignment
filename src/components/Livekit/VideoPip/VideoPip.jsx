'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import styles from './VideoPip.module.css';

export default function VideoCallPopup({ roomId, username, onClose }) {
  const [token, setToken] = useState('');
  const popupRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPiP, setIsPiP] = useState(false);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [pipWindow, setPipWindow] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const resp = await fetch(`/api/token?room=${roomId}&username=${username}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    };

    fetchToken();
  }, [roomId, username]);

  useEffect(() => {
    if (popupRef.current) {
      updatePopupStyles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, size, isPiP]);

  const updatePopupStyles = () => {
    if (!popupRef.current) return;
    
    popupRef.current.style.left = `${position.x}px`;
    popupRef.current.style.top = `${position.y}px`;
    popupRef.current.style.width = `${size.width}px`;
    popupRef.current.style.height = `${size.height}px`;
  };

  const handleMouseDown = (e) => {
    if (e.target.closest(`.${styles.button}`) || e.target.closest(`.${styles.resizeHandle}`)) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    if (popupRef.current) {
      popupRef.current.style.cursor = 'grabbing';
    }
    
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width));
    const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - size.height));
    
    setPosition({
      x: newX,
      y: newY
    });
  };

  const handleMouseUp = () => {
    if (isDragging && popupRef.current) {
      popupRef.current.style.cursor = 'default';
    }
    setIsDragging(false);
  };

  const handleResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    
    const onMouseMove = (mouseMoveEvent) => {
      const dx = mouseMoveEvent.clientX - startX;
      const dy = mouseMoveEvent.clientY - startY;
      
      if (direction === 'se') {
        setSize({
          width: Math.max(300, startWidth + dx),
          height: Math.max(200, startHeight + dy)
        });
      }
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const togglePiP = async () => {
    if (!isPiP) {
      try {
        if ('documentPictureInPicture' in window) {
          const pipOptions = { width: 320, height: 240 };
          const newPipWindow = await window.documentPictureInPicture.requestWindow(pipOptions);
          setPipWindow(newPipWindow);

          const videoElement = videoContainerRef.current.querySelector('video');
          if (!videoElement) {
            console.error('No video element found');
            return;
          }

          const pipVideo = document.createElement('video');
          pipVideo.autoplay = true;
          pipVideo.srcObject = videoElement.srcObject;
          pipVideo.style.width = '100%';
          pipVideo.style.height = '100%';
          pipVideo.muted = true;

          newPipWindow.document.body.appendChild(pipVideo);
          pipVideo.play();

          newPipWindow.addEventListener('pagehide', () => {
            setIsPiP(false);
            setPipWindow(null);
            pipVideo.remove();
          });

          setIsPiP(true);
        }
      } catch (err) {
        console.error('PiP error:', err);
        setPosition({
          x: window.innerWidth - 320,
          y: window.innerHeight - 240
        });
        setSize({ width: 300, height: 200 });
        setIsPiP(true);
      }
    } else {
      if (pipWindow) pipWindow.close();
      setIsPiP(false);
      setSize({ width: 800, height: 600 });
      setPosition({ 
        x: window.innerWidth / 2 - 400, 
        y: window.innerHeight / 2 - 300 
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newX = Math.min(position.x, window.innerWidth - size.width);
      const newY = Math.min(position.y, window.innerHeight - size.height);
      
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
      
      if (isPiP && !pipWindow) {
        setPosition({
          x: window.innerWidth - 320,
          y: window.innerHeight - 240
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, size, isPiP, pipWindow]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);
  
  useEffect(() => {
    return () => {
      if (pipWindow) {
        pipWindow.close();
      }
    };
  }, [pipWindow]);

  if (!token) {
    return (
      <div 
        ref={popupRef}
        className={styles.container}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`
        }}
      >
        <div 
          className={styles.header}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.title}>Video Call: Room {roomId}</div>
          <div className={styles.controls}>
            <button onClick={onClose} className={styles.button}>✕</button>
          </div>
        </div>
        <div className={styles.loadingState}>Loading call...</div>
      </div>
    );
  }

  return (
    <div 
      ref={popupRef}
      className={`${styles.container} ${isPiP ? styles.pipMode : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
    >
      <div 
        className={styles.header}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.title}>Video Call: Room {roomId}</div>
        <div className={styles.controls}>
          <button 
            onClick={togglePiP}
            className={styles.button}
          >
            {isPiP ? 'Expand' : 'PiP'}
          </button>
          <button 
            onClick={onClose}
            className={styles.button}
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className={styles.videoContainer} ref={videoContainerRef}>
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          onDisconnected={onClose}
        >
          <VideoConferenceComponent />
          <RoomAudioRenderer />
          <ControlBar className={styles.controlBar} />
        </LiveKitRoom>
      </div>
      
      <div 
        className={styles.resizeHandle}
        onMouseDown={(e) => handleResize(e, 'se')}
      ></div>
    </div>
  );
}

function VideoConferenceComponent() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  
  return (
    <GridLayout tracks={tracks} style={{ height: '100%' }}>
      <ParticipantTile className={styles.participantTile} />
    </GridLayout>
  );
}