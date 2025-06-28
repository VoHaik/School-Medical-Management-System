package com.swp391_8.schoolhealth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer roleId;

    @Column(name = "role_name", nullable = false, unique = true)
    private String roleName;

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> users;

    // Add constructor for UserAccountInitializer compatibility
    public Role(String roleName, String description) {
        this.roleName = roleName;
        // Note: description parameter is ignored since Role doesn't have description field
    }

    // Add missing getter methods for compatibility
    public Integer getId() {
        return roleId;
    }

    public String getName() {
        return roleName;
    }
}
