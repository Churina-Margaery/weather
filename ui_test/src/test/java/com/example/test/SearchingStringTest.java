package com.example.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.example.elements.SearchString;
import io.qameta.allure.Allure;

@DisplayName("Строка поиска")
public class SearchingStringTest extends BaseTest {
    
    @Test
    @DisplayName("Отображение элементов заголовочной строки поиска")
    public void checkUI() {
        SearchString searchString = new SearchString();

        Allure.step("Отображение элементов строки поиска", () -> {
            searchString.checkUI();
        });    
    }

    @Test
    @DisplayName("Ввод текста в строки поиска")
    public void setText() {
        SearchString searchString = new SearchString();

        Allure.step("Ввод \"Санкт-Петербург\" в строку поиска", () -> {
            searchString.setFullText("Санкт-Петербург", "Ленинградская область", "Россия");
        });

        Allure.step("Проверка соответствия значению поля", () -> {
            assertEquals("Санкт-Петербург", searchString.getCity());
            assertEquals("Ленинградская область", searchString.getState());
            assertEquals("Россия", searchString.getCountry());
        });
    }
}
