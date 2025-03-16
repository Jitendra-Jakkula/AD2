import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  Grid,
  Button,
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';

interface PersonalInfo {
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
}

interface Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  location: string;
  description: string;
}

interface Experience {
  id?: number;
  company: string;
  position: string;
  location: string;
  startYear: string;
  endYear: string;
  currentJob: boolean;
  description: string;
}

interface Skill {
  id?: number;
  name: string;
  level: string;
}

interface Certification {
  id?: number;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

interface Award {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

interface Project {
  id?: number;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startYear: string;
  endYear: string;
}

interface ResumeData {
  title: string;
  personalInfo: PersonalInfo;
  educations: Education[];
  experiences: Experience[];
  skills: Skill[];
  certifications?: Certification[];
  awards?: Award[];
  projects?: Project[];
}

interface ResumePreviewProps {
  resumeData: ResumeData;
}

// Add global styles for printing
const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    .resume-container {
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    body {
      background-color: white !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    html, body {
      height: 100% !important;
      overflow: hidden !important;
    }
    /* Hide all other elements on the page */
    body > *:not(.resume-print-container) {
      display: none !important;
    }
    /* Ensure the resume takes up the full page */
    .resume-print-container {
      width: 100% !important;
      height: 100% !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  }
`;

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  const { personalInfo, educations, experiences, skills, certifications, awards, projects } = resumeData;

  // Add print styles to document head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = printStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePrint = () => {
    // Add a class to the body for print styling
    document.body.classList.add('printing-resume');
    // Wrap the current component in a div with the print container class
    const resumeContainer = document.querySelector('.resume-container');
    if (resumeContainer) {
      resumeContainer.classList.add('resume-print-container');
    }
    
    window.print();
    
    // Remove the class after printing
    document.body.classList.remove('printing-resume');
    if (resumeContainer) {
      resumeContainer.classList.remove('resume-print-container');
    }
  };

  const formatYear = (year: string) => {
    if (!year) return '';
    return year;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
        <Typography variant="h6">Resume Preview</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>

      <Paper sx={{ p: 4 }} className="resume-container">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {personalInfo.fullName}
          </Typography>
          <Typography variant="body1">
            {[
              personalInfo.city,
              personalInfo.state,
              personalInfo.country,
            ]
              .filter(Boolean)
              .join(', ')}
          </Typography>
          <Typography variant="body1">
            {personalInfo.email} | {personalInfo.phone}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {personalInfo.linkedinUrl && (
              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                LinkedIn: {personalInfo.linkedinUrl}
              </Typography>
            )}
            {personalInfo.githubUrl && (
              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                GitHub: {personalInfo.githubUrl}
              </Typography>
            )}
            {personalInfo.portfolioUrl && (
              <Typography variant="body2" component="span">
                Portfolio: {personalInfo.portfolioUrl}
              </Typography>
            )}
          </Box>
        </Box>

        {personalInfo.summary && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Professional Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">{personalInfo.summary}</Typography>
          </Box>
        )}

        {experiences.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Work Experience
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {experiences.map((exp) => (
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

        {educations.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {educations.map((edu) => (
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

        {certifications && certifications.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Certifications & Training
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {certifications.map((cert) => (
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

        {awards && awards.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Awards & Achievements
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {awards.map((award) => (
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

        {projects && projects.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {projects.map((project) => (
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

        {skills.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {skills.map((skill) => (
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
    </Box>
  );
};

export default ResumePreview; 