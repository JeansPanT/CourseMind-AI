package org.coursemind.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions_wrapper")
public class QuestionsWrapper {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "questions_wrapper_seq")
    @SequenceGenerator(name = "questions_wrapper_seq", sequenceName = "questions_wrapper_seq", allocationSize = 1)
    private int id;
    
    @Column(name = "question")
    @JsonProperty("question")
    private String question;
    
    @Column(name = "optiona")
    @JsonProperty("optionA")
    private String optionA;
    
    @Column(name = "optionb")
    @JsonProperty("optionB")
    private String optionB;
    
    @Column(name = "optionc")
    @JsonProperty("optionC")
    private String optionC;
    
    @Column(name = "optiond")
    @JsonProperty("optionD")
    private String optionD;
    
    @Column(name = "answer")
    @JsonProperty("answer")
    private String answer;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }
}