package org.coursemind.service;

import org.coursemind.DAO.QuestionRepo;
import org.coursemind.DAO.TopicRepo;
import org.coursemind.Model.QuestionsWrapper;
import org.coursemind.Model.Topic;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.regex.*;

@Service
public class QuestionGenerater {
    private final AiService service;
    private final TopicRepo topicRepository;
    private final QuestionRepo questionsWrapperRepository;

    public QuestionGenerater(AiService service, TopicRepo topicRepository, QuestionRepo questionsWrapperRepository) {
        this.service = service;
        this.topicRepository = topicRepository;
        this.questionsWrapperRepository = questionsWrapperRepository;
    }

    static final int number = 10;

    public ResponseEntity<String> generated(String topicName) {
        String prompt = "Generate " + number + " multiple choice questions (MCQs) on the topic: "
                + topicName + ".\n"
                + "Strictly use the following format for each question:\n\n"
                + "Question: <question text>\n"
                + "A) <option A>\n"
                + "B) <option B>\n"
                + "C) <option C>\n"
                + "D) <option D>\n"
                + "Answer: <correct option letter>\n\n"
                + "Do not include explanations, only follow this exact format for each question.";

        String response = service.getResponse(prompt);

        // Ensure topic exists or create new
        Topic topic = topicRepository.findByName(topicName)
                .orElseGet(() -> {
                    Topic newTopic = new Topic();
                    newTopic.setName(topicName);
                    return topicRepository.save(newTopic);
                });

        System.out.println("🧠 Raw AI output:\n" + response);

        // Split questions by "Question:"
        String[] questionsArray = response.split("(?=Question[:\\s])");
        for (String qBlock : questionsArray) {
            qBlock = qBlock.trim();
            if (qBlock.isEmpty()) continue;

            QuestionsWrapper q = new QuestionsWrapper();

            // Extract question line
            Matcher questionMatcher = Pattern.compile("Question[:\\s]+(.*?)(?:\\n|$)").matcher(qBlock);
            if (questionMatcher.find()) {
                q.setQuestion(questionMatcher.group(1).trim());
            }

            // Extract all options (A–D)
            Matcher optionMatcher = Pattern.compile("([A-D])[\\)\\.\\s]+(.*)").matcher(qBlock);
            while (optionMatcher.find()) {
                String letter = optionMatcher.group(1);
                String value = optionMatcher.group(2).trim();
                switch (letter) {
                    case "A" -> q.setOptionA(value);
                    case "B" -> q.setOptionB(value);
                    case "C" -> q.setOptionC(value);
                    case "D" -> q.setOptionD(value);
                }
            }

            // Extract the correct answer
            Matcher answerMatcher = Pattern.compile("Answer[:\\s-]+([A-Da-d])").matcher(qBlock);
            if (answerMatcher.find()) {
                q.setAnswer(answerMatcher.group(1).toUpperCase());
            }

            // Debug logging
            System.out.println("──────────────────────────────");
            System.out.println("Question: " + q.getQuestion());
            System.out.println("Option A: " + q.getOptionA());
            System.out.println("Option B: " + q.getOptionB());
            System.out.println("Option C: " + q.getOptionC());
            System.out.println("Option D: " + q.getOptionD());
            System.out.println("Answer: " + q.getAnswer());

            // Save only valid questions
            if (q.getQuestion() != null && q.getOptionA() != null &&
                q.getOptionB() != null && q.getOptionC() != null &&
                q.getOptionD() != null && q.getAnswer() != null) {
                q.setTopic(topic);
                questionsWrapperRepository.save(q);
                System.out.println("✅ Question saved successfully");
            } else {
                System.out.println("⚠️ Skipped malformed question block:\n" + qBlock);
            }
        }

        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }
}
