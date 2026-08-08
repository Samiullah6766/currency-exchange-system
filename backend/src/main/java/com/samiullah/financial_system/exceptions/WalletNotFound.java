package com.samiullah.financial_system.exceptions;

public class WalletNotFound extends RuntimeException{
    public WalletNotFound(String message) {
        super(message);
    }
}
