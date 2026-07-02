package com.example.expensetracker.repository;

import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // All expenses of a user, newest first.
    List<Expense> findByUserOrderByDateDesc(User user);

    // A single expense that belongs to a given user (used to prevent reading others' data).
    Optional<Expense> findByIdAndUser(Long id, User user);

    // Keyword search in title OR description (case-insensitive), scoped to the user.
    @Query("SELECT e FROM Expense e WHERE e.user = :user AND ("
            + " LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%'))"
            + " OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')))"
            + " ORDER BY e.date DESC")
    List<Expense> search(@Param("user") User user, @Param("keyword") String keyword);

    // Flexible filter. Any parameter left null is simply ignored.
    @Query("SELECT e FROM Expense e WHERE e.user = :user"
            + " AND (:category IS NULL OR e.category = :category)"
            + " AND (:startDate IS NULL OR e.date >= :startDate)"
            + " AND (:endDate IS NULL OR e.date <= :endDate)"
            + " AND (:minAmount IS NULL OR e.amount >= :minAmount)"
            + " AND (:maxAmount IS NULL OR e.amount <= :maxAmount)"
            + " ORDER BY e.date DESC")
    List<Expense> filter(@Param("user") User user,
                         @Param("category") Category category,
                         @Param("startDate") LocalDate startDate,
                         @Param("endDate") LocalDate endDate,
                         @Param("minAmount") BigDecimal minAmount,
                         @Param("maxAmount") BigDecimal maxAmount);
}
