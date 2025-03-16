package com.resumebuilder.api.controller;

import com.resumebuilder.api.model.Resume;
import com.resumebuilder.api.model.User;
import com.resumebuilder.api.model.PersonalInfo;
import com.resumebuilder.api.model.Education;
import com.resumebuilder.api.model.Experience;
import com.resumebuilder.api.model.Skill;
import com.resumebuilder.api.model.Certification;
import com.resumebuilder.api.model.Award;
import com.resumebuilder.api.model.Project;
import com.resumebuilder.api.repository.ResumeRepository;
import com.resumebuilder.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Resume>> getAllResumes() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElseThrow();
            
            List<Resume> resumes = resumeRepository.findByUser(user);
            return ResponseEntity.ok(resumes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElseThrow();
            
            Resume resume = resumeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            
            if (!resume.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Resume> createResume(@RequestBody Resume resume) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElseThrow();
            
            resume.setUser(user);
            
            // Set bidirectional relationships
            if (resume.getPersonalInfo() != null) {
                resume.getPersonalInfo().setResume(resume);
            } else {
                // Create an empty PersonalInfo if it's null
                PersonalInfo personalInfo = new PersonalInfo();
                personalInfo.setFullName(""); // Set default values
                personalInfo.setEmail("");
                personalInfo.setResume(resume);
                resume.setPersonalInfo(personalInfo);
            }
            
            // Handle educations - create new instances to avoid detached entity issues
            if (resume.getEducations() != null && !resume.getEducations().isEmpty()) {
                List<Education> newEducations = new ArrayList<>();
                
                for (Education education : resume.getEducations()) {
                    Education newEducation = new Education();
                    newEducation.setInstitution(education.getInstitution());
                    newEducation.setDegree(education.getDegree());
                    newEducation.setFieldOfStudy(education.getFieldOfStudy());
                    newEducation.setStartYear(education.getStartYear());
                    newEducation.setEndYear(education.getEndYear());
                    newEducation.setLocation(education.getLocation());
                    newEducation.setDescription(education.getDescription());
                    newEducation.setResume(resume);
                    
                    newEducations.add(newEducation);
                }
                
                resume.getEducations().clear();
                resume.getEducations().addAll(newEducations);
            }
            
            // Handle experiences - create new instances to avoid detached entity issues
            if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
                List<Experience> newExperiences = new ArrayList<>();
                
                for (Experience experience : resume.getExperiences()) {
                    Experience newExperience = new Experience();
                    newExperience.setCompany(experience.getCompany());
                    newExperience.setPosition(experience.getPosition());
                    newExperience.setLocation(experience.getLocation());
                    newExperience.setStartYear(experience.getStartYear());
                    newExperience.setEndYear(experience.getEndYear());
                    newExperience.setCurrentJob(experience.getCurrentJob());
                    newExperience.setDescription(experience.getDescription());
                    newExperience.setResume(resume);
                    
                    newExperiences.add(newExperience);
                }
                
                resume.getExperiences().clear();
                resume.getExperiences().addAll(newExperiences);
            }
            
            // Handle skills - create new instances to avoid detached entity issues
            if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
                List<Skill> newSkills = new ArrayList<>();
                
                for (Skill skill : resume.getSkills()) {
                    Skill newSkill = new Skill();
                    newSkill.setName(skill.getName());
                    newSkill.setLevel(skill.getLevel());
                    newSkill.setResume(resume);
                    
                    newSkills.add(newSkill);
                }
                
                resume.getSkills().clear();
                resume.getSkills().addAll(newSkills);
            }
            
            // Handle certifications - create new instances to avoid detached entity issues
            if (resume.getCertifications() != null && !resume.getCertifications().isEmpty()) {
                List<Certification> newCertifications = new ArrayList<>();
                
                for (Certification certification : resume.getCertifications()) {
                    Certification newCertification = new Certification();
                    newCertification.setName(certification.getName());
                    newCertification.setIssuer(certification.getIssuer());
                    newCertification.setDate(certification.getDate());
                    newCertification.setDescription(certification.getDescription());
                    newCertification.setResume(resume);
                    
                    newCertifications.add(newCertification);
                }
                
                resume.getCertifications().clear();
                resume.getCertifications().addAll(newCertifications);
            }
            
            // Handle awards - create new instances to avoid detached entity issues
            if (resume.getAwards() != null && !resume.getAwards().isEmpty()) {
                List<Award> newAwards = new ArrayList<>();
                
                for (Award award : resume.getAwards()) {
                    Award newAward = new Award();
                    newAward.setTitle(award.getTitle());
                    newAward.setIssuer(award.getIssuer());
                    newAward.setDate(award.getDate());
                    newAward.setDescription(award.getDescription());
                    newAward.setResume(resume);
                    
                    newAwards.add(newAward);
                }
                
                resume.getAwards().clear();
                resume.getAwards().addAll(newAwards);
            }
            
            // Handle projects - create new instances to avoid detached entity issues
            if (resume.getProjects() != null && !resume.getProjects().isEmpty()) {
                List<Project> newProjects = new ArrayList<>();
                
                for (Project project : resume.getProjects()) {
                    Project newProject = new Project();
                    newProject.setName(project.getName());
                    newProject.setDescription(project.getDescription());
                    newProject.setTechnologies(project.getTechnologies());
                    newProject.setLink(project.getLink());
                    newProject.setStartYear(project.getStartYear());
                    newProject.setEndYear(project.getEndYear());
                    newProject.setResume(resume);
                    
                    newProjects.add(newProject);
                }
                
                resume.getProjects().clear();
                resume.getProjects().addAll(newProjects);
            }
            
            Resume savedResume = resumeRepository.save(resume);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedResume);
        } catch (Exception e) {
            e.printStackTrace(); // Print the full stack trace
            System.err.println("Error creating resume: " + e.getMessage());
            // Log the exception details
            if (e.getCause() != null) {
                System.err.println("Caused by: " + e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateResume(@PathVariable Long id, @RequestBody Resume resumeDetails) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElseThrow();
            
            Resume resume = resumeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            
            if (!resume.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Update basic fields
            resume.setTitle(resumeDetails.getTitle());
            
            // Update personal info
            if (resumeDetails.getPersonalInfo() != null) {
                if (resume.getPersonalInfo() == null) {
                    resume.setPersonalInfo(resumeDetails.getPersonalInfo());
                    resume.getPersonalInfo().setResume(resume);
                } else {
                    PersonalInfo personalInfo = resume.getPersonalInfo();
                    PersonalInfo newInfo = resumeDetails.getPersonalInfo();
                    
                    personalInfo.setFullName(newInfo.getFullName());
                    personalInfo.setEmail(newInfo.getEmail());
                    personalInfo.setPhone(newInfo.getPhone());
                    personalInfo.setAddress(newInfo.getAddress());
                    personalInfo.setCity(newInfo.getCity());
                    personalInfo.setState(newInfo.getState());
                    personalInfo.setZipCode(newInfo.getZipCode());
                    personalInfo.setCountry(newInfo.getCountry());
                    personalInfo.setLinkedinUrl(newInfo.getLinkedinUrl());
                    personalInfo.setGithubUrl(newInfo.getGithubUrl());
                    personalInfo.setPortfolioUrl(newInfo.getPortfolioUrl());
                    personalInfo.setSummary(newInfo.getSummary());
                }
            }
            
            // Update educations - create new instances to avoid detached entity issues
            if (resumeDetails.getEducations() != null) {
                // Clear existing educations
                resume.getEducations().clear();
                
                // Create and add new education instances
                for (Education education : resumeDetails.getEducations()) {
                    Education newEducation = new Education();
                    newEducation.setInstitution(education.getInstitution());
                    newEducation.setDegree(education.getDegree());
                    newEducation.setFieldOfStudy(education.getFieldOfStudy());
                    newEducation.setStartYear(education.getStartYear());
                    newEducation.setEndYear(education.getEndYear());
                    newEducation.setLocation(education.getLocation());
                    newEducation.setDescription(education.getDescription());
                    newEducation.setResume(resume);
                    
                    resume.getEducations().add(newEducation);
                }
            }
            
            // Update experiences
            if (resumeDetails.getExperiences() != null) {
                resume.getExperiences().clear();
                
                // Create and add new experience instances
                for (Experience experience : resumeDetails.getExperiences()) {
                    Experience newExperience = new Experience();
                    newExperience.setCompany(experience.getCompany());
                    newExperience.setPosition(experience.getPosition());
                    newExperience.setLocation(experience.getLocation());
                    newExperience.setStartYear(experience.getStartYear());
                    newExperience.setEndYear(experience.getEndYear());
                    newExperience.setCurrentJob(experience.getCurrentJob());
                    newExperience.setDescription(experience.getDescription());
                    newExperience.setResume(resume);
                    
                    resume.getExperiences().add(newExperience);
                }
            }
            
            // Update skills
            if (resumeDetails.getSkills() != null) {
                resume.getSkills().clear();
                
                // Create and add new skill instances
                for (Skill skill : resumeDetails.getSkills()) {
                    Skill newSkill = new Skill();
                    newSkill.setName(skill.getName());
                    newSkill.setLevel(skill.getLevel());
                    newSkill.setResume(resume);
                    
                    resume.getSkills().add(newSkill);
                }
            }
            
            // Update certifications
            if (resumeDetails.getCertifications() != null) {
                resume.getCertifications().clear();
                
                // Create and add new certification instances
                for (Certification certification : resumeDetails.getCertifications()) {
                    Certification newCertification = new Certification();
                    newCertification.setName(certification.getName());
                    newCertification.setIssuer(certification.getIssuer());
                    newCertification.setDate(certification.getDate());
                    newCertification.setDescription(certification.getDescription());
                    newCertification.setResume(resume);
                    
                    resume.getCertifications().add(newCertification);
                }
            }
            
            // Update awards
            if (resumeDetails.getAwards() != null) {
                resume.getAwards().clear();
                
                // Create and add new award instances
                for (Award award : resumeDetails.getAwards()) {
                    Award newAward = new Award();
                    newAward.setTitle(award.getTitle());
                    newAward.setIssuer(award.getIssuer());
                    newAward.setDate(award.getDate());
                    newAward.setDescription(award.getDescription());
                    newAward.setResume(resume);
                    
                    resume.getAwards().add(newAward);
                }
            }
            
            // Update projects
            if (resumeDetails.getProjects() != null) {
                resume.getProjects().clear();
                
                // Create and add new project instances
                for (Project project : resumeDetails.getProjects()) {
                    Project newProject = new Project();
                    newProject.setName(project.getName());
                    newProject.setDescription(project.getDescription());
                    newProject.setTechnologies(project.getTechnologies());
                    newProject.setLink(project.getLink());
                    newProject.setStartYear(project.getStartYear());
                    newProject.setEndYear(project.getEndYear());
                    newProject.setResume(resume);
                    
                    resume.getProjects().add(newProject);
                }
            }
            
            Resume updatedResume = resumeRepository.save(resume);
            return ResponseEntity.ok(updatedResume);
        } catch (Exception e) {
            e.printStackTrace(); // Print the full stack trace
            System.err.println("Error updating resume: " + e.getMessage());
            // Log the exception details
            if (e.getCause() != null) {
                System.err.println("Caused by: " + e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElseThrow();
            
            Resume resume = resumeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            
            if (!resume.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            resumeRepository.delete(resume);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 