package com.example.test;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.example.Utils;
import com.example.elements.SearchString;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import io.qameta.allure.Allure;

@WireMockTest(httpPort = 5000)
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
    @DisplayName("Ввод текста в строку поиска")
    public void setText() {
        SearchString searchString = new SearchString();

        Allure.step("Ввод \"Санкт-Петербург\" в строку поиска", () -> {
            searchString.setText("Санкт-Петербург");
        });

        Allure.step("Проверка соответствия значению поля", () -> {
            assertEquals("Санкт-Петербург", searchString.getText());
        });
    }

    @Test
    @DisplayName("Поиск погоды в городе")
    public void searchWeatherInCity() {
        SearchString searchString = new SearchString();

        Utils.stubCity("Москва");

        Allure.step("Поиск \"Москвы\"", () -> {
            searchString.findCity("Москва");
        });

        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        Allure.step("Проверка того, что были вызваны методы", () -> {
            verify(getRequestedFor(urlPathEqualTo("/"))
                .withQueryParam("city_name", equalTo("Москва")));
            verify(getRequestedFor(urlPathEqualTo("/forecast/"))
                .withQueryParam("city_name", equalTo("Москва")));
            verify(getRequestedFor(urlPathEqualTo("/3days/"))
                .withQueryParam("city_name", equalTo("Москва")));
            verify(getRequestedFor(urlPathEqualTo("/10days/"))
                .withQueryParam("city_name", equalTo("Москва")));
        });
    }
}
