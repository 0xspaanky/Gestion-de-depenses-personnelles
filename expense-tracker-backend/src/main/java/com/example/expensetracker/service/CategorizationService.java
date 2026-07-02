package com.example.expensetracker.service;

import com.example.expensetracker.enums.Category;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Very simple, explainable automatic categorization.
 * It just looks for keywords in the title/description text.
 * No AI or machine learning is used.
 */
@Service
public class CategorizationService {

    // For each category, the list of keywords that trigger it.
    private static final Map<Category, List<String>> KEYWORDS = Map.of(
            Category.FOOD, List.of("restaurant", "food", "pizza", "coffee", "café", "cafe", "lunch", "dinner", "grocery"),
            Category.TRANSPORT, List.of("taxi", "bus", "train", "fuel", "gas", "uber", "metro", "parking"),
            Category.HEALTH, List.of("doctor", "pharmacy", "medicine", "hospital", "clinic", "dentist"),
            Category.EDUCATION, List.of("school", "course", "book", "university", "tuition", "exam"),
            Category.BILLS, List.of("electricity", "water", "internet", "phone", "rent", "bill"),
            Category.SHOPPING, List.of("clothes", "shopping", "shoes", "amazon", "store"),
            Category.ENTERTAINMENT, List.of("movie", "cinema", "game", "netflix", "concert", "music"),
            Category.TRAVEL, List.of("hotel", "flight", "trip", "travel", "airbnb", "booking")
    );

    /**
     * Detect a category from the given title and description.
     * Returns OTHER if no keyword matches.
     */
    public Category detectCategory(String title, String description) {
        String text = ((title == null ? "" : title) + " " + (description == null ? "" : description))
                .toLowerCase();

        for (Map.Entry<Category, List<String>> entry : KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (text.contains(keyword)) {
                    return entry.getKey();
                }
            }
        }
        return Category.OTHER;
    }
}
