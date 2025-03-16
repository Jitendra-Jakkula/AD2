import React, { useState } from 'react';
import {
  TextField,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Project {
  id?: number;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startYear: string;
  endYear: string;
}

interface ProjectsFormProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number | null>(null);

  const initialProjectValues: Project = {
    name: '',
    description: '',
    technologies: '',
    link: '',
    startYear: '',
    endYear: '',
  };

  const formik = useFormik({
    initialValues: initialProjectValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Project name is required'),
      description: Yup.string().required('Description is required'),
      technologies: Yup.string(),
      link: Yup.string().url('Must be a valid URL'),
      startYear: Yup.string(),
      endYear: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const updatedProjects = [...projects];
      
      if (currentProjectIndex !== null) {
        // Update existing project
        updatedProjects[currentProjectIndex] = {
          ...values,
          id: updatedProjects[currentProjectIndex].id,
        };
      } else {
        // Add new project
        updatedProjects.push({
          ...values,
          id: Date.now(), // Temporary ID for frontend
        });
      }
      
      onUpdate(updatedProjects);
      resetForm();
      setIsEditing(false);
      setCurrentProjectIndex(null);
    },
    enableReinitialize: true,
  });

  const handleAddProject = () => {
    formik.resetForm();
    setCurrentProjectIndex(null);
    setIsEditing(true);
  };

  const handleEditProject = (index: number) => {
    formik.setValues(projects[index]);
    setCurrentProjectIndex(index);
    setIsEditing(true);
  };

  const handleDeleteProject = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    onUpdate(updatedProjects);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
    setCurrentProjectIndex(null);
  };

  // Generate year options from 1950 to current year + 10
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 10 + 1 }, (_, i) => (1950 + i).toString());

  const formatYear = (year: string) => {
    if (!year) return '';
    return year;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Projects
      </Typography>

      {/* List of projects */}
      {projects.length > 0 && !isEditing && (
        <Box sx={{ mb: 3 }}>
          {projects.map((project, index) => (
            <Card key={project.id || index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="subtitle1">Technologies: {project.technologies}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatYear(project.startYear)} - {formatYear(project.endYear)}
                </Typography>
                {project.link && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      Project Link
                    </a>
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {project.description}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditProject(index)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteProject(index)}
                  aria-label="delete"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Add button or form */}
      {!isEditing ? (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddProject}
          sx={{ mt: 2 }}
        >
          Add Project
        </Button>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Card sx={{ p: 2, mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Project Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="technologies"
                    name="technologies"
                    label="Technologies Used"
                    value={formik.values.technologies}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.technologies && Boolean(formik.errors.technologies)}
                    helperText={formik.touched.technologies && formik.errors.technologies}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    id="startYear"
                    name="startYear"
                    label="Start Year"
                    value={formik.values.startYear}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.startYear && Boolean(formik.errors.startYear)}
                    helperText={formik.touched.startYear && formik.errors.startYear}
                  >
                    <MenuItem value="">Select Year</MenuItem>
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    id="endYear"
                    name="endYear"
                    label="End Year"
                    value={formik.values.endYear}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.endYear && Boolean(formik.errors.endYear)}
                    helperText={formik.touched.endYear && formik.errors.endYear}
                  >
                    <MenuItem value="">Present</MenuItem>
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="link"
                    name="link"
                    label="Project Link"
                    value={formik.values.link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.link && Boolean(formik.errors.link)}
                    helperText={formik.touched.link && formik.errors.link}
                    placeholder="https://example.com"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    required
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {currentProjectIndex !== null ? 'Update' : 'Add'} Project
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default ProjectsForm; 