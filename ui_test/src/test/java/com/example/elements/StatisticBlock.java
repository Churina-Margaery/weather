package com.example.elements;

import org.openqa.selenium.By;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Condition.text;
import com.example.pages.LoadablePage;

public class StatisticBlock implements LoadablePage {

    private static final By threeDaysTitle = byXpath("//h3[@class = 'chart__content']/div[1]/div[1]/h3");
    private static final By tenDaysTitle = byXpath("//h3[@class = 'chart__content']/div[2]/div[1]/h3");
    private static final By selectThreeDays = byXpath("//select[@name = 'period3']");
    private static final By selectTenDays = byXpath("//select[@name = 'period10']");
    private static final By threeDaysGraph = byXpath("//div[@class = 'chart__content']/div[1]/div[2]");
    private static final By tenDaysGraph = byXpath("//div[@class = 'chart__content']/div[2]/div[2]");

    public StatisticBlock() {

        checkUI();
    }

    @Override
    public boolean checkUI() {

        $(threeDaysTitle).isDisplayed();
        $(tenDaysTitle).isDisplayed();
        $(threeDaysGraph).isDisplayed();
        $(tenDaysGraph).isDisplayed();
        return true;
    }
    
    public void openSelect(boolean isThreeDays) {

        By typeOfSelect = (isThreeDays) ? selectThreeDays : selectTenDays;

        $(typeOfSelect).click();
    }

    public void checkOptions(boolean isThreeDays) {

        By typeOfSelect = (isThreeDays) ? selectThreeDays : selectTenDays;
        $(typeOfSelect).$("option", 0).shouldHave(text("Wind speed"));
        $(typeOfSelect).$("option", 1).shouldHave(text("Pressure"));
        $(typeOfSelect).$("option", 2).shouldHave(text("Humidity"));
        $(typeOfSelect).$("option", 3).shouldHave(text("Visibility"));
        $(typeOfSelect).$("option", 4).shouldHave(text("Temperature"));
    }

    public void chooseOption(String option, boolean isThreeDays) {
        
        By typeOfSelect = (isThreeDays) ? selectThreeDays : selectTenDays;

        switch (option) {
            case "Wind speed":
                $(typeOfSelect).selectOption(0);
                break;
            case "Pressure":
                $(typeOfSelect).selectOption(1);
                break;
            case "Humidity":
                $(typeOfSelect).selectOption(2);
                break;
            case "Visibility":
                $(typeOfSelect).selectOption(3);
                break;
            case "Temperature":
                $(typeOfSelect).selectOption(4);
                break;
        }
    }

    public void checkCurrentOption(boolean isThreeDays, String option) {
        
        By typeOfSelect = (isThreeDays) ? selectThreeDays : selectTenDays;

        $(typeOfSelect).shouldHave(text(option));
    }
}
