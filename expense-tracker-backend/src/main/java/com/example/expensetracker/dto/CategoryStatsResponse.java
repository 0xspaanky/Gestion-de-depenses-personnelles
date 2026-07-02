package com.example.expensetracker.dto;

import com.example.expensetracker.enums.Category;

import java.math.BigDecimal;

/**
 * Total amount and number of expenses for one category (used by the pie chart).
 */
public class CategoryStatsResponse {

    private Category category;
    private BigDecimal total;
    private long count;

    public CategoryStatsResponse(Category category, BigDecimal total, long count) {
        this.category = category;
        this.total = total;
        this.count = count;
    }

    public Category getCategory() {
        return category;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public long getCount() {
        return count;
    }
}
