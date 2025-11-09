package org.coursemind.service;

import org.coursemind.DAO.QuestionRepo;
import org.coursemind.DAO.TopicRepo;
import org.coursemind.Model.Questions;
import org.coursemind.Model.QuestionsWrapper;
import org.coursemind.Model.Topic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TestService {

    private final QuestionGenerater generator;
    private final QuestionRepo questionRepo;
    private final TopicRepo topicRepo;
    private final JavaMailSender mail;

    @Autowired
    public TestService(QuestionGenerater generator, QuestionRepo questionRepo, TopicRepo topicRepo, JavaMailSender mail) {
        this.generator = generator;
        this.questionRepo = questionRepo;
        this.topicRepo = topicRepo;
        this.mail = mail;
    }

    /**
     * 🔹 Generates a full test (MCQ set) for a given topic.
     * Ensures topic exists, normalizes answers, and returns structured data.
     */
    public List<Questions> testGenerator(String topicName) {
        // ✅ Generate questions if topic not found
        if (!topicRepo.existsByName(topicName)) {
            generator.generated(topicName);
        }

        Topic topicEntity = topicRepo.findByName(topicName)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicName));

        List<QuestionsWrapper> wrappers = questionRepo.findByTopic(topicEntity);
        List<Questions> questionsList = new ArrayList<>();

        for (QuestionsWrapper wrapper : wrappers) {
            Questions q = new Questions();
            q.setId(wrapper.getId());
            q.setQuestion(wrapper.getQuestion());
            q.setOptionA(wrapper.getOptionA());
            q.setOptionB(wrapper.getOptionB());
            q.setOptionC(wrapper.getOptionC());
            q.setOptionD(wrapper.getOptionD());

            // 👇 Add all options for frontend (if your model has it)
            List<String> options = List.of(
                    wrapper.getOptionA(),
                    wrapper.getOptionB(),
                    wrapper.getOptionC(),
                    wrapper.getOptionD()
            );
            q.setOptions(options);

            // ✅ Normalize stored answer
            String storedAnswer = wrapper.getAnswer();
            if (storedAnswer != null) {
                storedAnswer = storedAnswer.trim();
                if (storedAnswer.length() == 1) {
                    char c = Character.toUpperCase(storedAnswer.charAt(0));
                    int idx = switch (c) {
                        case 'A' -> 0;
                        case 'B' -> 1;
                        case 'C' -> 2;
                        case 'D' -> 3;
                        default -> -1;
                    };
                    if (idx >= 0 && idx < options.size()) {
                        q.setAnswer(options.get(idx)); // full option text
                    } else {
                        q.setAnswer(storedAnswer);
                    }
                } else {
                    q.setAnswer(storedAnswer); // already full answer
                }
            }

            questionsList.add(q);
        }

        // 🔀 Shuffle questions for randomness
        Collections.shuffle(questionsList);

        // 📉 Limit to 10 questions max
        int limit = Math.min(10, questionsList.size());
        return questionsList.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * 🔹 Sends a test summary email.
     */
    public void sendMail(String topic, List<Questions> questions) {
        StringBuilder content = new StringBuilder();
        content.append("📘 Test Paper - ").append(topic).append("\n\n");

        for (int i = 0; i < questions.size(); i++) {
            Questions q = questions.get(i);
            content.append(i + 1).append(". ").append(q.getQuestion()).append("\n")
                    .append("A) ").append(q.getOptionA()).append("\n")
                    .append("B) ").append(q.getOptionB()).append("\n")
                    .append("C) ").append(q.getOptionC()).append("\n")
                    .append("D) ").append(q.getOptionD()).append("\n")
                    .append("✅ Correct Answer: ").append(q.getAnswer()).append("\n\n");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("jeanspant101@gmail.com");
        message.setFrom("siddhukar39@gmail.com");
        message.setSubject("📘 Test Reminder - " + topic);
        message.setText(content.toString());

        mail.send(message);
    }
}
