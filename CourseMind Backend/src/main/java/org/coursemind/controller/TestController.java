package org.coursemind.controller;


import org.coursemind.Model.Questions;
import org.coursemind.Model.Status;
import org.coursemind.Model.TestRequested;
import org.coursemind.config.DynamicSchedule;
import org.coursemind.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tests")
public class TestController {
    String topic;

    private final TestService service;
    private final DynamicSchedule dynamicScheduler;

    public TestController(TestService service, DynamicSchedule dynamicScheduler) {
        this.service = service;
        this.dynamicScheduler = dynamicScheduler;
    }

    @PostMapping("")
    public ResponseEntity<List<Questions>> create(@RequestBody TestRequested request){
        return new ResponseEntity<>(service.testGenerator(request.getTopic()), HttpStatus.OK);
    }

    @PostMapping("/schedule")
    public ResponseEntity<Status> createTest(@RequestBody TestRequested testRequested){
        topic = testRequested.getTopic();
        LocalDateTime dateTime = LocalDateTime.of(testRequested.getDate(), testRequested.getTime());

        dynamicScheduler.schedule(() -> {

            List<Questions> questions=service.testGenerator(topic);
            service.sendMail(topic,questions);
        }, dateTime);
        Status status=new Status("scheduled", testRequested.getTopic());

        return new ResponseEntity<>(status, HttpStatus.OK);
    }


    @DeleteMapping("/schedule")
    public ResponseEntity<Status> stopTest(){
        boolean stopped = dynamicScheduler.stop();
        topic = "";
        if(stopped) {
            Status status=new Status("success","Scheduled test stopped successfully");
            return new ResponseEntity<>(status, HttpStatus.OK);
        } else {
            return null;
        }
    }
}
