import React, { useState } from 'react';
import {
  TextField,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  Paper,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Skill {
  id?: number;
  name: string;
  level: string;
}

interface SkillsFormProps {
  skills: Skill[];
  onUpdate: (skills: Skill[]) => void;
}

const skillLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
];

const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onUpdate }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      level: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Skill name is required'),
      level: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const newSkill: Skill = {
        id: Date.now(), // Temporary ID for frontend
        name: values.name,
        level: values.level,
      };
      
      onUpdate([...skills, newSkill]);
      resetForm();
    },
  });

  const handleDeleteSkill = (skillId: number | undefined) => {
    if (skillId) {
      const updatedSkills = skills.filter((skill) => skill.id !== skillId);
      onUpdate(updatedSkills);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Skill"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              placeholder="e.g. JavaScript, Project Management, etc."
              required
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              id="level"
              name="level"
              select
              label="Proficiency Level"
              value={formik.values.level}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.level && Boolean(formik.errors.level)}
              helperText={formik.touched.level && formik.errors.level}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {skillLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      {skills.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Your Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {skills.map((skill) => (
              <Chip
                key={skill.id}
                label={`${skill.name}${skill.level ? ` (${skill.level})` : ''}`}
                onDelete={() => handleDeleteSkill(skill.id)}
                color="primary"
                variant="outlined"
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SkillsForm; 