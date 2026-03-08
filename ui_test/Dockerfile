FROM eclipse-temurin:17-jdk

# Install Chrome (latest stable)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    curl \
    unzip \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install matching ChromeDriver (автоматическое определение версии)
RUN CHROME_VERSION=$(google-chrome --version | grep -oP '\d+\.\d+\.\d+\.\d+') \
    && CHROME_MAJOR_VERSION=$(echo $CHROME_VERSION | cut -d. -f1) \
    && echo "Chrome version: $CHROME_VERSION" \
    && echo "Chrome major version: $CHROME_MAJOR_VERSION" \
    && wget -O /tmp/chromedriver.zip "https://storage.googleapis.com/chrome-for-testing-public/$CHROME_VERSION/linux64/chromedriver-linux64.zip" \
    && unzip /tmp/chromedriver.zip -d /tmp/ \
    && mv /tmp/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver \
    && rm -rf /tmp/chromedriver* \
    && chmod +x /usr/local/bin/chromedriver \
    && chromedriver --version

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

CMD mvn test \
    -Dselenide.headless=true \
    -Dselenide.browser=chrome \
    -Dselenide.timeout=30000 \
    -Dfrontend.url=${FRONTEND_URL} \
    -Dselenide.baseUrl=${FRONTEND_URL} \
    -Dallure.results.directory=target/allure-results