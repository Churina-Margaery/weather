package com.example.elements;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.openqa.selenium.By;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import com.example.pages.LoadablePage;

public class NextDayWeatherBlock implements LoadablePage {

    private static final By firstTemperatureDay = byXpath("//div[@data-testid = 'forecast-container']/div[1]/div/p[1]");
    private static final By firstTemperatureTime = byXpath("//div[@data-testid = 'forecast-container']/div[1]/div/p[2]");
    private static final By firstTemperatureValue = byXpath("/html/body/div/section/main/div/section[1]/div/div[3]/div[1]/h3");

    private static final By secondTemperatureDay = byXpath("//div[@data-testid = 'forecast-container']/div[2]/div/p[1]");
    private static final By secondTemperatureTime = byXpath("//div[@data-testid = 'forecast-container']/div[2]/div/p[2]");
    private static final By secondTemperatureValue = byXpath("/html/body/div/section/main/div/section[1]/div/div[3]/div[2]/h3");

    private static final By thirdTemperatureDay = byXpath("//div[@data-testid = 'forecast-container']/div[3]/div/p[1]");
    private static final By thirdTemperatureTime = byXpath("//div[@data-testid = 'forecast-container']/div[3]/div/p[2]");
    private static final By thirdTemperatureValue = byXpath("/html/body/div/section/main/div/section[1]/div/div[3]/div[3]/h3");

    private static final By fourthTemperaturDay = byXpath("//div[@data-testid = 'forecast-container']/div[4]/div/p[1]");
    private static final By fourthTemperaturTime = byXpath("//div[@data-testid = 'forecast-container']/div[4]/div/p[2]");
    private static final By fourthTemperaturValue = byXpath("/html/body/div/section/main/div/section[1]/div/div[3]/div[4]/h3");

    private static final By fifthTemperatureDay = byXpath("//div[@data-testid = 'forecast-container']/div[5]/div/p[1]");
    private static final By fifthTemperatureTime = byXpath("//div[@data-testid = 'forecast-container']/div[5]/div/p[2]");
    private static final By fifthTemperatureValue = byXpath("/html/body/div/section/main/div/section[1]/div/div[3]/div[5]/h3");

    public NextDayWeatherBlock() {
        checkUI();
    }

    @Override
    public boolean checkUI() {
        $(firstTemperatureDay).isDisplayed();
        $(secondTemperatureDay).isDisplayed();
        $(thirdTemperatureDay).isDisplayed();
        $(fourthTemperaturDay).isDisplayed();
        $(fifthTemperatureDay).isDisplayed();
        return true;
    }
    
    public void checkDaysList() {
        String dayPattern = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|" +
            "Понедельник|Вторник|Среда|Четверг|Пятница|Суббота|Воскресенье";
    
        String day1 = $(firstTemperatureDay).getText();
        String day2 = $(secondTemperatureDay).getText();
        String day3 = $(thirdTemperatureDay).getText();
        String day4 = $(fourthTemperaturDay).getText();
        String day5 = $(fifthTemperatureDay).getText();
    
        assertFalse(day1.isEmpty(), "Первый день не отображается");
        assertFalse(day2.isEmpty(), "Второй день не отображается");
        assertFalse(day3.isEmpty(), "Третий день не отображается");
        assertFalse(day4.isEmpty(), "Четвертый день не отображается");
        assertFalse(day5.isEmpty(), "Пятый день не отображается");
    
        assertTrue(day1.matches(dayPattern), "Неверный формат первого дня: " + day1);
        assertTrue(day2.matches(dayPattern), "Неверный формат второго дня: " + day2);
        assertTrue(day3.matches(dayPattern), "Неверный формат третьего дня: " + day3);
        assertTrue(day4.matches(dayPattern), "Неверный формат четвертого дня: " + day4);
        assertTrue(day5.matches(dayPattern), "Неверный формат пятого дня: " + day5);
    }

    public void checkTimeList() {
        String timePattern = "^([0-1]?[0-9]|2[0-3]|24):[0-5][0-9]$";
    
        String time1 = $(firstTemperatureTime).getText();
        String time2 = $(secondTemperatureTime).getText();
        String time3 = $(thirdTemperatureTime).getText();
        String time4 = $(fourthTemperaturTime).getText();
        String time5 = $(fifthTemperatureTime).getText();
    
        assertFalse(time1.isEmpty(), "Первое время не отображается");
        assertFalse(time2.isEmpty(), "Второе время не отображается");
        assertFalse(time3.isEmpty(), "Третье время не отображается");
        assertFalse(time4.isEmpty(), "Четвертое время не отображается");
        assertFalse(time5.isEmpty(), "Пятое время не отображается");
    
        assertTrue(time1.matches(timePattern), "Неверный формат первого времени: " + time1);
        assertTrue(time2.matches(timePattern), "Неверный формат второго времени: " + time2);
        assertTrue(time3.matches(timePattern), "Неверный формат третьего времени: " + time3);
        assertTrue(time4.matches(timePattern), "Неверный формат четвертого времени: " + time4);
        assertTrue(time5.matches(timePattern), "Неверный формат пятого времени: " + time5);
    }

    public void checkTemperatureList() {
        String tempPattern = "-?\\d+(\\.\\d+)?\\s*°C";
    
        String temp1 = $(firstTemperatureValue).getText();
        String temp2 = $(secondTemperatureValue).getText();
        String temp3 = $(thirdTemperatureValue).getText();
        String temp4 = $(fourthTemperaturValue).getText();
        String temp5 = $(fifthTemperatureValue).getText();
    
        assertFalse(temp1.isEmpty(), "Первая температура не отображается");
        assertFalse(temp2.isEmpty(), "Вторая температура не отображается");
        assertFalse(temp3.isEmpty(), "Третья температура не отображается");
        assertFalse(temp4.isEmpty(), "Четвертая температура не отображается");
        assertFalse(temp5.isEmpty(), "Пятая температура не отображается");
    
        assertTrue(temp1.matches(tempPattern), "Неверный формат первой температуры: " + temp1);
        assertTrue(temp2.matches(tempPattern), "Неверный формат второй температуры: " + temp2);
        assertTrue(temp3.matches(tempPattern), "Неверный формат третьей температуры: " + temp3);
        assertTrue(temp4.matches(tempPattern), "Неверный формат четвертой температуры: " + temp4);
        assertTrue(temp5.matches(tempPattern), "Неверный формат пятой температуры: " + temp5);
    }
}
