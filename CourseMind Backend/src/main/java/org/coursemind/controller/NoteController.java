package org.coursemind.controller;

import org.coursemind.Model.Note;
import org.coursemind.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/notes")
public class NoteController {

    private final NoteService service;

    public NoteController(NoteService service) {
        this.service = service;
    }

    @PostMapping("")
    public ResponseEntity<List <Note>> createNote(@RequestParam String topic){
        return service.getNote(topic);
    }


}
