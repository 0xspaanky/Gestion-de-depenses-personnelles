package com.example.expensetracker.exception;

/**
 * Thrown when a requested entity (e.g. an expense) does not exist.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
