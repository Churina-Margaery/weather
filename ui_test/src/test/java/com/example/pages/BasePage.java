package com.example.pages;

import com.example.elements.AdditionalInfoBlock;
import com.example.elements.MainInfoBlock;
import com.example.elements.NextDayWeatherBlock;
import com.example.elements.SearchString;
import com.example.elements.StatisticBlock;

public class BasePage implements LoadablePage {

    private final SearchString searchString = new SearchString();
    private final MainInfoBlock mainInfoBlock = new MainInfoBlock();
    private final StatisticBlock statisticBlock = new StatisticBlock();
    private final AdditionalInfoBlock additionalInfoBlock = new AdditionalInfoBlock();
    private final NextDayWeatherBlock nextDayWeatherBlock = new NextDayWeatherBlock();

    public BasePage() {
        checkUI();
    }
 
    @Override
    public boolean checkUI() {
        searchString.checkUI();
        mainInfoBlock.checkUI();
        additionalInfoBlock.checkUI();
        nextDayWeatherBlock.checkUI();
        statisticBlock.checkUI();
        return true;
    }
}
