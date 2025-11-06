package org.coursemind.DAO;

import org.coursemind.Model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepo extends JpaRepository<Note,Integer> {
    boolean existsByTopic(String topic);

    List<Note> findByTopic(String topic);
}
