package com.example.elements;

import org.openqa.selenium.By;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Condition.exactText;
import com.example.pages.LoadablePage;

public class AdditionalInfoBlock implements LoadablePage {
        private static final By windString = byXpath("//div[@data-testid = 'small-cards-container']/div[1]/div/h3");
        private static final By windValue = byXpath("//div[@data-testid = 'small-cards-container']/div[1]/div/h2");
        private static final By visibilityString = byXpath("//div[@data-testid = 'small-cards-container']/div[2]/div/h3");
        private static final By visibilityValue = byXpath("//div[@data-testid = 'small-cards-container']/div[2]/div/h2");
        private static final By pressureString = byXpath("//div[@data-testid = 'small-cards-container']/div[3]/div/h3");
        private static final By pressureValue = byXpath("//div[@data-testid = 'small-cards-container']/div[3]/div/h2");
        private static final By humidityString = byXpath("//div[@data-testid = 'small-cards-container']/div[4]/div/h3");
        private static final By humidityValue = byXpath("//div[@data-testid = 'small-cards-container']/div[4]/div/h2");
        private static final By sunriseString = byXpath("//div[@data-testid = 'small-cards-container']/div[5]/div/h3");
        private static final By sunriseValue = byXpath("//div[@data-testid = 'small-cards-container']/div[5]/div/h2");
        private static final By sunsetString = byXpath("//div[@data-testid = 'small-cards-container']/div[6]/div/h3");
        private static final By sunsetValue = byXpath("//div[@data-testid = 'small-cards-container']/div[6]/div/h2");

    public AdditionalInfoBlock() {
        checkUI();
    }

    @Override
    public boolean checkUI() {
        $(windString).isDisplayed();
        $(visibilityString).isDisplayed();
        $(pressureString).isDisplayed();
        $(humidityString).isDisplayed();
        $(sunriseString).isDisplayed();
        $(sunsetString).isDisplayed();
        return true;
    }

    public void checkWind(String wind) {
        $(windValue).scrollTo().isDisplayed();
        $(windValue).shouldHave(exactText(wind));
    }

    public void checkVisibility(String visibility) {
        $(visibilityValue).scrollTo().isDisplayed();
        $(visibilityValue).shouldHave(exactText(visibility));
    }

    public void checlPressure(String pressure) {
        $(pressureValue).scrollTo().isDisplayed();
        $(pressureValue).shouldHave(exactText(pressure));
    }

    public void checkHumidity(String humidity) {
        $(humidityValue).scrollTo().isDisplayed();
        $(humidityValue).shouldHave(exactText(humidity));
    }

    public void checkSunrise(String sunrise) {
        $(sunriseValue).scrollTo().isDisplayed();
        $(sunriseValue).shouldHave(exactText(sunrise));
    }

    public void checkSunset(String sunset) {
        $(sunsetValue).scrollTo().isDisplayed();
        $(sunsetValue).shouldHave(exactText(sunset));
    }
}
