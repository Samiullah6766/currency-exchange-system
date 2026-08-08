package com.samiullah.financial_system.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "remittances")
public class Remittance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @Column(nullable = false)
    private Boolean synced = false;
    private Integer remittanceCode;
    private String sender;
    private String receiver;
    private MoneyType moneyType;
    private BigDecimal amount;
    private BigDecimal transferFee;
    private String address;
    private String description;
    private String destination;
    private LocalDate date;
    private String senderPhone;

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
