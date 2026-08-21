'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getSavedResumes, deleteResume, ResumeData,
  getUploadedResumes, deleteUploadedResume, UploadedResumeData
} from '@/utils/storage';
import ResumePreview from '@/components/ResumePreview';
import styles from './saved.module.css';

export default function Profile() {
  const [createdResumes, setCreatedResumes] = useState<ResumeData[]>([]);
  const [uploadedResumes, setUploadedResumes] = useState<UploadedResumeData[]>([]);
  const [previewData, setPreviewData] = useState<ResumeData | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const router = useRouter();

  const loadData = async () => {
    setCreatedResumes(await getSavedResumes());
    setUploadedResumes(await getUploadedResumes());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCreated = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this created resume?')) {
      await deleteResume(id);
      loadData();
    }
  };

  const handleDeleteUploaded = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this uploaded resume?')) {
      await deleteUploadedResume(id);
      loadData();
    }
  };

  const handleAnalyzeCreated = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/?resumeId=${id}&type=created`);
  };

  const handleAnalyzeUploaded = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/?resumeId=${id}&type=uploaded`);
  };

  const openPreviewCreated = (resume: ResumeData) => {
    setPreviewData(resume);
  };

  const openPreviewUploaded = (resume: UploadedResumeData) => {
    const blob = new Blob([resume.fileBlob], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPreviewPdfUrl(url);
  };

  const closePreview = () => {
    setPreviewData(null);
    if (previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl);
      setPreviewPdfUrl(null);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className="heading-1">My Profile</h1>
        <p className="text-lead">Manage your created and uploaded resumes.</p>
        <button className="btn-primary" onClick={() => router.push('/creator')}>
          + Create New Resume
        </button>
      </header>

      <h2 className="heading-2" style={{ marginTop: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        Created Resumes
      </h2>
      {createdResumes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't created any resumes yet.</p>
        </div>
      ) : (
        <div className={styles.grid} style={{ marginTop: '2rem' }}>
          {createdResumes.map((resume) => (
            <div key={resume.id} className="glass-panel" onClick={() => openPreviewCreated(resume)} style={{ cursor: 'pointer' }}>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>{resume.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.9rem', flex: 1 }}
                  onClick={(e) => handleAnalyzeCreated(e, resume.id)}
                >
                  Analyze
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.9rem', borderColor: '#ff7b72', color: '#ff7b72' }}
                  onClick={(e) => handleDeleteCreated(e, resume.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="heading-2" style={{ marginTop: '4rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        Uploaded PDFs
      </h2>
      {uploadedResumes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't uploaded any PDF resumes yet. Use the Optimizer to upload one.</p>
        </div>
      ) : (
        <div className={styles.grid} style={{ marginTop: '2rem' }}>
          {uploadedResumes.map((resume) => (
            <div key={resume.id} className="glass-panel" onClick={() => openPreviewUploaded(resume)} style={{ cursor: 'pointer' }}>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>{resume.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.9rem', flex: 1 }}
                  onClick={(e) => handleAnalyzeUploaded(e, resume.id)}
                >
                  Analyze
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.9rem', borderColor: '#ff7b72', color: '#ff7b72' }}
                  onClick={(e) => handleDeleteUploaded(e, resume.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(previewData || previewPdfUrl) && (
        <div className={styles.modalOverlay} onClick={closePreview}>
          <button className={styles.modalClose} onClick={closePreview}>✕</button>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {previewData && <ResumePreview data={previewData} />}
            {previewPdfUrl && (
              <iframe 
                src={`${previewPdfUrl}#view=FitH`} 
                title="PDF Preview"
                className={styles.pdfPreview}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
