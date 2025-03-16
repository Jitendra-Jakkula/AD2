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

interface Award {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

interface AwardsFormProps {
  awards: Award[];
  onUpdate: (awards: Award[]) => void;
}

const AwardsForm: React.FC<AwardsFormProps> = ({ awards, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentAwardIndex, setCurrentAwardIndex] = useState<number | null>(null);

  const initialAwardValues: Award = {
    title: '',
    issuer: '',
    date: '',
    description: '',
  };

  const formik = useFormik({
    initialValues: initialAwardValues,
    validationSchema: Yup.object({
      title: Yup.string().required('Award title is required'),
      issuer: Yup.string().required('Issuer is required'),
      date: Yup.string(),
      description: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const updatedAwards = [...awards];
      
      if (currentAwardIndex !== null) {
        // Update existing award
        updatedAwards[currentAwardIndex] = {
          ...values,
          id: updatedAwards[currentAwardIndex].id,
        };
      } else {
        // Add new award
        updatedAwards.push({
          ...values,
          id: Date.now(), // Temporary ID for frontend
        });
      }
      
      onUpdate(updatedAwards);
      resetForm();
      setIsEditing(false);
      setCurrentAwardIndex(null);
    },
    enableReinitialize: true,
  });

  const handleAddAward = () => {
    formik.resetForm();
    setCurrentAwardIndex(null);
    setIsEditing(true);
  };

  const handleEditAward = (index: number) => {
    formik.setValues(awards[index]);
    setCurrentAwardIndex(index);
    setIsEditing(true);
  };

  const handleDeleteAward = (index: number) => {
    const updatedAwards = [...awards];
    updatedAwards.splice(index, 1);
    onUpdate(updatedAwards);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
    setCurrentAwardIndex(null);
  };

  // Generate year options from 1950 to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Awards & Achievements
      </Typography>

      {/* List of awards */}
      {awards.length > 0 && !isEditing && (
        <Box sx={{ mb: 3 }}>
          {awards.map((award, index) => (
            <Card key={award.id || index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{award.title}</Typography>
                <Typography variant="subtitle1">{award.issuer}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {award.date}
                </Typography>
                {award.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {award.description}
                  </Typography>
                )}
              </CardContent>
              <Divider />
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditAward(index)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteAward(index)}
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
          onClick={handleAddAward}
          sx={{ mt: 2 }}
        >
          Add Award
        </Button>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Card sx={{ p: 2, mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Award Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
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
                    label="Year Received"
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
                {currentAwardIndex !== null ? 'Update' : 'Add'} Award
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AwardsForm; 