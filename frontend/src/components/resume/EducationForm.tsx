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

interface EducationFormProps {
  educations: Education[];
  onUpdate: (educations: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ educations, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducationIndex, setCurrentEducationIndex] = useState<number | null>(null);

  const initialEducationValues: Education = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    location: '',
    description: '',
  };

  const formik = useFormik({
    initialValues: initialEducationValues,
    validationSchema: Yup.object({
      institution: Yup.string().required('Institution is required'),
      degree: Yup.string().required('Degree is required'),
      fieldOfStudy: Yup.string(),
      startYear: Yup.string().required('Start year is required'),
      endYear: Yup.string(),
      location: Yup.string(),
      description: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const updatedEducations = [...educations];
      
      if (currentEducationIndex !== null) {
        // Update existing education
        updatedEducations[currentEducationIndex] = {
          ...values,
          id: updatedEducations[currentEducationIndex].id,
        };
      } else {
        // Add new education
        updatedEducations.push({
          ...values,
          id: Date.now(), // Temporary ID for frontend
        });
      }
      
      onUpdate(updatedEducations);
      resetForm();
      setIsEditing(false);
      setCurrentEducationIndex(null);
    },
    enableReinitialize: true,
  });

  const handleAddEducation = () => {
    formik.resetForm();
    setCurrentEducationIndex(null);
    setIsEditing(true);
  };

  const handleEditEducation = (index: number) => {
    formik.setValues(educations[index]);
    setCurrentEducationIndex(index);
    setIsEditing(true);
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEducations = [...educations];
    updatedEducations.splice(index, 1);
    onUpdate(updatedEducations);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
    setCurrentEducationIndex(null);
  };

  const formatYear = (year: string) => {
    if (!year) return '';
    return year;
  };

  // Generate year options from 1950 to current year + 10
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 10 + 1 }, (_, i) => (1950 + i).toString());

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Education
      </Typography>

      {/* List of educations */}
      {educations.length > 0 && !isEditing && (
        <Box sx={{ mb: 3 }}>
          {educations.map((education, index) => (
            <Card key={education.id || index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{education.degree}</Typography>
                <Typography variant="subtitle1">{education.institution}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {education.fieldOfStudy && `${education.fieldOfStudy} • `}
                  {formatYear(education.startYear)} - {formatYear(education.endYear)}
                </Typography>
                {education.location && (
                  <Typography variant="body2" color="text.secondary">
                    {education.location}
                  </Typography>
                )}
                {education.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {education.description}
                  </Typography>
                )}
              </CardContent>
              <Divider />
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditEducation(index)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteEducation(index)}
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
          onClick={handleAddEducation}
          sx={{ mt: 2 }}
        >
          Add Education
        </Button>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Card sx={{ p: 2, mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="institution"
                    name="institution"
                    label="Institution"
                    value={formik.values.institution}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.institution && Boolean(formik.errors.institution)}
                    helperText={formik.touched.institution && formik.errors.institution}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="degree"
                    name="degree"
                    label="Degree"
                    value={formik.values.degree}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.degree && Boolean(formik.errors.degree)}
                    helperText={formik.touched.degree && formik.errors.degree}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    label="Field of Study"
                    value={formik.values.fieldOfStudy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fieldOfStudy && Boolean(formik.errors.fieldOfStudy)}
                    helperText={formik.touched.fieldOfStudy && formik.errors.fieldOfStudy}
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
                {currentEducationIndex !== null ? 'Update' : 'Add'} Education
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default EducationForm; 