FROM eclipse-temurin:17-jdk

# Install Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    curl \
    unzip \
    --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Maven
RUN apt-get update && apt-get install -y maven

# Copy only pom.xml first to cache dependencies
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy rest of the project files
COPY . .

# Compile tests during build (not just compile but also test-compile)
RUN mvn clean package -DskipTests

# Run tests using shell form to properly expand environment variables
CMD mvn test \
    -Dselenide.headless=true \
    -Dselenide.browser=chrome \
    -Dselenide.timeout=15000 \
    -Dselenide.baseUrl=${FRONTEND_URL} \
    -Dselenide.pageLoadStrategy=normal \
    -Dchromeoptions.args="--disable-dev-shm-usage,--no-sandbox,--disable-gpu,--window-size=1366,768" \
    -Dwebdriver.chrome.whitelistedIps="" \
    -Dallure.results.directory=target/allure-results