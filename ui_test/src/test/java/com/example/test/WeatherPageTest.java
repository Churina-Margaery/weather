package com.example.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.example.elements.SearchString;
import com.example.pages.GitHubPage;
import io.qameta.allure.Allure;
import static com.codeborne.selenide.Selenide.switchTo;

@DisplayName("Основной экран")
public class WeatherPageTest extends BaseTest {
    
    @Test
    @DisplayName("Открытие GitHub по нажатию на Support Project")
    public void openSupport() {

        SearchString searchString = new SearchString();

        Allure.step("Отображение элементов строки поиска", () -> {
            searchString.checkUI();
        });

        Allure.step("Переход на Гитхаб и проверка отображения и URL", () -> {
            GitHubPage gitHubPage = searchString.openSupport();
            switchTo().window(1);
            gitHubPage.checkUI();
            assertEquals("https://github.com/Churina-Margaery/weather", gitHubPage.checkUrl());
        });
    }

    @Test
    @DisplayName("Проверка кликабельности кнопки изменения темы")
    public void changeTheme() {

        Allure.step("Проверили доступность и переключили тему", () -> {
            SearchString searchString = new SearchString();
            searchString.changeTheme();
        });
    }
}
