package org.coursemind.service;

import org.coursemind.DAO.QuestionRepo;
import org.coursemind.DAO.TopicRepo;
import org.coursemind.Model.QuestionsWrapper;
import org.coursemind.Model.Topic;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
        
        // FIX: Check if topic already exists, if not create new one
        Topic topic = topicRepository.findByName(topicName)
                .orElseGet(() -> {
                    Topic newTopic = new Topic();
                    newTopic.setName(topicName);
                    return topicRepository.save(newTopic);
                });

        String[] questionsArray = response.split("Question:");
        for (String qBlock : questionsArray) {
            if (qBlock.trim().isEmpty()) continue;

            String[] lines = qBlock.trim().split("\n");
            QuestionsWrapper q = new QuestionsWrapper();

            // First line is the question
            if (lines.length > 0) {
                q.setQuestion(lines[0].trim());
            }

            // Parse options and answer
            for (String line : lines) {
                line = line.trim();
                if (line.startsWith("A)")) {
                    q.setOptionA(line.substring(2).trim());
                } else if (line.startsWith("B)")) {
                    q.setOptionB(line.substring(2).trim());
                } else if (line.startsWith("C)")) {
                    q.setOptionC(line.substring(2).trim());
                } else if (line.startsWith("D)")) {
                    q.setOptionD(line.substring(2).trim());
                } else if (line.startsWith("Answer:")) {
                    String answerText = line.substring(7).trim();
                    // Extract just the letter (A, B, C, or D)
                    if (answerText.length() > 0) {
                        q.setAnswer(answerText.substring(0, 1).toUpperCase());
                    }
                }
            }

            // Debug logging
            System.out.println("Question: " + q.getQuestion());
            System.out.println("Option A: " + q.getOptionA());
            System.out.println("Option B: " + q.getOptionB());
            System.out.println("Option C: " + q.getOptionC());
            System.out.println("Option D: " + q.getOptionD());
            System.out.println("Answer: " + q.getAnswer());

            // Only save if we have all required fields
            if (q.getQuestion() != null && q.getOptionA() != null && 
                q.getOptionB() != null && q.getOptionC() != null && 
                q.getOptionD() != null && q.getAnswer() != null) {
                q.setTopic(topic);
                questionsWrapperRepository.save(q);
                System.out.println("✓ Question saved successfully");
            } else {
                System.out.println("✗ Question skipped - missing fields");
            }
        }
        
        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }
}