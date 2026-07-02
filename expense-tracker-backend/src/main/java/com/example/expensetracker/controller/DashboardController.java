package com.example.expensetracker.controller;

import com.example.expensetracker.dto.CategoryStatsResponse;
import com.example.expensetracker.dto.DashboardSummaryResponse;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.dto.MonthlyStatsResponse;
import com.example.expensetracker.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST endpoints that feed the dashboard charts and cards.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse summary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/monthly")
    public List<MonthlyStatsResponse> monthly() {
        return dashboardService.getMonthly();
    }

    @GetMapping("/categories")
    public List<CategoryStatsResponse> categories() {
        return dashboardService.getCategories();
    }

    @GetMapping("/recent")
    public List<ExpenseResponse> recent() {
        return dashboardService.getRecent();
    }
}
