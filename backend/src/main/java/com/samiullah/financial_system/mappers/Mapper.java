package com.samiullah.financial_system.mappers;

import com.samiullah.financial_system.dtos.CustomerDto;
import com.samiullah.financial_system.entities.Customer;
import com.samiullah.financial_system.entities.User;
import com.samiullah.financial_system.exceptions.UserNameNotFoundException;
import com.samiullah.financial_system.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;

public class Mapper {


    public static CustomerDto maptoCustomerDto(Customer customer) {
        CustomerDto customerDto = new CustomerDto();
        customerDto.setId(customer.getId());
        customerDto.setFirstName(customer.getFirstName());
        customerDto.setLastName(customer.getLastName());
        customerDto.setEmail(customer.getEmail());
        customerDto.setNumber(customer.getNumber());
        customerDto.setFatherName(customer.getFatherName());
        customerDto.setAddress(customer.getAddress());
        return customerDto;
    }
    public static Customer maptoCustomer(CustomerDto customerDto) {
        Customer customer = new Customer();

        customer.setFirstName(customerDto.getFirstName());
        customer.setLastName(customerDto.getLastName());
        customer.setFatherName(customerDto.getFatherName());
        customer.setEmail(customerDto.getEmail());
        customer.setNumber(customerDto.getNumber());
        customer.setAddress(customerDto.getAddress());
        return customer;
    }


}
