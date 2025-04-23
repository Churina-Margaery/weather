package com.example.elements;

import org.openqa.selenium.By;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Condition.exactText;
import com.example.pages.LoadablePage;
import com.example.utils.DateUtil;

public class MainInfoBlock implements LoadablePage {
    
    private static final By temperatureValue = byXpath("//h2[@class = 'overview__item-value']");
    private static final By typeOfWeatherValue = byXpath("//h3[@class = 'overview__item-name']");
    private static final By cityValue = byXpath("//div[@class = 'overview__info']/div[1]");
    private static final By dateValue = byXpath("//div[@class = 'overview__info']/div[2]");

    public MainInfoBlock() {
        checkUI();
    }
    
    @Override
    public boolean checkUI() {
        $(temperatureValue).isDisplayed();
        $(typeOfWeatherValue).isDisplayed();
        $(cityValue).isDisplayed();
        $(dateValue).isDisplayed();
        return true;
    }

    public void checkTemperature(String temperature) {
        $(temperatureValue).shouldHave(exactText(temperature));
    }

    public void checkWeather(String weather) {
        $(typeOfWeatherValue).shouldHave(exactText(weather));
    }

    public void checkCity(String city) {
        $(cityValue).shouldHave(exactText(city));
    }

    public void checkDate() {
        $(dateValue).shouldHave(exactText(DateUtil.getCurrentDate()));
    }
}
