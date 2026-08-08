package com.samiullah.financial_system.exceptions;

public class CustomerAlreadyExistsException extends RuntimeException{
    public  CustomerAlreadyExistsException(String message) {
        super(message);
    }
}
