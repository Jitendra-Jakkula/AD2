import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon, Print as PrintIcon } from '@mui/icons-material';

// Add global styles for printing
const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    .resume-container {
      box-shadow: none !important;
      padding: 20px !important;
      margin: 0 !important;
    }
    body {
      background-color: white !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    /* Make sure content is visible */
    .MuiPaper-root {
      display: block !important;
      page-break-inside: avoid;
    }
    /* Ensure text is visible */
    * {
      color: black !important;
      print-color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
    }
  }
`;

interface Resume {
  id: number;
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    summary: string;
  };
  educations: Array<{
    id: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
    location: string;
    description: string;
  }>;
  experiences: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startYear: string;
    endYear: string;
    currentJob: boolean;
    description: string;
  }>;
  skills: Array<{
    id: number;
    name: string;
    level: string;
  }>;
  certifications?: Array<{
    id: number;
    name: string;
    issuer: string;
    date: string;
    description: string;
  }>;
  awards?: Array<{
    id: number;
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
  projects?: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startYear: string;
    endYear: string;
  }>;
}

const ResumeView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResumeData();
  }, [id]);

  // Add print styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = printStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getResumeById(Number(id));
      setResume(response.data);
    } catch (err: any) {
      setError('Failed to load resume data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/resume/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handlePrint = () => {
    // Use the browser's print functionality
    window.print();
  };

  const formatYear = (year: string) => {
    if (!year) return '';
    return year;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !resume) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Resume not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }} className="no-print">
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Box>
          <Button startIcon={<EditIcon />} onClick={handleEdit} sx={{ mr: 1 }}>
            Edit
          </Button>
          <Button startIcon={<PrintIcon />} onClick={handlePrint} variant="contained">
            Print
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 4 }} className="resume-container" id="resume-to-print">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {resume.personalInfo.fullName}
          </Typography>
          <Typography variant="body1">
            {[
              resume.personalInfo.city,
              resume.personalInfo.state,
              resume.personalInfo.country,
            ]
              .filter(Boolean)
              .join(', ')}
          </Typography>
          <Typography variant="body1">
            {resume.personalInfo.email} | {resume.personalInfo.phone}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {resume.personalInfo.linkedinUrl && (
              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                LinkedIn: {resume.personalInfo.linkedinUrl}
              </Typography>
            )}
            {resume.personalInfo.githubUrl && (
              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                GitHub: {resume.personalInfo.githubUrl}
              </Typography>
            )}
            {resume.personalInfo.portfolioUrl && (
              <Typography variant="body2" component="span">
                Portfolio: {resume.personalInfo.portfolioUrl}
              </Typography>
            )}
          </Box>
        </Box>

        {resume.personalInfo.summary && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Professional Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">{resume.personalInfo.summary}</Typography>
          </Box>
        )}

        {resume.experiences.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Work Experience
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resume.experiences.map((exp) => (
              <Box key={exp.id} sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {exp.position}
                    </Typography>
                    <Typography variant="subtitle2">{exp.company}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">
                      {formatYear(exp.startYear)} - {exp.currentJob ? 'Present' : formatYear(exp.endYear)}
                    </Typography>
                    <Typography variant="body2">{exp.location}</Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {resume.educations.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resume.educations.map((edu) => (
              <Box key={edu.id} sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </Typography>
                    <Typography variant="subtitle2">{edu.institution}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">
                      {formatYear(edu.startYear)} - {formatYear(edu.endYear)}
                    </Typography>
                    <Typography variant="body2">{edu.location}</Typography>
                  </Grid>
                </Grid>
                {edu.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {edu.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {resume.certifications && resume.certifications.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Certifications & Training
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resume.certifications.map((cert) => (
              <Box key={cert.id} sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {cert.name}
                    </Typography>
                    <Typography variant="subtitle2">{cert.issuer}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">{cert.date}</Typography>
                  </Grid>
                </Grid>
                {cert.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {cert.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {resume.awards && resume.awards.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Awards & Achievements
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resume.awards.map((award) => (
              <Box key={award.id} sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {award.title}
                    </Typography>
                    <Typography variant="subtitle2">{award.issuer}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">{award.date}</Typography>
                  </Grid>
                </Grid>
                {award.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {award.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resume.projects.map((project) => (
              <Box key={project.id} sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {project.name}
                    </Typography>
                    <Typography variant="subtitle2">Technologies: {project.technologies}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">
                      {formatYear(project.startYear)} - {formatYear(project.endYear)}
                    </Typography>
                    {project.link && (
                      <Typography variant="body2">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          Project Link
                        </a>
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {project.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {resume.skills.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {resume.skills.map((skill) => (
                <Grid item key={skill.id}>
                  <Typography variant="body2">
                    {skill.name} {skill.level && `(${skill.level})`}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResumeView; 