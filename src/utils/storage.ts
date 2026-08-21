import localforage from 'localforage';

export interface ResumeData {
  id: string;
  name: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    graduationYear: string;
    gpa: string;
  }[];
  projects: {
    name: string;
    techStack: string;
    description: string;
    link: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
  }[];
  skills: string[];
  updatedAt: string;
}

export interface UploadedResumeData {
  id: string;
  name: string;
  fileBlob: Blob; // Raw PDF
  extractedText?: string;
  updatedAt: string;
}

// Separate stores
const createdStore = localforage.createInstance({
  name: 'ResumeOptimizer',
  storeName: 'created_resumes'
});

const uploadedStore = localforage.createInstance({
  name: 'ResumeOptimizer',
  storeName: 'uploaded_resumes'
});

// --- Created Resumes (Creator Flow) ---

export const getSavedResumes = async (): Promise<ResumeData[]> => {
  const keys = await createdStore.keys();
  const resumes: ResumeData[] = [];
  for (const key of keys) {
    const item = await createdStore.getItem<ResumeData>(key);
    if (item) resumes.push(item);
  }
  return resumes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const saveResume = async (resume: Omit<ResumeData, 'id' | 'updatedAt'> & { id?: string }) => {
  const newResume: ResumeData = {
    ...resume,
    id: resume.id || crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  };
  await createdStore.setItem(newResume.id, newResume);
  return newResume;
};

export const deleteResume = async (id: string) => {
  await createdStore.removeItem(id);
};

export const getResumeById = async (id: string): Promise<ResumeData | null> => {
  return await createdStore.getItem<ResumeData>(id);
};


// --- Uploaded Resumes (PDFs) ---

export const getUploadedResumes = async (): Promise<UploadedResumeData[]> => {
  const keys = await uploadedStore.keys();
  const resumes: UploadedResumeData[] = [];
  for (const key of keys) {
    const item = await uploadedStore.getItem<UploadedResumeData>(key);
    if (item) resumes.push(item);
  }
  return resumes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const saveUploadedResume = async (file: File, extractedText?: string) => {
  const id = crypto.randomUUID();
  const newUpload: UploadedResumeData = {
    id,
    name: file.name,
    fileBlob: file,
    extractedText,
    updatedAt: new Date().toISOString(),
  };
  await uploadedStore.setItem(id, newUpload);
  return newUpload;
};

export const deleteUploadedResume = async (id: string) => {
  await uploadedStore.removeItem(id);
};

export const getUploadedResumeById = async (id: string): Promise<UploadedResumeData | null> => {
  return await uploadedStore.getItem<UploadedResumeData>(id);
};
