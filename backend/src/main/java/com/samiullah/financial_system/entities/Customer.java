package com.samiullah.financial_system.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "customers")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @Column(nullable = false)
    private Boolean synced = false;
    private String firstName;
    private String lastName;
    private String fatherName;
    private String email;
    private String number;
    private String address;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private List<Transaction> transactions;


    @ManyToOne
    @JoinColumn(name="company_info_id")
    private CompanyInfo companyInfo;

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
