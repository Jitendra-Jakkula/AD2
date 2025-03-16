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

interface Certification {
  id?: number;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  onUpdate: (certifications: Certification[]) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ certifications, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCertificationIndex, setCurrentCertificationIndex] = useState<number | null>(null);

  const initialCertificationValues: Certification = {
    name: '',
    issuer: '',
    date: '',
    description: '',
  };

  const formik = useFormik({
    initialValues: initialCertificationValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Certification name is required'),
      issuer: Yup.string().required('Issuer is required'),
      date: Yup.string(),
      description: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const updatedCertifications = [...certifications];
      
      if (currentCertificationIndex !== null) {
        // Update existing certification
        updatedCertifications[currentCertificationIndex] = {
          ...values,
          id: updatedCertifications[currentCertificationIndex].id,
        };
      } else {
        // Add new certification
        updatedCertifications.push({
          ...values,
          id: Date.now(), // Temporary ID for frontend
        });
      }
      
      onUpdate(updatedCertifications);
      resetForm();
      setIsEditing(false);
      setCurrentCertificationIndex(null);
    },
    enableReinitialize: true,
  });

  const handleAddCertification = () => {
    formik.resetForm();
    setCurrentCertificationIndex(null);
    setIsEditing(true);
  };

  const handleEditCertification = (index: number) => {
    formik.setValues(certifications[index]);
    setCurrentCertificationIndex(index);
    setIsEditing(true);
  };

  const handleDeleteCertification = (index: number) => {
    const updatedCertifications = [...certifications];
    updatedCertifications.splice(index, 1);
    onUpdate(updatedCertifications);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
    setCurrentCertificationIndex(null);
  };

  // Generate year options from 1950 to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Certifications & Training
      </Typography>

      {/* List of certifications */}
      {certifications.length > 0 && !isEditing && (
        <Box sx={{ mb: 3 }}>
          {certifications.map((certification, index) => (
            <Card key={certification.id || index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{certification.name}</Typography>
                <Typography variant="subtitle1">{certification.issuer}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {certification.date}
                </Typography>
                {certification.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {certification.description}
                  </Typography>
                )}
              </CardContent>
              <Divider />
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditCertification(index)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteCertification(index)}
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
          onClick={handleAddCertification}
          sx={{ mt: 2 }}
        >
          Add Certification
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
                    label="Certification Name"
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
                    id="issuer"
                    name="issuer"
                    label="Issuing Organization"
                    value={formik.values.issuer}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.issuer && Boolean(formik.errors.issuer)}
                    helperText={formik.touched.issuer && formik.errors.issuer}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    id="date"
                    name="date"
                    label="Year Obtained"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
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
                {currentCertificationIndex !== null ? 'Update' : 'Add'} Certification
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default CertificationsForm; 