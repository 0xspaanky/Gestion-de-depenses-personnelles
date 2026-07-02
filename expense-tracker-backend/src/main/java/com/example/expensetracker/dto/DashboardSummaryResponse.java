package com.example.expensetracker.dto;

import java.math.BigDecimal;

/**
 * High-level numbers for the dashboard cards.
 */
public class DashboardSummaryResponse {

    private BigDecimal totalExpenses;
    private long count;
    private BigDecimal average;
    private BigDecimal highest;

    public DashboardSummaryResponse(BigDecimal totalExpenses, long count, BigDecimal average, BigDecimal highest) {
        this.totalExpenses = totalExpenses;
        this.count = count;
        this.average = average;
        this.highest = highest;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public long getCount() {
        return count;
    }

    public BigDecimal getAverage() {
        return average;
    }

    public BigDecimal getHighest() {
        return highest;
    }
}
