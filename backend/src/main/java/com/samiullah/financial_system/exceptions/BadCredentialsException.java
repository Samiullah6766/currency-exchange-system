package com.samiullah.financial_system.exceptions;

public class BadCredentialsException extends RuntimeException{
    public BadCredentialsException(String message){
        super(message);
    }
}
