package com.example.expensetracker.dto;

import java.math.BigDecimal;

/**
 * Total spending for one month, e.g. month = "2026-06" (used by the bar chart).
 */
public class MonthlyStatsResponse {

    private String month;
    private BigDecimal total;

    public MonthlyStatsResponse(String month, BigDecimal total) {
        this.month = month;
        this.total = total;
    }

    public String getMonth() {
        return month;
    }

    public BigDecimal getTotal() {
        return total;
    }
}
