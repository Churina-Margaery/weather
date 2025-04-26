package com.example.elements;

import org.openqa.selenium.By;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Condition.exactText;
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
    
    public void checkDaysList(String firstElement, String secondElement, String thirdElement, String fourthElement, String fifthElement) {
        $(firstTemperatureDay).shouldHave(exactText(firstElement));
        $(secondTemperatureDay).shouldHave(exactText(secondElement));
        $(thirdTemperatureDay).shouldHave(exactText(thirdElement));
        $(fourthTemperaturDay).shouldHave(exactText(fourthElement));
        $(fifthTemperatureDay).shouldHave(exactText(fifthElement));
    }
    
    public void checkTimeList(String firstElement, String secondElement, String thirdElement, String fourthElement, String fifthElement) {
        $(firstTemperatureTime).shouldHave(exactText(firstElement));
        $(secondTemperatureTime).shouldHave(exactText(secondElement));
        $(thirdTemperatureTime).shouldHave(exactText(thirdElement));
        $(fourthTemperaturTime).shouldHave(exactText(fourthElement));
        $(fifthTemperatureTime).shouldHave(exactText(fifthElement));
    }

    public void checkTemperatureList(String firstElement, String secondElement, String thirdElement, String fourthElement, String fifthElement) {
        $(firstTemperatureValue).shouldHave(exactText(firstElement));
        $(secondTemperatureValue).shouldHave(exactText(secondElement));
        $(thirdTemperatureValue).shouldHave(exactText(thirdElement));
        $(fourthTemperaturValue).shouldHave(exactText(fourthElement));
        $(fifthTemperatureValue).shouldHave(exactText(fifthElement));
    }
}
