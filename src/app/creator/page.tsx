'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeData, saveResume } from '@/utils/storage';
import ResumePreview from '@/components/ResumePreview';
import styles from './creator.module.css';

export default function Creator() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<ResumeData, 'id' | 'updatedAt'>>({
    name: '',
    contact: { email: '', phone: '', location: '', linkedin: '', portfolio: '' },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    skills: []
  });

  const [currentSkill, setCurrentSkill] = useState('');

  const handleSave = async () => {
    if (!formData.name) {
      alert('Please enter at least a name for your resume.');
      return;
    }
    await saveResume(formData);
    router.push('/profile');
  };

  const updateContact = (field: keyof typeof formData.contact, value: string) => {
    setFormData({ ...formData, contact: { ...formData.contact, [field]: value } });
  };

  // --- Experience ---
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', role: '', startDate: '', endDate: '', location: '', description: '' }]
    });
  };

  const updateExperience = (index: number, field: keyof typeof formData.experience[0], value: string) => {
    const newExp = [...formData.experience];
    newExp[index][field] = value;
    setFormData({ ...formData, experience: newExp });
  };

  const removeExperience = (index: number) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
  };

  // --- Education ---
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', graduationYear: '', gpa: '' }]
    });
  };

  const updateEducation = (index: number, field: keyof typeof formData.education[0], value: string) => {
    const newEdu = [...formData.education];
    newEdu[index][field] = value;
    setFormData({ ...formData, education: newEdu });
  };

  const removeEducation = (index: number) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  // --- Projects ---
  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', techStack: '', description: '', link: '' }]
    });
  };

  const updateProject = (index: number, field: keyof typeof formData.projects[0], value: string) => {
    const newProj = [...formData.projects];
    newProj[index][field] = value;
    setFormData({ ...formData, projects: newProj });
  };

  const removeProject = (index: number) => {
    setFormData({ ...formData, projects: formData.projects.filter((_, i) => i !== index) });
  };

  // --- Certifications ---
  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: '', issuer: '', year: '' }]
    });
  };

  const updateCertification = (index: number, field: keyof typeof formData.certifications[0], value: string) => {
    const newCert = [...formData.certifications];
    newCert[index][field] = value;
    setFormData({ ...formData, certifications: newCert });
  };

  const removeCertification = (index: number) => {
    setFormData({ ...formData, certifications: formData.certifications.filter((_, i) => i !== index) });
  };

  // --- Skills ---
  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, currentSkill.trim()] });
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="heading-1">Resume Creator</h1>
          <p className="text-lead">Build a comprehensive professional profile.</p>
        </div>
        <button className="btn-primary" onClick={handleSave}>Save Resume</button>
      </header>

      <div className={styles.splitLayout}>
        <div className={styles.editorPane}>
          {/* Personal Details */}
        <section className="glass-panel">
          <h2 className="heading-2">Personal Details</h2>
          <div className="input-group">
            <label>Full Name / Title</label>
            <input 
              className="input-field" 
              placeholder="e.g. John Doe - Software Engineer" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input className="input-field" value={formData.contact.email} onChange={(e) => updateContact('email', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input className="input-field" value={formData.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Location (City, State)</label>
            <input className="input-field" value={formData.contact.location} onChange={(e) => updateContact('location', e.target.value)} />
          </div>
          <div className="input-group">
            <label>LinkedIn URL</label>
            <input className="input-field" value={formData.contact.linkedin} onChange={(e) => updateContact('linkedin', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Portfolio / GitHub URL</label>
            <input className="input-field" value={formData.contact.portfolio} onChange={(e) => updateContact('portfolio', e.target.value)} />
          </div>
        </section>

        {/* Professional Summary */}
        <section className="glass-panel">
          <h2 className="heading-2">Professional Summary</h2>
          <textarea 
            className="input-field" 
            rows={5}
            placeholder="A brief overview of your background and goals..."
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
          />
        </section>

        {/* Experience */}
        <section className="glass-panel" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="heading-2" style={{ marginBottom: 0 }}>Experience</h2>
            <button className="btn-secondary" onClick={addExperience} style={{ padding: '4px 12px', fontSize: '0.9rem' }}>+ Add Role</button>
          </div>
          
          {formData.experience.map((exp, index) => (
            <div key={index} className={styles.dynamicRow}>
              <button className={styles.removeBtn} onClick={() => removeExperience(index)}>✕</button>
              <div className="input-group">
                <label>Company</label>
                <input className="input-field" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Role</label>
                <input className="input-field" value={exp.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Start Date</label>
                  <input className="input-field" value={exp.startDate} onChange={(e) => updateExperience(index, 'startDate', e.target.value)} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>End Date</label>
                  <input className="input-field" value={exp.endDate} onChange={(e) => updateExperience(index, 'endDate', e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Location</label>
                <input className="input-field" value={exp.location} onChange={(e) => updateExperience(index, 'location', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Description (Use bullet points)</label>
                <textarea className="input-field" rows={3} value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} />
              </div>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="heading-2" style={{ marginBottom: 0 }}>Education</h2>
            <button className="btn-secondary" onClick={addEducation} style={{ padding: '4px 12px', fontSize: '0.9rem' }}>+ Add</button>
          </div>
          
          {formData.education.map((edu, index) => (
            <div key={index} className={styles.dynamicRow}>
              <button className={styles.removeBtn} onClick={() => removeEducation(index)}>✕</button>
              <div className="input-group">
                <label>Institution</label>
                <input className="input-field" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Degree / Major</label>
                <input className="input-field" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Grad Year</label>
                  <input className="input-field" value={edu.graduationYear} onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>GPA (Optional)</label>
                  <input className="input-field" value={edu.gpa} onChange={(e) => updateEducation(index, 'gpa', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="heading-2" style={{ marginBottom: 0 }}>Projects</h2>
            <button className="btn-secondary" onClick={addProject} style={{ padding: '4px 12px', fontSize: '0.9rem' }}>+ Add</button>
          </div>
          
          {formData.projects.map((proj, index) => (
            <div key={index} className={styles.dynamicRow}>
              <button className={styles.removeBtn} onClick={() => removeProject(index)}>✕</button>
              <div className="input-group">
                <label>Project Name</label>
                <input className="input-field" value={proj.name} onChange={(e) => updateProject(index, 'name', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Tech Stack</label>
                <input className="input-field" value={proj.techStack} onChange={(e) => updateProject(index, 'techStack', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Link (URL)</label>
                <input className="input-field" value={proj.link} onChange={(e) => updateProject(index, 'link', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input-field" rows={2} value={proj.description} onChange={(e) => updateProject(index, 'description', e.target.value)} />
              </div>
            </div>
          ))}
        </section>

        {/* Certifications */}
        <section className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="heading-2" style={{ marginBottom: 0 }}>Certifications</h2>
            <button className="btn-secondary" onClick={addCertification} style={{ padding: '4px 12px', fontSize: '0.9rem' }}>+ Add</button>
          </div>
          
          {formData.certifications.map((cert, index) => (
            <div key={index} className={styles.dynamicRow}>
              <button className={styles.removeBtn} onClick={() => removeCertification(index)}>✕</button>
              <div className="input-group">
                <label>Name</label>
                <input className="input-field" value={cert.name} onChange={(e) => updateCertification(index, 'name', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Issuing Organization</label>
                <input className="input-field" value={cert.issuer} onChange={(e) => updateCertification(index, 'issuer', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Year</label>
                <input className="input-field" value={cert.year} onChange={(e) => updateCertification(index, 'year', e.target.value)} />
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 className="heading-2">Skills</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              className="input-field" 
              placeholder="e.g. React, Node.js" 
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <button className="btn-secondary" onClick={addSkill}>Add</button>
          </div>
          <div className={styles.skillTags}>
            {formData.skills.map(skill => (
              <span key={skill} className={styles.tag}>
                {skill}
                <button onClick={() => removeSkill(skill)}>&times;</button>
              </span>
            ))}
          </div>
        </section>
        </div>

        <div className={styles.previewPane}>
          <ResumePreview data={formData} />
        </div>
      </div>
    </main>
  );
}
