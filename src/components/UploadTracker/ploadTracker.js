import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UploadTracker.css';

const UploadTracker = ({ uploads = [] }) => {
  const [expanded, setExpanded] = useState(true);

  const totalProgress = uploads.reduce((acc, curr) => acc + curr.progress, 0) / uploads.length;

  return (
    <AnimatePresence>
      {uploads.length > 0 && (
        <motion.div
          className="upload-tracker"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
        >
          <div className="tracker-header" onClick={() => setExpanded(!expanded)}>
            <div className="overall-progress">
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  animate={{ width: `${totalProgress}%` }}
                />
              </div>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <button className="toggle-btn">
              {expanded ? '▼' : '▲'}
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                className="upload-list"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
              >
                {uploads.map(upload => (
                  <div key={upload.id} className="upload-item">
                    <div className="upload-info">
                      <span className="filename">{upload.filename}</span>
                      <span className="status">{upload.status}</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        animate={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadTracker;