package com.samiullah.financial_system.exceptions;

public class CompanyAlreadyExistsException extends RuntimeException{
    public CompanyAlreadyExistsException(String message){
        super(message);
    }
}
