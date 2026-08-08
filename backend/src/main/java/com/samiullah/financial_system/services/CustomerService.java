package com.samiullah.financial_system.services;

import com.samiullah.financial_system.dtos.CustomerDto;
import com.samiullah.financial_system.entities.Customer;
import com.samiullah.financial_system.entities.User;
import com.samiullah.financial_system.exceptions.CustomerAlreadyExistsException;
import com.samiullah.financial_system.exceptions.UserNameNotFoundException;
import com.samiullah.financial_system.mappers.Mapper;
import com.samiullah.financial_system.repositories.CustomerRepository;
import com.samiullah.financial_system.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNameNotFoundException("User not found"));
    }

    public CustomerDto registerCustomer(CustomerDto customerDto) {
        User currentUser = getCurrentUser();
        Optional<Customer> existingCustomer =
                customerRepository.findByFirstNameAndLastNameAndCompanyInfo(
                        customerDto.getFirstName(),
                        customerDto.getLastName(),
                        currentUser.getCompanyInfo()
                        );

        System.out.println(existingCustomer);

        existingCustomer.ifPresent(customer -> {
            throw new CustomerAlreadyExistsException("Already exists");
        });

        Customer customer = Mapper.maptoCustomer( customerDto );

        customer.setCompanyInfo(currentUser.getCompanyInfo());

        Customer savedCustomer = customerRepository.save(customer);

        CustomerDto customerDto1 = Mapper.maptoCustomerDto( savedCustomer );

        return customerDto1;
    }
    public List<CustomerDto> getAllCustomers() {
        User currentUser = getCurrentUser();
        List<Customer> customers = customerRepository.findAllByCompanyInfo(currentUser.getCompanyInfo());

        return customers.stream().map((customer -> Mapper.maptoCustomerDto(customer))).toList();
    }

    public CustomerDto updateCustomer(CustomerDto customerDto, Long id) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByIdAndCompanyInfo(id, currentUser.getCompanyInfo())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with id " + id));

        customer.setFirstName(customerDto.getFirstName());
        customer.setLastName(customerDto.getLastName());
        customer.setFatherName(customerDto.getFatherName());
        customer.setEmail(customerDto.getEmail());
        customer.setNumber(customerDto.getNumber());
        customer.setAddress(customerDto.getAddress());

        customer.setCompanyInfo(currentUser.getCompanyInfo());

        customer.setSynced(false);

        Customer updatedCustomer = customerRepository.save(customer);

        return Mapper.maptoCustomerDto(updatedCustomer);
    }

    public CustomerDto getCustomer(Long id) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByIdAndCompanyInfo(id, currentUser.getCompanyInfo()).orElseThrow( () -> new RuntimeException( "Customer with id " + id + " not found." ) );
        CustomerDto customerDto2 = Mapper.maptoCustomerDto( customer );
        return customerDto2;
    }

    public void deleteCustomer(Long id) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByIdAndCompanyInfo(id,
                currentUser.getCompanyInfo()).orElseThrow( () -> new RuntimeException( "Customer with id " + id + " not found." ) );
        customerRepository.delete(customer);
    }

    public List<CustomerDto> findCustomersByFirstName(String firstName) {
        User currentUser = getCurrentUser();
        return customerRepository.findAllByFirstNameAndCompanyInfo(firstName, currentUser.getCompanyInfo())
                .stream()
                .map(Mapper::maptoCustomerDto)
                .toList();
    }

    public Integer numberOfCustomers() {
        User currentUser = getCurrentUser();
        return customerRepository.findAllByCompanyInfo(currentUser.getCompanyInfo()).size();
    }
}
