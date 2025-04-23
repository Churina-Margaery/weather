package com.example.elements;

import org.openqa.selenium.By;
import static com.codeborne.selenide.Condition.enabled;
import static com.codeborne.selenide.Condition.exactText;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import com.example.pages.GitHubPage;
import com.example.pages.LoadablePage;

public class SearchString implements LoadablePage {

    private static final By nameString = byXpath("//div[@class = 'header__weather-label']");
    private static final By searchImage = byXpath("//img[@alt = 'loupe']");
    private static final By cityField = byXpath("//input[@name = 'search-city']");
    private static final By stateFieled = byXpath("//input[@name = 'search-state']");
    private static final By countryField = byXpath("//input[@name = 'search-country']");
    private static final By searchButton = byXpath("//button[@class = 'header__loupe']");
    private static final By themeButton = byXpath("//button[@class = 'header__btn']");
    private static final By supportProjectButton = byXpath("//button[@class = 'header__support-btn']");

    public SearchString() {
        checkUI();
    }
    @Override
    public boolean checkUI() {
        $(nameString).isDisplayed();
        $(searchImage).isDisplayed();
        $(cityField).isDisplayed();
        $(stateFieled).isDisplayed();
        $(countryField).isDisplayed();
        $(themeButton).isDisplayed();
        $(supportProjectButton).isDisplayed();
        $(supportProjectButton).shouldHave(exactText("Support Project"));
        return true;
    }

    public GitHubPage openSupport() {
        $(supportProjectButton).click();
        return new GitHubPage();
    }

    public void setText(String city) {
        $(cityField).shouldBe(enabled).click();
        $(cityField).type(city);
    }

    public void setFullText(String city, String state, String country) {
        $(cityField).shouldBe(enabled).click();
        $(cityField).type(city);       
        $(stateFieled).shouldBe(enabled).click();
        $(stateFieled).type(state);       
        $(countryField).shouldBe(enabled).click();
        $(countryField).type(country);
    }

    public String getCity() {
        return $(cityField).getValue();
    }

    public String getState() {
        return $(stateFieled).getValue();
    }

    public String getCountry() {
        return $(countryField).getValue();
    }

    public void changeTheme() {
        $(themeButton).shouldBe(enabled).click();
    }

    public void findCity(String city) {
        setText(city);
        $(searchButton).shouldBe(enabled).click();
    }
}
