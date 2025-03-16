package com.resumebuilder.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "personal_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String email;
    
    @Column
    private String phone;
    
    @Column
    private String address;
    
    @Column
    private String city;
    
    @Column
    private String state;
    
    @Column(name = "zip_code")
    private String zipCode;
    
    @Column
    private String country;
    
    @Column(name = "linkedin_url")
    private String linkedinUrl;
    
    @Column(name = "github_url")
    private String githubUrl;
    
    @Column(name = "portfolio_url")
    private String portfolioUrl;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    
    @OneToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonBackReference
    private Resume resume;
} 