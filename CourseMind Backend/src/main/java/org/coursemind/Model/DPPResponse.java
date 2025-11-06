package org.coursemind.Model;

import java.util.List;

public class DPPResponse {
    private String topic;
    private List<Questions> questions;

    // constructor
    public DPPResponse(String topic, List<Questions> questions) {
        this.topic = topic;
        this.questions = questions;
    }

    // getters & setters
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public List<Questions> getQuestions() { return questions; }
    public void setQuestions(List<Questions> questions) { this.questions = questions; }
}
