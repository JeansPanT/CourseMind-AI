package org.coursemind.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class QuestionsWrapper {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String Question;
    private String OptionA;
    private String OptionB;
    private String OptionC;
    private String OptionD;
    private String Answer;


    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public String getQuestion() {
		return Question;
	}


	public void setQuestion(String question) {
		Question = question;
	}


	public String getOptionA() {
		return OptionA;
	}


	public void setOptionA(String optionA) {
		OptionA = optionA;
	}


	public String getOptionB() {
		return OptionB;
	}


	public void setOptionB(String optionB) {
		OptionB = optionB;
	}


	public String getOptionC() {
		return OptionC;
	}


	public void setOptionC(String optionC) {
		OptionC = optionC;
	}


	public String getOptionD() {
		return OptionD;
	}


	public void setOptionD(String optionD) {
		OptionD = optionD;
	}


	public String getAnswer() {
		return Answer;
	}


	public void setAnswer(String answer) {
		Answer = answer;
	}


	public Topic getTopic() {
		return topic;
	}


	public void setTopic(Topic topic) {
		this.topic = topic;
	}
    
    
}
