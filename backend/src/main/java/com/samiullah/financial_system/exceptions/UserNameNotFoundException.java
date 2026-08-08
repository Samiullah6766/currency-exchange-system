package com.samiullah.financial_system.exceptions;

public class UserNameNotFoundException extends RuntimeException{
    public UserNameNotFoundException(String message){
        super(message);
    }

}
