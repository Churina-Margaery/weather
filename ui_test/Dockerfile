FROM eclipse-temurin:17-jdk

# Аргумент для версии Chrome (можно передать при сборке)
# По умолчанию используем версию 119, которая совместима с Selenium 4.17.0
ARG CHROME_VERSION=119.0.6545.0-1

# Install specific Chrome version (фиксированная версия)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    curl \
    unzip \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable=${CHROME_VERSION} \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install matching ChromeDriver (фиксированной версии)
RUN CHROME_VERSION=$(google-chrome --version | grep -oP '\d+\.\d+\.\d+') \
    && CHROME_MAJOR_VERSION=$(echo $CHROME_VERSION | cut -d. -f1) \
    && echo "Chrome version: $CHROME_VERSION" \
    && echo "Chrome major version: $CHROME_MAJOR_VERSION" \
    # Скачиваем ChromeDriver конкретной версии
    && wget -O /tmp/chromedriver.zip "https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chromedriver-linux64.zip" \
    && unzip /tmp/chromedriver.zip -d /tmp/ \
    && mv /tmp/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver \
    && rm -rf /tmp/chromedriver* \
    && chmod +x /usr/local/bin/chromedriver

# Install Maven
RUN apt-get update && apt-get install -y maven

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package -DskipTests

# Verify installations
RUN echo "Chrome version:" && google-chrome --version
RUN echo "ChromeDriver version:" && chromedriver --version

# Запуск тестов с таймаутом 60 секунд
CMD mvn test \
    -Dselenide.headless=true \
    -Dselenide.browser=chrome \
    -Dselenide.timeout=60000 \
    -Dselenide.polling-interval=500 \
    -Dfrontend.url=${FRONTEND_URL} \
    -Dselenide.baseUrl=${FRONTEND_URL} \
    -Dallure.results.directory=target/allure-results