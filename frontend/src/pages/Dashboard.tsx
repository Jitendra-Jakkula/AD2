import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { resumeAPI } from '../services/api';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Speed as SpeedIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

interface Resume {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const response = await resumeAPI.getAllResumes();
        setResumes(response.data);
      } catch (err: any) {
        setError('Failed to load resumes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleCreateResume = () => {
    navigate('/resume/new');
  };

  const handleEditResume = (id: number) => {
    navigate(`/resume/edit/${id}`);
  };

  const handleViewResume = (id: number) => {
    navigate(`/resume/${id}`);
  };

  const handleDeleteResume = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeAPI.deleteResume(id);
        setResumes(resumes.filter(resume => resume.id !== id));
      } catch (err: any) {
        setError('Failed to delete resume');
        console.error(err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Dashboard information content
  const renderWelcomeSection = () => (
    <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f5f9ff' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Welcome to Your Professional Resume Builder
      </Typography>
      <Typography variant="body1" paragraph>
        Create standout resumes that help you land your dream job. Our easy-to-use platform helps you build, manage, and export professional resumes tailored to your career goals.
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <DescriptionIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Professional Templates</Typography>
            <Typography variant="body2">Choose from industry-approved designs</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <SpeedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Quick & Easy</Typography>
            <Typography variant="body2">Build your resume in minutes</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">ATS Optimized</Typography>
            <Typography variant="body2">Pass through applicant tracking systems</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <LightbulbIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Expert Tips</Typography>
            <Typography variant="body2">Get guidance every step of the way</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderEmptyState = () => (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <DescriptionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          You don't have any resumes yet
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Get started by creating your first professional resume. Our step-by-step process makes it easy to showcase your skills and experience.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreateResume}
          sx={{ mt: 2 }}
        >
          Create Your First Resume
        </Button>
        
        <Box sx={{ mt: 6, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            Why Create a Resume with Us?
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Stand Out to Employers" 
                secondary="Our professionally designed templates help you make a strong first impression" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Tailored for Each Application" 
                secondary="Easily customize your resume for different positions to increase your chances" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Export in Multiple Formats" 
                secondary="Download as PDF, DOCX, or share a direct link to your online resume" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Track Your Applications" 
                secondary="Keep all your career documents organized in one place" 
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Resumes
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateResume}
          >
            Create New Resume
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={logout}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {renderWelcomeSection()}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : resumes.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
              Your Resumes
            </Typography>
            
            <Grid container spacing={3}>
              {resumes.map((resume) => (
                <Grid item xs={12} sm={6} md={4} key={resume.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
                      <Typography variant="h6" component="div" noWrap>
                        {resume.title}
                      </Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', mr: 1 }}>
                          Created:
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(resume.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', mr: 1 }}>
                          Updated:
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(resume.updatedAt)}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                      <Box>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewResume(resume.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditResume(resume.id)}
                        >
                          Edit
                        </Button>
                      </Box>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteResume(resume.id)}
                        title="Delete Resume"
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              
              {/* Add "Create New Resume" card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: 'primary.light',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    transition: 'transform 0.2s, background-color 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                  onClick={handleCreateResume}
                >
                  <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" align="center" color="primary">
                    Create New Resume
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
                    Start building your next career opportunity
                  </Typography>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Manage your resumes by clicking the view, edit, or delete buttons. Keep your resumes up-to-date to ensure they reflect your most recent skills and experiences.
              </Typography>
            </Box>
          </Paper>
          
          <Box sx={{ mt: 6, mb: 4 }}>
            <Divider sx={{ mb: 4 }} />
            <Typography variant="h5" gutterBottom>
              Resume Building Tips
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tailor Your Resume
                    </Typography>
                    <Typography variant="body2">
                      Customize your resume for each job application. Highlight the skills and experiences that match the job description to increase your chances of getting an interview.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quantify Achievements
                    </Typography>
                    <Typography variant="body2">
                      Use numbers and metrics to showcase your accomplishments. Instead of saying "Increased sales," try "Increased sales by 30% over 6 months."
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Keep It Concise
                    </Typography>
                    <Typography variant="body2">
                      Aim for a 1-2 page resume that highlights your most relevant experience. Use bullet points and clear, concise language to make your resume easy to scan.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Dashboard;