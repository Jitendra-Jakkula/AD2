package com.resumebuilder.api.repository;

import com.resumebuilder.api.model.Resume;
import com.resumebuilder.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUser(User user);
    List<Resume> findByUserId(Long userId);
} 