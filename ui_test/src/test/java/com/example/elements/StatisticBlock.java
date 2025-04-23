package com.example.elements;

import com.example.pages.LoadablePage;

public class StatisticBlock implements LoadablePage {

    public StatisticBlock() {
        checkUI();
    }

    @Override
    public boolean checkUI() {
        return true;
    } 
}
