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
        // ✅ Auto-generate topic if not found
        if (!topicRepo.existsByName(topicName)) {
            generator.generated(topicName);
        }

        // ✅ Fetch the topic entity safely
        Topic topicEntity = topicRepo.findByName(topicName)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicName));

        // ✅ Fetch all questions for the topic
        List<QuestionsWrapper> wrappers = questionRepo.findByTopic(topicEntity);
        if (wrappers.isEmpty()) {
            throw new RuntimeException("No questions found for topic: " + topicName);
        }

        // ✅ Convert wrappers into display-friendly questions
        List<Questions> questionsList = wrappers.stream().map(wrapper -> {
            Questions q = new Questions();
            q.setId(wrapper.getId());
            q.setQuestion(wrapper.getQuestion());
            q.setOptionA(wrapper.getOptionA());
            q.setOptionB(wrapper.getOptionB());
            q.setOptionC(wrapper.getOptionC());
            q.setOptionD(wrapper.getOptionD());
            q.setAnswer(wrapper.getAnswer());
            return q;
        }).collect(Collectors.toList());

        // ✅ Shuffle and limit (e.g., 5 questions per DPP)
        Collections.shuffle(questionsList);
        return questionsList.stream().limit(Math.min(5, questionsList.size())).collect(Collectors.toList());
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
                   .append("D) ").append(q.getOptionD()).append("\n\n");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("jeanspant101@gmail.com");
        message.setFrom("siddhukar39@gmail.com");
        message.setSubject("📘 DPP Reminder - " + topic);
        message.setText(content.toString());

        mail.send(message);
    }
}
