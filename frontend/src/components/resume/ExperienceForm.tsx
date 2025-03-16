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
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

interface ExperienceFormProps {
  experiences: Experience[];
  onUpdate: (experiences: Experience[]) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState<number | null>(null);

  const initialExperienceValues: Experience = {
    company: '',
    position: '',
    location: '',
    startYear: '',
    endYear: '',
    currentJob: false,
    description: '',
  };

  const formik = useFormik({
    initialValues: initialExperienceValues,
    validationSchema: Yup.object({
      company: Yup.string().required('Company is required'),
      position: Yup.string().required('Position is required'),
      location: Yup.string(),
      startYear: Yup.string().required('Start year is required'),
      endYear: Yup.string().when('currentJob', {
        is: false,
        then: () => Yup.string(),
      }),
      currentJob: Yup.boolean(),
      description: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const updatedExperiences = [...experiences];
      
      if (currentExperienceIndex !== null) {
        // Update existing experience
        updatedExperiences[currentExperienceIndex] = {
          ...values,
          id: updatedExperiences[currentExperienceIndex].id,
        };
      } else {
        // Add new experience
        updatedExperiences.push({
          ...values,
          id: Date.now(), // Temporary ID for frontend
        });
      }
      
      onUpdate(updatedExperiences);
      resetForm();
      setIsEditing(false);
      setCurrentExperienceIndex(null);
    },
    enableReinitialize: true,
  });

  const handleAddExperience = () => {
    formik.resetForm();
    setCurrentExperienceIndex(null);
    setIsEditing(true);
  };

  const handleEditExperience = (index: number) => {
    formik.setValues(experiences[index]);
    setCurrentExperienceIndex(index);
    setIsEditing(true);
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    onUpdate(updatedExperiences);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
    setCurrentExperienceIndex(null);
  };

  const handleCurrentJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    formik.setFieldValue('currentJob', checked);
    if (checked) {
      formik.setFieldValue('endYear', '');
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 10 + 1 }, (_, i) => (1950 + i).toString());

  const formatYear = (year: string) => {
    if (!year) return '';
    return year;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Work Experience
      </Typography>

      {/* List of experiences */}
      {experiences.length > 0 && !isEditing && (
        <Box sx={{ mb: 3 }}>
          {experiences.map((experience, index) => (
            <Card key={experience.id || index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{experience.position}</Typography>
                <Typography variant="subtitle1">{experience.company}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatYear(experience.startYear)} - {experience.currentJob ? 'Present' : formatYear(experience.endYear)}
                </Typography>
                {experience.location && (
                  <Typography variant="body2" color="text.secondary">
                    {experience.location}
                  </Typography>
                )}
                {experience.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {experience.description}
                  </Typography>
                )}
              </CardContent>
              <Divider />
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditExperience(index)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteExperience(index)}
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
          onClick={handleAddExperience}
          sx={{ mt: 2 }}
        >
          Add Experience
        </Button>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Card sx={{ p: 2, mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="company"
                    name="company"
                    label="Company"
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.company && Boolean(formik.errors.company)}
                    helperText={formik.touched.company && formik.errors.company}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="position"
                    name="position"
                    label="Position"
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.position && Boolean(formik.errors.position)}
                    helperText={formik.touched.position && formik.errors.position}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="location"
                    name="location"
                    label="Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
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
                    required
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
                    disabled={formik.values.currentJob}
                  >
                    <MenuItem value="">Select Year</MenuItem>
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.currentJob}
                        onChange={handleCurrentJobChange}
                        name="currentJob"
                      />
                    }
                    label="I currently work here"
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
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {currentExperienceIndex !== null ? 'Update' : 'Add'} Experience
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default ExperienceForm; 