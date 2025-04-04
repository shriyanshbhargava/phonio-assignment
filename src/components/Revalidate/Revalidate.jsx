"use client"
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import styles from './Revalidate.module.css';

const Revalidate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRevalidationData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/revalidate');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch revalidation data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevalidationData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Revalidation Dashboard</h1>
        <button 
          onClick={fetchRevalidationData}
          disabled={loading}
          className={styles.revalidateButton}
        >
          <RefreshCw className={`${styles.icon} ${loading ? styles.spin : ''}`} />
          Revalidate
        </button>
      </div>

      {loading && (
        <div className={styles.loadingBox}>
          <RefreshCw className={`${styles.loadingIcon} ${styles.spin}`} />
          <p className={styles.loadingText}>Processing revalidation...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorAlert}>
          <div className={styles.alertContent}>
            <AlertCircle className={styles.errorIcon} />
            <p className={styles.errorText}>{error}</p>
          </div>
        </div>
      )}

      {data && !loading && (
        <div className={styles.resultCard}>
          <div className={data.status === 'success' ? styles.successHeader : styles.errorHeader}>
            <div className={styles.statusRow}>
              {data.status === 'success' ? (
                <CheckCircle className={styles.successIcon} />
              ) : (
                <AlertCircle className={styles.errorIcon} />
              )}
              <span className={styles.statusLabel}>
                Status: <span className={data.status === 'success' ? styles.successText : styles.errorText}>{data.status}</span>
              </span>
            </div>
            <p className={styles.message}>{data.message}</p>
          </div>

          <div className={styles.metadataSection}>
            <h2 className={styles.metadataTitle}>Metadata</h2>
            <div className={styles.metadataList}>
              <div className={styles.metadataItem}>
                <Clock className={styles.metadataIcon} />
                <span className={styles.metadataLabel}>Timestamp:</span>
                <span className={styles.metadataValue}>{new Date(data.metadata?.timestamp).toLocaleString()}</span>
              </div>
              
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Request ID:</span>
                <code className={styles.codeBlock}>{data.metadata?.requestId}</code>
              </div>
              
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Execution Time:</span>
                <span className={styles.metadataValue}>{data.metadata?.executionTimeMs} ms</span>
              </div>
              
              {data.metadata?.revalidatedPaths && (
                <div className={styles.pathsSection}>
                  <p className={styles.pathsLabel}>Revalidated Paths:</p>
                  <div className={styles.pathsList}>
                    {data.metadata.revalidatedPaths.map((path, index) => (
                      <code key={index} className={styles.pathItem}>{path}</code>
                    ))}
                  </div>
                </div>
              )}
              
              {data.error && (
                <div className={styles.errorDetails}>
                  <p className={styles.errorName}>{data.error.name}</p>
                  <p className={styles.errorMessage}>{data.error.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revalidate;