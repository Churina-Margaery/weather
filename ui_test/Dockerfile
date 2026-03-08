FROM selenium/standalone-chrome:119.0-chromedriver-119.0

USER root

# Install Maven
RUN apt-get update && apt-get install -y maven \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Создаем симлинк для ChromeDriver в ожидаемое место
RUN ln -sf /usr/bin/chromedriver /usr/local/bin/chromedriver

USER seluser
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package -DskipTests

# Verify installations
RUN echo "Chrome version:" && google-chrome --version
RUN echo "ChromeDriver version:" && chromedriver --version
RUN echo "ChromeDriver location:" && which chromedriver

# Запуск тестов с таймаутом 60 секунд
CMD mvn test \
    -Dselenide.headless=true \
    -Dselenide.browser=chrome \
    -Dselenide.timeout=60000 \
    -Dselenide.polling-interval=500 \
    -Dfrontend.url=${FRONTEND_URL} \
    -Dselenide.baseUrl=${FRONTEND_URL} \
    -Dallure.results.directory=target/allure-results