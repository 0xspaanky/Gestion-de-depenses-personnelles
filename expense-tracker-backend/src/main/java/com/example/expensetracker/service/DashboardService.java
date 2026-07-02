package com.example.expensetracker.service;

import com.example.expensetracker.dto.CategoryStatsResponse;
import com.example.expensetracker.dto.DashboardSummaryResponse;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.dto.MonthlyStatsResponse;
import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.enums.Category;
import com.example.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * Builds the analytical data shown on the dashboard.
 * To keep things simple and explainable, the numbers are computed in Java
 * from the user's expenses rather than with complex SQL aggregation.
 */
@Service
public class DashboardService {

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final ExpenseRepository expenseRepository;
    private final CurrentUserService currentUserService;

    public DashboardService(ExpenseRepository expenseRepository,
                            CurrentUserService currentUserService) {
        this.expenseRepository = expenseRepository;
        this.currentUserService = currentUserService;
    }

    public DashboardSummaryResponse getSummary() {
        List<Expense> expenses = currentUserExpenses();

        BigDecimal total = BigDecimal.ZERO;
        BigDecimal highest = BigDecimal.ZERO;
        for (Expense e : expenses) {
            total = total.add(e.getAmount());
            if (e.getAmount().compareTo(highest) > 0) {
                highest = e.getAmount();
            }
        }

        long count = expenses.size();
        BigDecimal average = count == 0
                ? BigDecimal.ZERO
                : total.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);

        return new DashboardSummaryResponse(total, count, average, highest);
    }

    public List<MonthlyStatsResponse> getMonthly() {
        // TreeMap keeps the months sorted chronologically.
        Map<String, BigDecimal> totals = new TreeMap<>();
        for (Expense e : currentUserExpenses()) {
            String month = e.getDate().format(MONTH_FORMAT);
            totals.merge(month, e.getAmount(), BigDecimal::add);
        }

        List<MonthlyStatsResponse> result = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : totals.entrySet()) {
            result.add(new MonthlyStatsResponse(entry.getKey(), entry.getValue()));
        }
        return result;
    }

    public List<CategoryStatsResponse> getCategories() {
        Map<Category, BigDecimal> totals = new java.util.EnumMap<>(Category.class);
        Map<Category, Long> counts = new java.util.EnumMap<>(Category.class);

        for (Expense e : currentUserExpenses()) {
            totals.merge(e.getCategory(), e.getAmount(), BigDecimal::add);
            counts.merge(e.getCategory(), 1L, Long::sum);
        }

        List<CategoryStatsResponse> result = new ArrayList<>();
        for (Category category : totals.keySet()) {
            result.add(new CategoryStatsResponse(category, totals.get(category), counts.get(category)));
        }
        return result;
    }

    public List<ExpenseResponse> getRecent() {
        // The repository already returns expenses newest-first; take the first 5.
        return currentUserExpenses().stream()
                .limit(5)
                .map(ExpenseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private List<Expense> currentUserExpenses() {
        User user = currentUserService.getCurrentUser();
        return expenseRepository.findByUserOrderByDateDesc(user);
    }
}
