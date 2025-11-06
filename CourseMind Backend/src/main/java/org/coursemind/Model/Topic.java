package org.coursemind.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    @OneToMany(mappedBy = "topic" ,cascade = CascadeType.ALL,orphanRemoval = true)
    private List<QuestionsWrapper> questions;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<QuestionsWrapper> getQuestions() {
		return questions;
	}
	public void setQuestions(List<QuestionsWrapper> questions) {
		this.questions = questions;
	}
    
    
}
