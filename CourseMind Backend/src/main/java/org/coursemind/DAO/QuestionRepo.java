package org.coursemind.DAO;

import org.coursemind.Model.QuestionsWrapper;
import org.coursemind.Model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepo extends JpaRepository<QuestionsWrapper,Integer> {

    List<QuestionsWrapper> findByTopic(Topic topic);
}
