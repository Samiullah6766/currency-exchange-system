package com.samiullah.financial_system.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer id;

    private String username;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToOne
    @JoinColumn(name="company_info_id")
    private CompanyInfo companyInfo;

    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @Column(nullable = false)
    private Boolean synced = false;

    @UpdateTimestamp
    private LocalDateTime lastModified;

    @PrePersist
    public void prePersist() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
        if (synced == null) {
            synced = false;
        }
    }


}
