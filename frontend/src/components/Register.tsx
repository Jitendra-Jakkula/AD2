import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Paper, 
  Alert, 
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateEmail = (email: string): boolean => {
    // Ensure a valid email format with at least one letter before '@'
    const emailRegex = /^[A-Za-z0-9][A-Za-z0-9._%+-]*[A-Za-z]+[A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format. Email must start with a letter/number and contain at least one letter before '@'");
      return false;
    }
  
    // Extract domain part
    const [localPart, domain] = email.split("@");
    const domainName = domain.split(".")[0];
  
    // Ensure domain is at least 2 characters and contains at least one letter
    if (domainName.length < 2 || /^\d+$/.test(domainName)) {
      setEmailError("Invalid domain. Must contain at least 2 letters (e.g., example@site.com)");
      return false;
    }
  
    setEmailError(null);
    return true;
  };
  
  
  
  


  const validatePassword = (password: string): boolean => {
    // Check for minimum requirements
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }
    
    setPasswordError(null);
    return true;
  };

  const validateFirstName = (firstName: string): boolean => {
    // Check if first name contains only letters (no numbers or symbols)
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      setNameError('First name must contain only letters (no numbers or symbols)');
      return false;
    }
    
    // Check for "00000" specifically (though the above regex would already catch this)
    if (firstName === '00000') {
      setNameError('First name cannot be 00000');
      return false;
    }
    
    setNameError(null);
    return true;
  };

  const validateLastName = (lastName: string): boolean => {
    // Regular expression to allow only alphabets (uppercase and lowercase)
    const nameRegex = /^[A-Za-z]+$/;
  
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      return false;
    } else if (!nameRegex.test(lastName)) {
      setLastNameError("Last name must contain only letters");
      return false;
    }
  
    setLastNameError(null);
    return true;
  };
  

  const validateUsername = (username: string): boolean => {
    // Username should contain at least one letter
    if (!/[a-zA-Z]/.test(username)) {
      setUsernameError('Username must contain at least one letter');
      return false;
    }
    
    // Check for valid characters (letters, numbers, and some special characters)
    if (!/^[a-zA-Z0-9_\-.]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and characters: _-.');
      return false;
    }
    
    setUsernameError(null);
    return true;
  };

  // Function to validate all fields at once
  const validateAllFields = (values: any): boolean => {
    let isValid = true;
    
    // Validate first name
    if (!validateFirstName(values.firstName)) {
      isValid = false;
    }
    
    // Validate last name
    if (!validateLastName(values.lastName)) {
      isValid = false;
    }
    
    // Validate username
    if (!validateUsername(values.username)) {
      isValid = false;
    }
    
    // Validate email
    if (!validateEmail(values.email)) {
      isValid = false;
    }
    
    // Validate password
    if (!validatePassword(values.password)) {
      isValid = false;
    }
    
    // Check if passwords match
    if (values.password !== values.confirmPassword) {
      isValid = false;
    }
    
    return isValid;
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .required('Username is required'),
      email: Yup.string()
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
    }),
    onSubmit: async (values) => {
      setSubmitAttempted(true);
      
      // Run all validations
      const isValid = validateAllFields(values);
      
      if (!isValid) {
        return; // Stop submission if validation fails
      }
      
      try {
        await register(
          values.username,
          values.email,
          values.password,
          values.firstName,
          values.lastName
        );
        setSuccess('Registration successful! You can now login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to register');
      }
    },
  });

  // Add handlers for manual validation on blur
  const handleEmailBlur = () => {
    if (formik.values.email) {
      validateEmail(formik.values.email);
    }
  };

  const handlePasswordBlur = () => {
    if (formik.values.password) {
      validatePassword(formik.values.password);
    }
  };

  const handleFirstNameBlur = () => {
    if (formik.values.firstName) {
      validateFirstName(formik.values.firstName);
    }
  };

  const handleLastNameBlur = () => {
    if (formik.values.lastName) {
      validateLastName(formik.values.lastName);
    }
  };

  const handleUsernameBlur = () => {
    if (formik.values.username) {
      validateUsername(formik.values.username);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {success}
            </Alert>
          )}
          
          {submitAttempted && (
            (Object.keys(formik.errors).length > 0 || 
             nameError || lastNameError || emailError || 
             passwordError || usernameError) && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              Please fix all errors before submitting
            </Alert>
          ))}
          
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  autoComplete="given-name"
                  value={formik.values.firstName}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Immediately validate first name on change
                    if (e.target.value) {
                      validateFirstName(e.target.value);
                    }
                  }}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    handleFirstNameBlur();
                  }}
                  error={(formik.touched.firstName && Boolean(formik.errors.firstName)) || Boolean(nameError)}
                  helperText={(formik.touched.firstName && formik.errors.firstName) || nameError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    id="lastName"
    name="lastName"
    label="Last Name"
    autoComplete="family-name"
    value={formik.values.lastName}
    onChange={(e) => {
      formik.handleChange(e);
      // Immediately validate last name on change
      if (e.target.value) {
        validateLastName(e.target.value);
      }
    }}
    onBlur={(e) => {
      formik.handleBlur(e);
      handleLastNameBlur();
    }}
    error={(formik.touched.lastName && Boolean(formik.errors.lastName)) || Boolean(lastNameError)}
    helperText={(formik.touched.lastName && formik.errors.lastName) || lastNameError}
  />
</Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  autoComplete="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    handleUsernameBlur();
                  }}
                  error={(formik.touched.username && Boolean(formik.errors.username)) || Boolean(usernameError)}
                  helperText={(formik.touched.username && formik.errors.username) || usernameError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    handleEmailBlur();
                  }}
                  error={(formik.touched.email && Boolean(formik.errors.email)) || Boolean(emailError)}
                  helperText={(formik.touched.email && formik.errors.email) || emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    handlePasswordBlur();
                  }}
                  error={(formik.touched.password && Boolean(formik.errors.password)) || Boolean(passwordError)}
                  helperText={(formik.touched.password && formik.errors.password) || passwordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
              onClick={() => {
                // Force validation of all fields on submit button click
                setSubmitAttempted(true);
                validateAllFields(formik.values);
              }}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;