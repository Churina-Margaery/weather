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
    private static final By searchString = byXpath("//input[@type = 'search']");
    private static final By searchButton = byXpath("//button[@class = 'header__loupe']");
    private static final By themeButton = byXpath("//button[@class = 'header__btn']");
    private static final By supportProjectButton = byXpath("//button[@class = 'header__support-btn']");

    @Override
    public boolean checkUI() {
        $(nameString).isDisplayed();
        $(searchImage).isDisplayed();
        $(searchString).isDisplayed();
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
        $(searchString).shouldBe(enabled).click();
        $(searchString).type(city);
    }

    public String getText() {
        return $(searchString).getValue();
    }

    public void changeTheme() {
        $(themeButton).shouldBe(enabled).click();
    }

    public void findCity(String city) {
        setText(city);
        $(searchButton).shouldBe(enabled).click();
    }
}
