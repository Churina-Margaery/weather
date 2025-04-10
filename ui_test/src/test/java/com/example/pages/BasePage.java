package com.example.pages;

import com.example.elements.InfoBlock;
import com.example.elements.SearchString;
import com.example.elements.StatisticBlock;

public class BasePage implements LoadablePage {

    private final SearchString searchString = new SearchString();
    private final InfoBlock infoBlock = new InfoBlock();
    private final StatisticBlock statisticBlock = new StatisticBlock();

    @Override
    public boolean checkUI() {
        searchString.checkUI();
        infoBlock.checkUI();
        statisticBlock.checkUI();
        return true;
    }
}
