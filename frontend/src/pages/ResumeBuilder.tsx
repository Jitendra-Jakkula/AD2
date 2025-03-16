import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import PersonalInfoForm from '../components/resume/PersonalInfoForm';
import EducationForm from '../components/resume/EducationForm';
import ExperienceForm from '../components/resume/ExperienceForm';
import SkillsForm from '../components/resume/SkillsForm';
import CertificationsForm from '../components/resume/CertificationsForm';
import AwardsForm from '../components/resume/AwardsForm';
import ProjectsForm from '../components/resume/ProjectsForm';
import ResumePreview from '../components/resume/ResumePreview';

// Define steps for the resume builder
const steps = [
  'Personal Information', 
  'Education', 
  'Experience', 
  'Skills', 
  'Certifications', 
  'Awards', 
  'Projects', 
  'Preview'
];

// Initial state for a new resume
const initialResumeState = {
  title: 'My Resume',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    summary: '',
  },
  educations: [],
  experiences: [],
  skills: [],
  certifications: [],
  awards: [],
  projects: [],
};

const ResumeBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [resumeData, setResumeData] = useState(initialResumeState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      fetchResumeData();
    }
  }, [id]);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getResumeById(Number(id));
      setResumeData(response.data);
    } catch (err: any) {
      setError('Failed to load resume data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode) {
        await resumeAPI.updateResume(Number(id), resumeData);
        setSuccess('Resume updated successfully!');
      } else {
        const response = await resumeAPI.createResume(resumeData);
        setSuccess('Resume created successfully!');
        // Navigate to edit mode with the new ID
        navigate(`/resume/edit/${response.data.id}`, { replace: true });
      }
      
      // Wait a bit before redirecting to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/dashboard');
    }
  };

  const updateResumeData = (section: string, data: any) => {
    setResumeData((prevData) => ({
      ...prevData,
      [section]: data,
    }));
  };

  // Render the current step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm
            personalInfo={resumeData.personalInfo}
            onUpdate={(data) => updateResumeData('personalInfo', data)}
          />
        );
      case 1:
        return (
          <EducationForm
            educations={resumeData.educations}
            onUpdate={(data) => updateResumeData('educations', data)}
          />
        );
      case 2:
        return (
          <ExperienceForm
            experiences={resumeData.experiences}
            onUpdate={(data) => updateResumeData('experiences', data)}
          />
        );
      case 3:
        return (
          <SkillsForm
            skills={resumeData.skills}
            onUpdate={(data) => updateResumeData('skills', data)}
          />
        );
      case 4:
        return (
          <CertificationsForm
            certifications={resumeData.certifications}
            onUpdate={(data) => updateResumeData('certifications', data)}
          />
        );
      case 5:
        return (
          <AwardsForm
            awards={resumeData.awards}
            onUpdate={(data) => updateResumeData('awards', data)}
          />
        );
      case 6:
        return (
          <ProjectsForm
            projects={resumeData.projects}
            onUpdate={(data) => updateResumeData('projects', data)}
          />
        );
      case 7:
        return <ResumePreview resumeData={resumeData} />;
      default:
        return 'Unknown step';
    }
  };

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Resume' : 'Create New Resume'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, mb: 2 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            color="inherit"
            onClick={handleCancel}
            variant="outlined"
          >
            Cancel
          </Button>
          <Box>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Resume'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeBuilder; 