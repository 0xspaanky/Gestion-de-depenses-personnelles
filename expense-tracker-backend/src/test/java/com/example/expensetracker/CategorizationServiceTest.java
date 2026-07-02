package com.example.expensetracker;

import com.example.expensetracker.enums.Category;
import com.example.expensetracker.service.CategorizationService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Basic unit tests for the keyword-based automatic categorization.
 */
class CategorizationServiceTest {

    private final CategorizationService service = new CategorizationService();

    @Test
    void detectsFoodFromKeyword() {
        assertEquals(Category.FOOD, service.detectCategory("Dinner at restaurant", null));
        assertEquals(Category.FOOD, service.detectCategory("Pizza", "with friends"));
    }

    @Test
    void detectsTransportFromKeyword() {
        assertEquals(Category.TRANSPORT, service.detectCategory("Taxi ride", null));
        assertEquals(Category.TRANSPORT, service.detectCategory("Monthly bus pass", null));
    }

    @Test
    void detectsBillsFromKeyword() {
        assertEquals(Category.BILLS, service.detectCategory("Electricity", "monthly bill"));
    }

    @Test
    void fallsBackToOther() {
        assertEquals(Category.OTHER, service.detectCategory("Random purchase", "nothing special"));
    }
}
