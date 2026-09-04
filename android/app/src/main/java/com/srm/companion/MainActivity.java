package com.srm.companion;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WAScraperPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
