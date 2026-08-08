package com.samiullah.financial_system.exceptions;

public class CompanyNotFoundException extends RuntimeException {
    public CompanyNotFoundException(String message) {
        super(message);
    }
}
