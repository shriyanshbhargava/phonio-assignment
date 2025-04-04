'use client';

import { useState } from 'react';
import styles from './JoinButton.module.css';
import VideoCallPopup from '../VideoPip/VideoPip';

export default function JoinCallButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('user');
  const [roomId, setRoomId] = useState(`room-${Math.floor(Math.random() * 10000)}`);

  const handleJoinCall = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const checkResp = await fetch(`/api/check-room?room=${roomId}`);
      const checkData = await checkResp.json();

      if (!checkData.exists) {
        alert('Room does not exist.');
        return;
      }

      setShowPopup(true);
      setShowForm(false);
    } catch (e) {
      alert('An error occurred while checking the room.');
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeModal = () => {
    setShowForm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className={styles.callButton}
      >
        Join Call
      </button>
      
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2 className={styles.modalTitle}>Agent Video Call</h2>
            <form onSubmit={handleJoinCall}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Name:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Room ID:</label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.joinButton}
                >
                  Join Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showPopup && (
        <VideoCallPopup
          roomId={roomId}
          username={username}
          onClose={closePopup}
        />
      )}
    </>
  );
}