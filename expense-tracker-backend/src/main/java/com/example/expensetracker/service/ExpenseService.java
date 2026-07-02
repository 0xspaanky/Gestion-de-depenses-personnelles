package com.example.expensetracker.service;

import com.example.expensetracker.dto.ExpenseRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.enums.Category;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for expenses: CRUD, search and filter.
 * Every operation is scoped to the currently logged-in user.
 */
@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategorizationService categorizationService;
    private final CurrentUserService currentUserService;

    public ExpenseService(ExpenseRepository expenseRepository,
                          CategorizationService categorizationService,
                          CurrentUserService currentUserService) {
        this.expenseRepository = expenseRepository;
        this.categorizationService = categorizationService;
        this.currentUserService = currentUserService;
    }

    public List<ExpenseResponse> getAll() {
        User user = currentUserService.getCurrentUser();
        return toResponseList(expenseRepository.findByUserOrderByDateDesc(user));
    }

    public ExpenseResponse getById(Long id) {
        return ExpenseResponse.fromEntity(findOwnedExpense(id));
    }

    public ExpenseResponse create(ExpenseRequest request) {
        User user = currentUserService.getCurrentUser();

        Expense expense = new Expense();
        expense.setUser(user);
        applyRequest(expense, request);

        return ExpenseResponse.fromEntity(expenseRepository.save(expense));
    }

    public ExpenseResponse update(Long id, ExpenseRequest request) {
        Expense expense = findOwnedExpense(id);
        applyRequest(expense, request);
        return ExpenseResponse.fromEntity(expenseRepository.save(expense));
    }

    public void delete(Long id) {
        Expense expense = findOwnedExpense(id);
        expenseRepository.delete(expense);
    }

    public List<ExpenseResponse> search(String keyword) {
        User user = currentUserService.getCurrentUser();
        if (keyword == null) {
            keyword = "";
        }
        return toResponseList(expenseRepository.search(user, keyword));
    }

    public List<ExpenseResponse> filter(Category category,
                                        LocalDate startDate,
                                        LocalDate endDate,
                                        BigDecimal minAmount,
                                        BigDecimal maxAmount) {
        User user = currentUserService.getCurrentUser();
        return toResponseList(
                expenseRepository.filter(user, category, startDate, endDate, minAmount, maxAmount));
    }

    // --- helpers ---

    /** Copy request fields onto the entity, applying auto-categorization if needed. */
    private void applyRequest(Expense expense, ExpenseRequest request) {
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setPaymentMethod(request.getPaymentMethod());

        // If the user did not pick a category, detect it automatically from the text.
        Category category = request.getCategory();
        if (category == null) {
            category = categorizationService.detectCategory(request.getTitle(), request.getDescription());
        }
        expense.setCategory(category);
    }

    /** Load an expense that belongs to the current user, or fail with 404. */
    private Expense findOwnedExpense(Long id) {
        User user = currentUserService.getCurrentUser();
        return expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id " + id));
    }

    private List<ExpenseResponse> toResponseList(List<Expense> expenses) {
        return expenses.stream()
                .map(ExpenseResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
