package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Parent;
import com.swp391_8.schoolhealth.repository.ParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ParentService {

    @Autowired
    private ParentRepository parentRepository;

    public List<Parent> getAllParents() {
        return parentRepository.findAll();
    }

    public Optional<Parent> getParentByCode(String parentCode) {
        return parentRepository.findByParentCode(parentCode);
    }

    @Transactional
    public Parent createParent(Parent parent) {
        // Parent code should be set by the caller (e.g., UserService or ParentController)
        // based on the User.userCode.
        // Basic validation to ensure parentCode is present.
        if (parent.getParentCode() == null || parent.getParentCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Parent code cannot be null or empty when creating a Parent.");
        }
        return parentRepository.save(parent);
    }

    @Transactional
    public Optional<Parent> updateParentByCode(String parentCode, Parent parentDetails) {
        return parentRepository.findByParentCode(parentCode).map(parent -> {
            if (parentDetails.getAddress() != null) {
                parent.setAddress(parentDetails.getAddress());
            }
            if (parentDetails.getEmergencyContact() != null) {
                parent.setEmergencyContact(parentDetails.getEmergencyContact());
            }
            if (parentDetails.getRelationshipWithStudent() != null) {
                parent.setRelationshipWithStudent(parentDetails.getRelationshipWithStudent());
            }
            return parentRepository.save(parent);
        });
    }

    @Transactional
    public boolean deleteParentByCode(String parentCode) {
        return parentRepository.findByParentCode(parentCode).map(parent -> {
            parentRepository.delete(parent);
            return true;
        }).orElse(false);
    }
}
