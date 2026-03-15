package com.example.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.example.elements.AdditionalInfoBlock;
import com.example.elements.MainInfoBlock;
import com.example.elements.NextDayWeatherBlock;
import com.example.elements.SearchString;
import com.example.elements.StatisticBlock;
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
        SearchString searchString = new SearchString();

        Allure.step("Проверили доступность и переключили тему", () -> {
            searchString.changeTheme();
        });
    }

    @Test
    @DisplayName("Проверка колонки с основной информацией")
    public void checkMainInformation() {
        MainInfoBlock mainInfoBlock= new MainInfoBlock();

        Allure.step("Проверяем отображения основной информации: температура, погода, город и дата", () -> {
            assertTrue(mainInfoBlock.checkTemperature());
            assertTrue(mainInfoBlock.checkWeather());
            mainInfoBlock.checkCity("Saint-Petersburg");
            mainInfoBlock.checkDate();
        });
    }

    @Test
    @DisplayName("Проверка блока с подробной информацией")
    public void checkAdditionalInformation() {
        AdditionalInfoBlock additionalInfoBlock = new AdditionalInfoBlock();

        Allure.step("Проверяем отображения подрбной информации: ветер, видимость, давление: влжность: рассвет и закат", () -> {
            additionalInfoBlock.checkWind();
            additionalInfoBlock.checkVisibility();
            additionalInfoBlock.checkPressure();
            additionalInfoBlock.checkHumidity();
            additionalInfoBlock.checkSunrise();
            additionalInfoBlock.checkSunset();
        });
    }

    @Test
    @DisplayName("Проверка блока с информацией о погоде на следующий день")
    public void checkNextHoursInformation() {
        NextDayWeatherBlock nextDayWeatherBlock = new NextDayWeatherBlock();

        Allure.step("Проверяем отображение погоды в следующие несколько часов", () -> {
            nextDayWeatherBlock.checkDaysList();
            nextDayWeatherBlock.checkTimeList();
            nextDayWeatherBlock.checkTemperatureList();
        });
    }

    @Test
    @DisplayName("Проверка отображения блока со статистикой")
    public void checkStatisticBlock() {

        StatisticBlock statisticBlock = new StatisticBlock();

        Allure.step("Проверка отображения блока статистика", () -> {
            statisticBlock.openSelect(true);
            statisticBlock.checkCurrentOption(true, "Temperature");
            statisticBlock.checkOptions(true);

            statisticBlock.openSelect(false);
            statisticBlock.checkCurrentOption(false, "Temperature");
            statisticBlock.checkOptions(false);
        });
    }

    @Test
    @DisplayName("Изменение параметра в статистике за три дня")
    public void changeParametrForThreeDays() {
        
        StatisticBlock statisticBlock = new StatisticBlock();

        Allure.step("Открываем список опций и проверяем его", () -> {
            statisticBlock.openSelect(true);
            statisticBlock.checkCurrentOption(true, "Temperature");
            statisticBlock.checkOptions(true);
        });

        Allure.step("Выбираем новую опцию", () -> {
            statisticBlock.chooseOption("Pressure", true);
            statisticBlock.checkCurrentOption(true, "Pressure");
        });
    }

    @Test
    @DisplayName("Изменение параметра в статистике за 10 дней")
    public void changeParametrForTenDays() {
        
        StatisticBlock statisticBlock = new StatisticBlock();

        Allure.step("Открываем список опций и проверяем его", () -> {
            statisticBlock.openSelect(false);
            statisticBlock.checkCurrentOption(false, "Temperature");
            statisticBlock.checkOptions(false);
        });

        Allure.step("Выбираем новую опцию и проверяем ее", () -> {
            statisticBlock.chooseOption("Humidity", false);
            statisticBlock.checkCurrentOption(false, "Humidity");
        });
    }
}
