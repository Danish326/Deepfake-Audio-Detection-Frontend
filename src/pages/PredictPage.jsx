import { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import PredictionResult from '../components/PredictionResult';

const ALLOWED_TYPES = ['.wav', '.mp3', '.flac'];
const MAX_SIZE_MB = 20;

const PROCESSING_STEPS = [
  "Extracting Mel-Spectrograms",
  "Extracting LFCC",
  "Ensembling result",
  "Finalizing"
];
const STEP_DELAY_MS = 2000;

export default function PredictPage() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isAdvancedUser, setIsAdvancedUser] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user?.is_staff || user?.is_superuser) {
      setIsAdvancedUser(true);
      return;
    }
    api.getQuotaStatus()
      .then(quota => {
        if (quota?.plan?.name && quota.plan.name !== 'free') {
          setIsAdvancedUser(true);
        }
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!loading || !isAdvancedUser) {
      setCurrentStep(0);
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, STEP_DELAY_MS);

    return () => clearInterval(interval);
  }, [loading, isAdvancedUser]);

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      setError(`Unsupported file type "${ext}". Allowed: ${ALLOWED_TYPES.join(', ')}`);
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_SIZE_MB} MB limit.`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (f) => {
    setError('');
    setResult(null);
    if (f && validateFile(f)) {
      setFile(f);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setError('');
    setLoading(true);
    setCurrentStep(0);
    try {
      const apiPromise = api.predictAudio(file);
      const delayPromise = isAdvancedUser 
        ? new Promise(res => setTimeout(res, PROCESSING_STEPS.length * STEP_DELAY_MS))
        : Promise.resolve();
        
      const [data] = await Promise.all([apiPromise, delayPromise]);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError('');
    setCurrentStep(0);
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Analyze Audio</h1>
        <p>Upload an audio file to detect deepfake manipulation</p>
      </div>

      {!result ? (
        (loading && isAdvancedUser) ? (
          <div className="card processing-box fade-in" style={{ padding: '40px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Analyzing Audio File</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Please wait while our models process your upload...</p>
            </div>
            
            <div className="processing-steps-container">
              {PROCESSING_STEPS.map((step, index) => {
                let statusClass = 'pending';
                if (index < currentStep) statusClass = 'completed';
                else if (index === currentStep) statusClass = 'processing';
                
                return (
                  <div key={step} className={`processing-step ${statusClass}`}>
                    <div className="step-indicator">
                      {statusClass === 'completed' && '✓'}
                      {statusClass === 'processing' && <div className="spinner step-spinner" />}
                      {statusClass === 'pending' && <div className="dot" />}
                    </div>
                    <div className="step-label">{step}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 32 }}>
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="upload-icon">🎙️</div>
              <h3>Drop your audio file here</h3>
              <p>or click to browse files</p>
              <div className="file-types">.wav · .mp3 · .flac — max {MAX_SIZE_MB} MB</div>
              <input
                ref={inputRef}
                type="file"
                accept=".wav,.mp3,.flac"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>

            {file && (
              <div className="selected-file">
                <div className="file-icon">🎵</div>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
                <button className="remove-file" onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>
              </div>
            )}

            {error && <div className="auth-error" style={{ marginTop: 20 }}>{error}</div>}

            {file && (
              <button
                className="btn btn-primary btn-full"
                style={{ marginTop: 24, transition: 'all 0.3s ease' }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" /> Analyzing with 8 models...</>
                ) : (
                  '🔍 Analyze Audio'
                )}
              </button>
            )}
          </div>
        )
      ) : (
        <>
          <PredictionResult result={result} />
          <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={resetForm}>
            ← Analyze Another File
          </button>
        </>
      )}
    </div>
  );
}
