 'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSavedResumes, ResumeData } from '@/utils/storage';
import styles from './page.module.css';

function OptimizerContent() {
  const searchParams = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ score: number; suggestions: string[]; missingKeywords: string[] } | null>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      const { getUploadedResumes } = await import('@/utils/storage');
      const createdResumes = await getSavedResumes();
      const uploadedResumes = await getUploadedResumes();
      
      // Combine them for the dropdown
      const combined = [
        ...createdResumes.map(r => ({ id: r.id, name: r.name, type: 'created' })),
        ...uploadedResumes.map(r => ({ id: r.id, name: r.name, type: 'uploaded' }))
      ];
      
      // Store in a simplified generic array for the dropdown UI
      setSavedResumes(combined as any);
      
      const resumeId = searchParams.get('resumeId');
      if (resumeId && combined.some(r => r.id === resumeId)) {
        setSelectedResumeId(resumeId);
      }
    };
    fetchResumes();
  }, [searchParams]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setSelectedResumeId(''); // Clear selection if file is uploaded
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if ((!file && !selectedResumeId) || !jobDescription) {
      alert('Please provide both a resume (PDF or Saved) and a job description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      let resumeText = '';

      if (file) {
        // Uploaded a new PDF
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/extract-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to parse PDF');
        
        const data = await res.json();
        resumeText = data.text;
        
        // Save the uploaded resume to IndexedDB
        await import('@/utils/storage').then(mod => mod.saveUploadedResume(file, resumeText));

      } else if (selectedResumeId) {
        // Find if it's an uploaded or created resume
        const { getResumeById, getUploadedResumeById } = await import('@/utils/storage');
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        if (type === 'uploaded') {
          const uploaded = await getUploadedResumeById(selectedResumeId);
          if (uploaded && uploaded.extractedText) {
            resumeText = uploaded.extractedText;
          } else {
             throw new Error('Could not find extracted text for uploaded resume');
          }
        } else {
          // Default: Created Resume
          const created = await getResumeById(selectedResumeId);
          if (created) {
            // Construct a text representation for keyword matching
            resumeText = `
              ${created.name} ${created.contact.email} ${created.contact.location} ${created.summary}
              ${created.experience.map(e => `${e.role} ${e.company} ${e.description}`).join(' ')}
              ${created.education.map(e => `${e.degree} ${e.institution}`).join(' ')}
              ${created.projects.map(p => `${p.name} ${p.techStack} ${p.description}`).join(' ')}
              ${created.certifications.map(c => `${c.name} ${c.issuer}`).join(' ')}
              ${created.skills.join(' ')}
            `;
          } else {
            // Fallback check uploaded store if type wasn't explicitly provided but we know it exists
            const uploaded = await getUploadedResumeById(selectedResumeId);
            if (uploaded && uploaded.extractedText) {
              resumeText = uploaded.extractedText;
            }
          }
        }
      }

      if (!resumeText) {
        throw new Error('No resume text available for analysis');
      }

      const { calculateAtsScore } = await import('@/utils/atsScorer');
      const atsResult = calculateAtsScore(resumeText, jobDescription);
      
      setResults(atsResult);
      
    } catch (err) {
      console.error(err);
      alert('An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className={styles.container}>
      <header className={`${styles.header} animate-fade-in`}>
        <h1 className="heading-1">AI Resume Optimizer</h1>
        <p className="text-lead">
          Upload your resume and the job description. Our AI will analyze the match and provide actionable feedback to help you land the interview.
        </p>
      </header>

      <div className={`${styles.mainGrid} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
        {/* Upload Section */}
        <section className={`glass-panel ${styles.actionSection}`}>
          <h2 className="heading-2">1. Upload or Select Resume</h2>
          
          {savedResumes.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Select a saved resume:</label>
              <select 
                className="input-field"
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  setFile(null); // Clear file if selecting from saved
                }}
              >
                <option value="">-- Choose from saved --</option>
                {savedResumes.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>OR</div>

          <div 
            className={`${styles.uploadArea} ${file ? styles.active : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className={styles.uploadIcon}>📄</div>
            {file ? (
              <h3 className="heading-3">{file.name}</h3>
            ) : (
              <>
                <h3 className="heading-3">Drag & Drop your PDF here</h3>
                <p style={{ color: 'var(--text-secondary)' }}>or click to browse</p>
              </>
            )}
            <input 
              id="file-upload" 
              type="file" 
              accept=".pdf" 
              style={{ display: 'none' }}
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setSelectedResumeId('');
              }}
            />
          </div>
        </section>

        {/* Job Description Section */}
        <section className={`glass-panel ${styles.actionSection}`}>
          <h2 className="heading-2">2. Target Job Description</h2>
          <textarea
            className="textarea-field"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </section>
      </div>

      <div className={`${styles.submitBtnContainer} animate-fade-in`} style={{ animationDelay: '0.4s' }}>
        <button 
          className="btn-primary" 
          style={{ fontSize: '1.25rem', padding: '16px 48px' }}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <section className={`${styles.resultsArea} glass-panel`}>
          <h2 className="heading-1" style={{ textAlign: 'center', fontSize: '2.5rem' }}>ATS Score</h2>
          
          <div className={styles.scoreCircle} style={{ '--score': `${results.score}%` } as React.CSSProperties}>
            <span className={styles.scoreText}>{results.score}%</span>
          </div>
          
          <div className={styles.mainGrid} style={{ marginTop: '3rem' }}>
            <div>
              <h3 className="heading-2" style={{ color: '#ff7b72' }}>Missing Keywords</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Include these keywords from the job description to improve your ATS score.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {results.missingKeywords.map((kw, i) => (
                  <span key={i} style={{ background: 'rgba(255, 123, 114, 0.1)', color: '#ff7b72', padding: '4px 12px', borderRadius: '16px', fontSize: '0.9rem' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="heading-2" style={{ color: 'var(--accent-color)' }}>Actionable Suggestions</h3>
              <ul className={styles.suggestionsList}>
                {results.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>}>
      <OptimizerContent />
    </Suspense>
  );
}
