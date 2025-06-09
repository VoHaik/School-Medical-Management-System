package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "NotificationTypes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"type_name"})
})
public class NotificationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_type_id")
    private Integer notificationTypeId;

    @Column(name = "type_name", nullable = false, length = 50)
    private String typeName;

    @Column(name = "template_identifier", length = 100)
    private String templateIdentifier;

    // Constructors, getters, and setters are handled by Lombok
}
