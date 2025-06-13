package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Parent;
import com.swp391_8.schoolhealth.model.User;
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

    public Optional<Parent> getParentById(Integer id) {
        return parentRepository.findById(id);
    }

    public Optional<Parent> getParentByCode(String parentCode) {
        return parentRepository.findByParentCode(parentCode);
    }

    public Optional<Parent> getParentByUserId(Integer userId) {
        return parentRepository.findByUserUserId(userId);
    }

    @Transactional
    public Parent createParent(Parent parent) {
        // Generate a unique parent code if not provided
        if (parent.getParentCode() == null || parent.getParentCode().isEmpty()) {
            // Use user code if available, otherwise generate a new one
            User user = parent.getUser();
            if (user != null && user.getUserCode() != null) {
                parent.setParentCode("PARENT_" + user.getUserCode());
            } else {
                parent.setParentCode("PARENT_" + System.currentTimeMillis());
            }
        }
        
        return parentRepository.save(parent);
    }

    @Transactional
    public Optional<Parent> updateParent(Integer id, Parent parentDetails) {
        return parentRepository.findById(id).map(parent -> {
            // Update fields except for parentCode and user
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
    public boolean deleteParent(Integer id) {
        return parentRepository.findById(id).map(parent -> {
            parentRepository.delete(parent);
            return true;
        }).orElse(false);
    }
}
