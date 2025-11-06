package org.coursemind.service;

import org.coursemind.DAO.NoteRepo;
import org.coursemind.Model.Note;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {
	private final AiService aiService;
    private final NoteRepo repo;

    public NoteService(AiService aiService, NoteRepo repo) {
        this.aiService = aiService;
        this.repo = repo;
    }

    public ResponseEntity<List<Note>> getNote(String topic) {
        boolean exists = repo.existsByTopic(topic);
        if (!exists) {
            String prompt = "Write a detailed study note on the topic: " + topic;
            String note = aiService.getResponse(prompt);
            Note newNote = new Note();
            newNote.setTopic(topic);
            newNote.setNote(note);
            repo.save(newNote);
        }
        List<Note> result = repo.findByTopic(topic);
        return new ResponseEntity<>(result, exists ? HttpStatus.OK : HttpStatus.CREATED);
    }

}
