package com.example;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

import org.bouncycastle.jcajce.provider.asymmetric.dsa.DSASigner.stdDSA;

public class Utils {
    
    static public void stubSpb() {
        stubFor(get(urlPathEqualTo("/"))
        .withQueryParam("city_name", equalTo("Saint-Petersburg"))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-type", "application/json")
            .withHeader("Access-Control-Allow-Origin", "*")
            .withBodyFile("mocks/city_SPB.json")));

        stubFor(get(urlPathEqualTo("/forecast/"))
        .withQueryParam("city_name", equalTo("Saint-Petersburg"))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-type", "application/json")
            .withHeader("Access-Control-Allow-Origin", "*")
            .withBodyFile("mocks/city_forecast_SPB.json")));

        stubFor(get(urlPathEqualTo("/3days/"))
        .withQueryParam("city_name", equalTo("Saint-Petersburg"))
        .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-type", "application/json")
                .withHeader("Access-Control-Allow-Origin", "*")
                .withBodyFile("mocks/three_days_SPB.json")));

        stubFor(get(urlPathEqualTo("/10days/"))
        .withQueryParam("city_name", equalTo("Saint-Petersburg"))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-type", "application/json")
            .withHeader("Access-Control-Allow-Origin", "*")
            .withBodyFile("mocks/ten_days_SPB.json")));
    }

    static public void stubCity(String city) {
        stubFor(get(urlPathEqualTo("/"))
        .withQueryParam("city_name", equalTo(city))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-type", "application/json")
            .withHeader("Access-Control-Allow-Origin", "*")
            .withBodyFile("mocks/city.json")));

        stubFor(get(urlPathEqualTo("/forecast/"))
        .withQueryParam("city_name", equalTo(city))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-type", "application/json")
            .withHeader("Access-Control-Allow-Origin", "*")
            .withBodyFile("mocks/city_forecast.json")));

        stubFor(get(urlPathEqualTo("/3days/"))
        .withQueryParam("city_name", equalTo(city))
        .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-type", "application/json")
                .withHeader("Access-Control-Allow-Origin", "*")
                .withBodyFile("mocks/three_days_city.json")));

        stubFor(get(urlPathEqualTo("/10days/"))
        .withQueryParam("city_name", equalTo(city))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-type", "application/json")
            .withHeader("Access-Control-Allow-Origin", "*")
            .withBodyFile("mocks/ten_days_city.json")));
    }
}
