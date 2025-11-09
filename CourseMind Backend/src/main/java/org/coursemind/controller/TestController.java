package org.coursemind.controller;

import org.coursemind.Model.Questions;
import org.coursemind.Model.Status;
import org.coursemind.Model.TestRequested;
import org.coursemind.Model.TestResponse;
import org.coursemind.service.TestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tests")
public class TestController {

    private final TestService service;
    private final ThreadPoolTaskScheduler taskScheduler;
    private ScheduledFuture<?> schedule;
    private String topic = "";

    public TestController(TestService service, ThreadPoolTaskScheduler taskScheduler) {
        this.service = service;
        this.taskScheduler = taskScheduler;
    }

    /**
     * 🔹 Generate a new Test for a given topic.
     */
    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody Map<String, String> request) {
        String topic = request.get("topic");
        if (topic == null || topic.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Topic name is required"));
        }

        List<Questions> questions = service.testGenerator(topic);
        TestResponse response = new TestResponse(topic, questions);
        return ResponseEntity.ok(response);
    }

    /**
     * 🔹 Schedule a Test at a specific date & time.
     */
    @PostMapping("/schedule")
    public ResponseEntity<Status> scheduleTest(@RequestBody TestRequested requested) {
        if (requested == null || requested.getTopic() == null ||
            requested.getDate() == null || requested.getTime() == null) {
            return ResponseEntity.badRequest().body(new Status("error", "Invalid schedule request"));
        }

        this.topic = requested.getTopic();

        // Combine date + time
        LocalDateTime scheduledDateTime = LocalDateTime.of(requested.getDate(), requested.getTime());
        Instant firstRun = scheduledDateTime.atZone(ZoneId.systemDefault()).toInstant();

        // Cancel any existing schedule before setting new one
        if (schedule != null && !schedule.isCancelled()) {
            schedule.cancel(false);
        }

        schedule = taskScheduler.schedule(
                () -> {
                    List<Questions> questions = service.testGenerator(topic);
                    service.sendMail(topic, questions);
                },
                firstRun
        );

        return new ResponseEntity<>(new Status("scheduled", "Test scheduled for topic: " + topic + " at " + scheduledDateTime), HttpStatus.OK);
    }

    /**
     * 🔹 Stop scheduled test emails.
     */
    @DeleteMapping("/schedule")
    public ResponseEntity<Status> stopTest() {
        if (schedule != null && !schedule.isCancelled()) {
            schedule.cancel(false);
            topic = "";
            return ResponseEntity.ok(new Status("success", "Scheduled test stopped successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new Status("error", "No active test schedule found"));
    }
}
