# 🧠 CourseMind AI: Transform Your Learning

Transform your learning with ****AI-powered study materials, practice papers, and tests.** Stay consistent with intelligent scheduling and never miss a session with automatic reminders.

CourseMind AI is an AI-powered educational platform built with **Spring Boot and React with Vite** that generates **Notes, Daily Practice Papers (DPPs), and Tests** using the **OlamaAI** Local Server. The system automatically schedules DPPs and tests and sends email reminders to students.

---

## 🚀 Features

- 🤖 **AI-Generated Notes** — Automatically create subject/topic-specific notes.
- 📄 **Daily Practice Papers (DPPs)** — Generated and scheduled daily.
- 📝 **Test Generation** — Automatic test creation for specific topics.
- 📅 **Automatic Scheduling** — DPPs and tests are scheduled without manual intervention.
- 📧 **Email Reminders** — Sends reminders for upcoming DPPs/tests.

---

## 🛠 Tech Stack

**💻 Frontend**
- Framework: React
- Build Tool: Vite

**⚙️ Backend:**
- Java 17+
- Spring Boot (Web, Data JPA, Scheduling, Mail)
- Hibernate / JPA
- PostgreSQL (Database)

**AI Integration:**
- Olama AI Local Server (Gemini 3:1B model)

**Others:**
- Spring Scheduler (for DPP/Test scheduling)
- JavaMailSender (for email reminders)
- Lombok (reduce boilerplate code)
- Spring Dotenv (for environment variables)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash

git clone https://github.com/TornovDutta/AI-Powered-Study-Resource-Generator.git
cd AI-Powered-Study-Resource-Generator

```

### 2️⃣ Configure Database
Update `application.properties`  with environment variables:

```properties
# Database
spring.datasource.driver-class-name=${DATASOURCE_DRIVER_CLASS_NAME}
spring.datasource.username=${DATASOURCE_USERNAME}
spring.datasource.password=${DATASOURCE_PASSWORD}
spring.datasource.url=${DATASOURCE_URL}
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update

```

### 3️⃣ Add OlamaAI Local Server URL
```properties
# AI
spring.ai.ollama.base-url=${URL}
spring.ai.ollama.chat.model=${OLLAMA_MODEL}
spring.ai.ollama.timeout=60s
```

### 4️⃣ Configure Email Settings
```properties
# Mail
spring.mail.host=${MAIL_HOST}
spring.mail.port=${MAIL_PORT}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
email.from=${EMAIL_FROM}

```

### 4️⃣ Configure OAuth
```properties
# OAuth
spring.security.oauth2.client.registration.github.client-id=${OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_SECRET}


```

### 5️⃣ Build & Run
```bash
mvn clean install
mvn spring-boot:run
```

---

## 📚 API Endpoints

| Endpoint            | Method | Description                                            | Request Body Example                                                                 | Response Example |
|---------------------|--------|--------------------------------------------------------|---------------------------------------------------------------------------------------|-----------------|
| `/notes`            | POST   | Generated study notes for a topic                      | Query param: `?topic=Physics`                                                         | `{ "topic": "Physics", "notes": "Physics is the study of matter..." }` |
| `/tests`            | POST   | Generate test questions for a topic                    | `{ "topic": "Mathematics" }`                                                          | `{ "questions": [...] }` |
| `/tests/schedule`   | POST   | Schedule a test at a given date & time, sent via email | `{ "topic": "Chemistry", "date": "2025-09-12", "time": "09:00" }`                     | `{ "status": "scheduled", "topic": "Chemistry" }` |
| `/tests/schedule`   | DELETE | Cancel a scheduled test                                | N/A                                                                                   | `{ "status": "success", "message": "Scheduled test stopped successfully" }` |
| `/dpp`              | POST   | Generate a Daily Practice Paper (DPP) for a topic      | `{ "topic": "Biology" }`                                                              | `{ "questions": [...] }` |
| `/dpp/schedule`     | POST   | Schedule DPP generation at a given time                | `{ "topic": "Mathematics", "time": "20:00" }`                                         | `{ "status": "scheduled", "topic": "Mathematics" }` |
| `/dpp/schedule`     | DELETE | Cancel a scheduled DPP                                 | N/A                                                                                   | `{ "status": "success", "message": "Scheduled DPP stopped successfully" }` |
| `/`                 | GET    | Health check endpoint                                  | N/A                                                                                   | `The application is running` |

---


---

## 📂 Project Structure
```
src/main/java/org/coursemind
│── config/ # Configuration classes 
│── controller/ # REST API endpoints
│── DAO/ # Data Access Objects / Repositories
│── Model/ # Entities 
│── service/ # Business logic & services
│── Coursemind.java # Main Spring Boot application
```

---



## 👨‍💻 Author
**Siddharth Kar**  
📧 siddhukar39@gmail.com 
🌐 [LinkedIn](https://www.linkedin.com/in/siddharth-kar-460b471a4/) | [GitHub](https://github.com/JeansPanT)
