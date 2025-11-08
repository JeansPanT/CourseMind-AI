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
public class DppService {

    private final QuestionGenerater generator;
    private final QuestionRepo questionRepo;
    private final TopicRepo topicRepo;
    private final JavaMailSender mail;

    @Autowired
    public DppService(QuestionGenerater generator, QuestionRepo questionRepo, TopicRepo topicRepo, JavaMailSender mail) {
        this.generator = generator;
        this.questionRepo = questionRepo;
        this.topicRepo = topicRepo;
        this.mail = mail;
    }

    /**
     * 🔹 Generates a fresh Daily Practice Paper (DPP) for a given topic.
     * Each DPP contains shuffled MCQs to ensure variety per request.
     */
    public List<Questions> dppGenerator(String topicName) {
        if (!topicRepo.existsByName(topicName)) {
            generator.generated(topicName);
        }

        Topic topicEntity = topicRepo.findByName(topicName)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicName));

        List<QuestionsWrapper> questionsWrapperList = questionRepo.findByTopic(topicEntity);
        List<Questions> questionsList = new ArrayList<>();

        for (QuestionsWrapper wrapper : questionsWrapperList) {
            Questions q = new Questions();
            q.setId(wrapper.getId());
            q.setQuestion(wrapper.getQuestion());
            q.setOptionA(wrapper.getOptionA());
            q.setOptionB(wrapper.getOptionB());
            q.setOptionC(wrapper.getOptionC());
            q.setOptionD(wrapper.getOptionD());

            // 👇 Add all options as a list for frontend rendering
            List<String> options = List.of(
                    wrapper.getOptionA(),
                    wrapper.getOptionB(),
                    wrapper.getOptionC(),
                    wrapper.getOptionD()
            );
            q.setOptions(options);

            // ✅ Normalize the stored answer
            // If DB stores letters (A/B/C/D), map to actual option text
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
                        q.setAnswer(options.get(idx)); // store full option text
                    } else {
                        q.setAnswer(storedAnswer);
                    }
                } else {
                    // assume full answer text is already stored
                    q.setAnswer(storedAnswer);
                }
            }

            questionsList.add(q);
        }

        // 🔀 Shuffle to make every DPP unique
        Collections.shuffle(questionsList);

        // 📉 Limit to 5 questions (optional)
        int limit = Math.min(5, questionsList.size());
        return questionsList.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * 🔹 Sends the generated DPP via email as a simple text summary.
     */
    public void sendMail(String topic, List<Questions> questions) {
        StringBuilder content = new StringBuilder();
        content.append("🧠 Daily Practice Paper - ").append(topic).append("\n\n");

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
        message.setSubject("📘 DPP Reminder - " + topic);
        message.setText(content.toString());

        mail.send(message);
    }
}
