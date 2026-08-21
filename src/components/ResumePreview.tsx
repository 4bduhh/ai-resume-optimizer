import { ResumeData } from '@/utils/storage';
import styles from './ResumePreview.module.css';

interface ResumePreviewProps {
  data: Omit<ResumeData, 'id' | 'updatedAt'>;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const { name, contact, summary, experience, education, projects, certifications, skills } = data;

  return (
    <div className={styles.paper}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.name}>{name || 'Your Name'}</h1>
        <div className={styles.contact}>
          {contact?.email && <span>{contact.email}</span>}
          {contact?.phone && <span> • {contact.phone}</span>}
          {contact?.location && <span> • {contact.location}</span>}
        </div>
        <div className={styles.contactLinks}>
          {contact?.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {contact?.portfolio && <a href={contact.portfolio} target="_blank" rel="noreferrer">Portfolio/GitHub</a>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Professional Summary</h2>
          <p className={styles.text}>{summary}</p>
        </section>
      )}

      {/* Experience */}
      {(experience?.length > 0) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.bold}>{exp.role || 'Role Title'}</span>
                <span className={styles.date}>{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</span>
              </div>
              <div className={styles.itemSubHeader}>
                <span className={styles.italic}>{exp.company || 'Company Name'}</span>
                <span className={styles.location}>{exp.location}</span>
              </div>
              {exp.description && (
                <ul className={styles.bulletList}>
                  {exp.description.split('\n').filter(d => d.trim()).map((bullet, i) => (
                    <li key={i}>{bullet.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {(education?.length > 0) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.bold}>{edu.degree || 'Degree / Major'}</span>
                <span className={styles.date}>{edu.graduationYear}</span>
              </div>
              <div className={styles.itemSubHeader}>
                <span className={styles.italic}>{edu.institution || 'Institution Name'}</span>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {(projects?.length > 0) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className={styles.item}>
              <div className={styles.itemHeader}>
                <span>
                  <span className={styles.bold}>{proj.name || 'Project Name'}</span>
                  {proj.techStack && <span className={styles.italic}> | {proj.techStack}</span>}
                </span>
                {proj.link && <span className={styles.link}>{proj.link}</span>}
              </div>
              <p className={styles.text}>{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {(certifications?.length > 0) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Certifications & Awards</h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.bold}>{cert.name || 'Certification Name'}</span>
                <span className={styles.date}>{cert.year}</span>
              </div>
              <div className={styles.itemSubHeader}>
                <span className={styles.italic}>{cert.issuer}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {(skills?.length > 0) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <p className={styles.text}>{skills.join(', ')}</p>
        </section>
      )}
    </div>
  );
}
