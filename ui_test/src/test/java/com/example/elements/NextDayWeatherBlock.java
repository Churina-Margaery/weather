package com.example.elements;

import com.example.pages.LoadablePage;

public class NextDayWeatherBlock implements LoadablePage {
    
    public NextDayWeatherBlock() {
        checkUI();
    }
    
    @Override
    public boolean checkUI() {
        return true;
    }
}
