package com.samiullah.financial_system.controllers;

import com.samiullah.financial_system.remittanceDtos.RemittanceRequest;
import com.samiullah.financial_system.remittanceDtos.RemittanceResponse;
import com.samiullah.financial_system.services.RemittanceService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/remittances")
@AllArgsConstructor
public class RemittanceController {

    RemittanceService remittanceService;

    @PostMapping("/createRemittance")
    public ResponseEntity<RemittanceResponse> createRemittance(@RequestBody RemittanceRequest remittanceRequest){
       RemittanceResponse remittanceResponse =  remittanceService.createRemittance(remittanceRequest);
       return ResponseEntity.ok(remittanceResponse);
    }

    @GetMapping("/getAllRemittances")
    public ResponseEntity<List<RemittanceResponse>> getAllRemittances(){
        return ResponseEntity.ok(remittanceService.getAllRemittances());
    }

    @GetMapping("/remittance/{id}")
    public ResponseEntity<RemittanceResponse> getRemittanceById(@PathVariable Long id){
        return ResponseEntity.ok(remittanceService.getRemittanceById(id));
    }

    @PutMapping("/updateRemittance/{id}")
    public ResponseEntity<RemittanceResponse> updateRemittance(@PathVariable Long id, @RequestBody RemittanceRequest remittanceRequest){
        RemittanceResponse remittanceResponse =  remittanceService.updateRemittance(id, remittanceRequest);
        return ResponseEntity.ok(remittanceResponse);
    }

}
