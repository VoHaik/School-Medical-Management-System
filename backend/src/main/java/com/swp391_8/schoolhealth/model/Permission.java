package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id", nullable = false)
    private Integer permissionId;

    @Nationalized
    @Column(name = "permission_name", nullable = false, length = 50, unique = true)
    private String permissionName;

    @Nationalized
    @Lob
    @Column(name = "description")
    private String description;

    // If you have a many-to-many relationship with Role, it would be mapped here
    // For example, if using a join table RolePermissions:
    // @ManyToMany(mappedBy = "permissions")
    // private Set<Role> roles;
}