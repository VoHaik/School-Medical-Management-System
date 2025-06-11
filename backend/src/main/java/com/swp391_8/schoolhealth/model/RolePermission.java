package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "RolePermissions")
@IdClass(RolePermission.RolePermissionId.class)
public class RolePermission {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;

    // Composite key class
    public static class RolePermissionId implements Serializable {
        private Integer role;
        private Integer permission;

        // equals and hashCode methods
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RolePermissionId that = (RolePermissionId) o;
            if (role != null ? !role.equals(that.role) : that.role != null) return false;
            return permission != null ? permission.equals(that.permission) : that.permission == null;
        }

        @Override
        public int hashCode() {
            int result = role != null ? role.hashCode() : 0;
            result = 31 * result + (permission != null ? permission.hashCode() : 0);
            return result;
        }
    }
}
