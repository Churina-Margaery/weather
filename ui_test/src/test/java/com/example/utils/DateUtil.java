package com.example.utils; 

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;

public class DateUtil {
    public static String getCurrentDate() {
        LocalDate today = LocalDate.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d", Locale.ENGLISH);
        String formattedDate = today.format(formatter);

        return formattedDate;
    }

    public static String getNextDayOfWeek() {
        LocalDate nextDay = LocalDate.now().plusDays(1);
        return nextDay.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
    }
}
