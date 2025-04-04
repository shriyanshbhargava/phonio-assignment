"use client";

import { useState } from "react";
import { X, RefreshCw } from "lucide-react";
import styles from "./RebuildButton.module.css";

export default function RebuildButton({ initialBuildTime }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [buildDetails, setBuildDetails] = useState({
    status: "idle",
    message: "Page built at",
    buildTime: initialBuildTime
  });

  const handleRebuild = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/revalidate", { method: "GET" });
      const data = await response.json();
      
      if (response.ok) {
        setBuildDetails({
          status: "success",
          message: data.message || "Page rebuilt successfully",
          buildTime: data.metadata?.timestamp || new Date().toISOString()
        });
      } else {
        throw new Error(data.error?.message || "Failed to rebuild page");
      }
    } catch (error) {
      console.error("Rebuild error:", error);
      setBuildDetails({
        status: "error",
        message: "Rebuild failed",
        buildTime: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Floating Rebuild Button */}
      <button
        onClick={handleRebuild}
        disabled={isLoading}
        className={styles.rebuildButton}
      >
        {isLoading ? (
          <>
            <RefreshCw className={styles.spinIcon} size={18} />
            <span>Rebuilding...</span>
          </>
        ) : (
          <>
            <RefreshCw size={18} />
            <span>Rebuild Page</span>
          </>
        )}
      </button>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button 
              onClick={() => setShowModal(false)}
              className={styles.closeButton}
            >
              <X size={20} />
            </button>
            
            <h3 className={styles.modalTitle}>Build Status</h3>
            
            <div className={styles.statusContainer}>
              <div className={`${styles.statusIndicator} ${buildDetails.status === "success" ? styles.successStatus : 
                buildDetails.status === "error" ? styles.errorStatus : ""}`}>
                {buildDetails.status === "success" ? "Success" : 
                 buildDetails.status === "error" ? "Failed" : "Status"}
              </div>
              
              <div className={styles.buildTime}>
                <span className={styles.buildLabel}>Last Build:</span>
                <span className={styles.buildValue}>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  }).format(new Date(buildDetails.buildTime))}
                </span>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                onClick={() => setShowModal(false)} 
                className={styles.cancelButton}
              >
                Close
              </button>
              <button 
                onClick={handleRebuild} 
                className={styles.joinButton}
                disabled={isLoading}
              >
                {isLoading ? "Rebuilding..." : "Rebuild Again"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}