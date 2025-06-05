package com.swp391_8.schoolhealth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer id;

    @Nationalized
    @Column(name = "role_name", nullable = false, unique = true, length = 50)
    private String roleName;

    @Nationalized
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    // One-to-many relationship with users
    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> users = new HashSet<>();

    // Default constructor (required by Hibernate)
    public Role() {
        this.users = new HashSet<>();
    }

    // Constructor with roleName only
    public Role(String roleName) {
        this();
        this.roleName = roleName;
    }

    // Constructor with roleName and description
    public Role(String roleName, String description) {
        this();
        this.roleName = roleName;
        this.description = description;
    }

    // Full constructor
    public Role(Integer id, String roleName, String description, Set<User> users) {
        this.id = id;
        this.roleName = roleName;
        this.description = description;
        this.users = users != null ? users : new HashSet<>();
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users != null ? users : new HashSet<>();
    }

    // Compatibility methods for existing code
    public String getName() {
        return roleName;
    }

    public void setName(String name) {
        this.roleName = name;
    }

    // toString method
    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", roleName='" + roleName + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    // equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return id != null && id.equals(role.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
