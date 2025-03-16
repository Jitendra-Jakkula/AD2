import React from 'react';
import { TextField, Grid, Typography, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onUpdate: (personalInfo: PersonalInfo) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ personalInfo, onUpdate }) => {
  const formik = useFormik({
    initialValues: personalInfo,
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string(),
      address: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zipCode: Yup.string(),
      country: Yup.string(),
      linkedinUrl: Yup.string().url('Invalid URL'),
      githubUrl: Yup.string().url('Invalid URL'),
      portfolioUrl: Yup.string().url('Invalid URL'),
      summary: Yup.string(),
    }),
    onSubmit: (values) => {
      // This form doesn't submit directly, it updates parent state
    },
    enableReinitialize: true,
  });

  // Update parent component whenever form values change
  React.useEffect(() => {
    if (formik.dirty) {
      onUpdate(formik.values);
    }
  }, [formik.values, formik.dirty, onUpdate]);

  return (
    <Box component="form">
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="fullName"
            name="fullName"
            label="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="address"
            name="address"
            label="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="city"
            name="city"
            label="City"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="state"
            name="state"
            label="State/Province"
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.state && Boolean(formik.errors.state)}
            helperText={formik.touched.state && formik.errors.state}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="zipCode"
            name="zipCode"
            label="Zip/Postal Code"
            value={formik.values.zipCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
            helperText={formik.touched.zipCode && formik.errors.zipCode}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="country"
            name="country"
            label="Country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.country && Boolean(formik.errors.country)}
            helperText={formik.touched.country && formik.errors.country}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Online Presence
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="linkedinUrl"
            name="linkedinUrl"
            label="LinkedIn URL"
            value={formik.values.linkedinUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.linkedinUrl && Boolean(formik.errors.linkedinUrl)}
            helperText={formik.touched.linkedinUrl && formik.errors.linkedinUrl}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="githubUrl"
            name="githubUrl"
            label="GitHub URL"
            value={formik.values.githubUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.githubUrl && Boolean(formik.errors.githubUrl)}
            helperText={formik.touched.githubUrl && formik.errors.githubUrl}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="portfolioUrl"
            name="portfolioUrl"
            label="Portfolio URL"
            value={formik.values.portfolioUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.portfolioUrl && Boolean(formik.errors.portfolioUrl)}
            helperText={formik.touched.portfolioUrl && formik.errors.portfolioUrl}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="summary"
            name="summary"
            label="Professional Summary"
            multiline
            rows={4}
            value={formik.values.summary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.summary && Boolean(formik.errors.summary)}
            helperText={formik.touched.summary && formik.errors.summary}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoForm; 