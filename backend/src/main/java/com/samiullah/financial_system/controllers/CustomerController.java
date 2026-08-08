package com.samiullah.financial_system.controllers;

import com.samiullah.financial_system.dtos.CustomerDto;
import com.samiullah.financial_system.dtos.CustomerTransactionSummary;
import com.samiullah.financial_system.dtos.TransactionResponseDto;
import com.samiullah.financial_system.services.CustomerService;
import com.samiullah.financial_system.services.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/customers")
@AllArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final TransactionService transactionService;

    @PostMapping("/customerRegistration")
    public ResponseEntity<CustomerDto> registerCustomer(
            @RequestBody CustomerDto customerDto) {
        CustomerDto savedCustomer =
                customerService.registerCustomer(customerDto);
        return ResponseEntity.ok(savedCustomer);
    }
    @GetMapping
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
       List<CustomerDto> customers =  customerService.getAllCustomers();
       return ResponseEntity.ok(customers);
    }
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(@RequestBody CustomerDto customerDto, @PathVariable Long id) {
        CustomerDto customerDto1 = customerService.updateCustomer(customerDto, id);

        return ResponseEntity.ok(customerDto1);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomer(@PathVariable Long id){
        CustomerDto customerDto = customerService.getCustomer(id);
        return ResponseEntity.ok(customerDto);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/search")
    public ResponseEntity<List<CustomerDto>> findByCustomerFirstName(@RequestParam String customerfirstName) {
        List<CustomerDto> customerDto = customerService.findCustomersByFirstName(customerfirstName);
        return ResponseEntity.ok(customerDto);
    }
    @GetMapping("/numberofcustomers")
    public ResponseEntity<Integer>  numberOfCustomers() {
        int numCustomers = customerService.numberOfCustomers();
        return ResponseEntity.ok(numCustomers);
    }
}