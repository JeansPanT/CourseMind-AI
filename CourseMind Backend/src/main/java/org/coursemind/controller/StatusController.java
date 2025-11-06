package org.coursemind.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StatusController {
    @GetMapping("")
    public String status(){
        return "The application is running";
    }
}
