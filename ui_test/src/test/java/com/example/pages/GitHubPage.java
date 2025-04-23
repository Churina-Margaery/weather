package com.example.pages;

import org.openqa.selenium.By;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Condition.exactText;
import com.codeborne.selenide.WebDriverRunner;

public class GitHubPage implements LoadablePage {
    
    private static final By headerLine = byXpath("//header[@role='banner']");
    private static final By projectName = byXpath("//a[@data-turbo-frame='repo-content-turbo-frame']");
    private static final By authorName = byXpath("//a[@rel='author']");

    @Override
    public boolean checkUI() {
        $(headerLine).isDisplayed();
        $(projectName).shouldHave(exactText("weather"));
        $(authorName).shouldHave(exactText("Churina-Margaery"));
        return true;
    }

    public String checkUrl() {
        return WebDriverRunner.url().toString();
    }
}
