package com.samiullah.financial_system.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(CompanyNotFoundException.class)
    public ResponseEntity<String> handleCompanyNotFound(
            CompanyNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(CompanyAlreadyExistsException.class)
    public ResponseEntity<String> handleCompanyExists(
            CompanyAlreadyExistsException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
    @ExceptionHandler(WalletAlreadyExists.class)
    public ResponseEntity<String> handleWalletAlreadyExists(
            WalletAlreadyExists ex
    ){
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
    @ExceptionHandler(WalletNotFound.class)
    public ResponseEntity<String> handleWalletNotFound(
            WalletNotFound ex
    ){
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<String> handleInsufficientBalance(
            InsufficientBalanceException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST) // or CONFLICT
                .body(ex.getMessage());
    }
    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<String> handleCustomerNotFound(
            CustomerNotFoundException ex
    ){
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }
    @ExceptionHandler(CustomerAlreadyExistsException.class)
    public ResponseEntity<String> handleCustomerExists(
            CustomerAlreadyExistsException ex
    ){
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
    @ExceptionHandler(UserNameNotFoundException.class)
    public ResponseEntity<String> handleUserNameNotFound(
            UserNameNotFoundException ex
    ){
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(
            BadCredentialsException ex
    ){
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ex.getMessage());
    }
}
