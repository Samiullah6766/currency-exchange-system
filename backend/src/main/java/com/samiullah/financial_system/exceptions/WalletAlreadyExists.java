package com.samiullah.financial_system.exceptions;

public class WalletAlreadyExists extends RuntimeException{
    public WalletAlreadyExists(String message){
        super(message);
    }

}
