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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

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
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            You don't have any resumes yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateResume}
            sx={{ mt: 2 }}
          >
            Create Your First Resume
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {resumes.map((resume) => (
            <Grid item xs={12} sm={6} md={4} key={resume.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {resume.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(resume.createdAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {formatDate(resume.updatedAt)}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <IconButton
                    aria-label="view"
                    onClick={() => handleViewResume(resume.id)}
                    title="View Resume"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditResume(resume.id)}
                    title="Edit Resume"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteResume(resume.id)}
                    title="Delete Resume"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard; 