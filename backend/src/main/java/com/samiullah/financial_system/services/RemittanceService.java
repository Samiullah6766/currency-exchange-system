package com.samiullah.financial_system.services;

import com.samiullah.financial_system.entities.Remittance;

import com.samiullah.financial_system.entities.User;
import com.samiullah.financial_system.exceptions.UserNameNotFoundException;
import com.samiullah.financial_system.remittanceDtos.RemittanceRequest;
import com.samiullah.financial_system.remittanceDtos.RemittanceResponse;
import com.samiullah.financial_system.repositories.RemittanceRepository;
import com.samiullah.financial_system.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RemittanceService {

    private final RemittanceRepository repository;
    private UserRepository userRepository;

    public RemittanceService(RemittanceRepository repository,
                             UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNameNotFoundException("User not found"));
    }

    public RemittanceResponse createRemittance(RemittanceRequest remittanceRequest) {
        Remittance remittance = new Remittance();
        remittance.setRemittanceCode(remittanceRequest.getRemittanceCode());
        remittance.setSender(remittanceRequest.getSender());
        remittance.setReceiver(remittanceRequest.getReceiver());
        remittance.setAmount(remittanceRequest.getAmount());
        remittance.setMoneyType(remittanceRequest.getMoneyType());
        remittance.setDescription(remittanceRequest.getDescription());
        remittance.setDestination(remittanceRequest.getDestination());
        remittance.setTransferFee(remittanceRequest.getTransferFee());
        remittance.setAddress(remittanceRequest.getAddress());
        remittance.setDate(remittanceRequest.getDate());
        remittance.setSenderPhone(remittanceRequest.getSenderPhone());
        User currenUser = getCurrentUser();
        remittance.setCompanyInfo(currenUser.getCompanyInfo());
        repository.save(remittance);

        RemittanceResponse remittanceResponse = new RemittanceResponse();
        remittanceResponse.setRemittanceId(remittance.getId());
        remittanceResponse.setRemittanceCode(remittance.getRemittanceCode());
        remittanceResponse.setSender(remittance.getSender());
        remittanceResponse.setReceiver(remittance.getReceiver());
        remittanceResponse.setAmount(remittance.getAmount());
        remittanceResponse.setMoneyType(remittance.getMoneyType());
        remittanceResponse.setDescription(remittance.getDescription());
        remittanceResponse.setDestination(remittance.getDestination());
        remittanceResponse.setTransferFee(remittance.getTransferFee());
        remittanceResponse.setAddress(remittance.getAddress());
        remittanceResponse.setDate(remittance.getDate());
        remittanceResponse.setSenderPhone(remittance.getSenderPhone());

        return remittanceResponse;
    }

    public List<RemittanceResponse> getAllRemittances() {
        User currentUser = getCurrentUser();
        List<Remittance> remittances =  repository.findAllByCompanyInfo(currentUser.getCompanyInfo());

        return remittances.stream().map((remittance -> new RemittanceResponse(
                remittance.getId(),
                remittance.getRemittanceCode(),
                remittance.getSender(),
                remittance.getReceiver(),
                remittance.getMoneyType(),
                remittance.getAmount(),
                remittance.getTransferFee(),
                remittance.getAddress(),
                remittance.getDescription(),
                remittance.getDestination(),
                remittance.getDate(),
                remittance.getSenderPhone()

        ))).toList();
    }

    public RemittanceResponse getRemittanceById(Long remittanceId) {
        User currentUser = getCurrentUser();
        Remittance remittance =  repository.findByIdAndCompanyInfo(remittanceId, currentUser.getCompanyInfo()).orElseThrow(
                () -> new RuntimeException("No remittance with this ID")
        );

        RemittanceResponse remittanceResponse = new RemittanceResponse();
        remittanceResponse.setRemittanceId(remittance.getId());
        remittanceResponse.setRemittanceCode(remittance.getRemittanceCode());
        remittanceResponse.setSender(remittance.getSender());
        remittanceResponse.setReceiver(remittance.getReceiver());
        remittanceResponse.setAmount(remittance.getAmount());
        remittanceResponse.setAddress(remittance.getAddress());
        remittanceResponse.setTransferFee(remittance.getTransferFee());
        remittanceResponse.setMoneyType(remittance.getMoneyType());
        remittanceResponse.setDescription(remittance.getDescription());
        remittanceResponse.setDestination(remittance.getDestination());
        remittanceResponse.setDate(remittance.getDate());
        remittanceResponse.setSenderPhone(remittance.getSenderPhone());

        return remittanceResponse;
    }

    public RemittanceResponse updateRemittance(long remittanceId, RemittanceRequest remittanceRequest) {
        User currentUser = getCurrentUser();
        Remittance remittance =  repository.findByIdAndCompanyInfo(remittanceId, currentUser.getCompanyInfo()).orElseThrow(
                () -> new RuntimeException("No remittance with this ID"));

        remittance.setRemittanceCode(remittanceRequest.getRemittanceCode());
        remittance.setSender(remittanceRequest.getSender());
        remittance.setReceiver(remittanceRequest.getReceiver());
        remittance.setAmount(remittanceRequest.getAmount());
        remittance.setMoneyType(remittanceRequest.getMoneyType());
        remittance.setDescription(remittanceRequest.getDescription());
        remittance.setDestination(remittanceRequest.getDestination());
        remittance.setTransferFee(remittanceRequest.getTransferFee());
        remittance.setAddress(remittanceRequest.getAddress());
        remittance.setDate(remittanceRequest.getDate());
        remittance.setSenderPhone(remittanceRequest.getSenderPhone());

        remittance.setCompanyInfo(currentUser.getCompanyInfo());
        remittance.setSynced(false);
        Remittance savedRemittance =  repository.save(remittance);

        RemittanceResponse remittanceResponse = new RemittanceResponse();
        remittanceResponse.setRemittanceId(remittanceId);
        remittanceResponse.setRemittanceCode(savedRemittance.getRemittanceCode());
        remittanceResponse.setSender(savedRemittance.getSender());
        remittanceResponse.setReceiver(savedRemittance.getReceiver());
        remittanceResponse.setAmount(savedRemittance.getAmount());
        remittanceResponse.setDescription(savedRemittance.getDescription());
        remittanceResponse.setAddress(savedRemittance.getAddress());
        remittanceResponse.setDate(savedRemittance.getDate());
        remittanceResponse.setSenderPhone(savedRemittance.getSenderPhone());
        remittanceResponse.setTransferFee(savedRemittance.getTransferFee());
        remittanceResponse.setMoneyType(savedRemittance.getMoneyType());
        remittanceResponse.setDestination(savedRemittance.getDestination());

        return remittanceResponse;

    }

}
