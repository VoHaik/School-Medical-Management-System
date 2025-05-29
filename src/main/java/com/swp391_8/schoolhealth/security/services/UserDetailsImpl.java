package com.swp391_8.schoolhealth.security.services;

import com.swp391_8.schoolhealth.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String email;
    private String fullName;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    private boolean isActive;

    public UserDetailsImpl(Long id, String username, String email, String fullName, String password,
                           Collection<? extends GrantedAuthority> authorities, boolean isActive) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.authorities = authorities;
        this.isActive = isActive;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = new java.util.ArrayList<>();

        // Add authority from the new role field
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        // Also add authorities from the roles collection for backward compatibility
        authorities.addAll(user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList()));

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPassword(),
                authorities,
                user.getIsActive());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return isActive;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return isActive;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
