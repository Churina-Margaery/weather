package com.example.elements;

import com.example.pages.LoadablePage;

public class AdditionalInfoBlock implements LoadablePage {
    
    public AdditionalInfoBlock() {
        checkUI();
    }

    @Override
    public boolean checkUI() {
        return true;
    }
}
