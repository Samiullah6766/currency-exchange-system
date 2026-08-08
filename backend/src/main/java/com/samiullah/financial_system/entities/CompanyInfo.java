package com.samiullah.financial_system.entities;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "company_info")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompanyInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private UUID uuid;

    @Column(nullable = false)
    private Boolean synced = false;
    private String companyName;

    private String ownerName;

    private String address;

    private String phone;

    private String email;

    private String logoPath;

    @UpdateTimestamp
    private LocalDateTime lastModified;

    @PrePersist
    public void prePersist() {

        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }

}
