package org.coursemind.controller;

import org.coursemind.Model.DPPResponse;
import org.coursemind.Model.DppRequested;
import org.coursemind.Model.Questions;
import org.coursemind.Model.Status;
import org.coursemind.service.DppService;
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
@RequestMapping("/dpp")
public class DppController {

    private final DppService service;
    private final ThreadPoolTaskScheduler taskScheduler;
    private ScheduledFuture<?> schedule;
    private String topic = "";

    public DppController(DppService service, ThreadPoolTaskScheduler taskScheduler) {
        this.service = service;
        this.taskScheduler = taskScheduler;
    }

    /**
     * 🔹 Generate a new DPP for a given topic.
     */
    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody Map<String, String> request) {
        String topic = request.get("topic"); // ✅ corrected key
        if (topic == null || topic.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Topic name is required"));
        }

        List<Questions> questions = service.dppGenerator(topic);
        DPPResponse response = new DPPResponse(topic, questions);
        return ResponseEntity.ok(response);
    }

    /**
     * 🔹 Schedule a daily DPP generation + email.
     */
    @PostMapping("/schedule")
    public ResponseEntity<Status> scheduleDpp(@RequestBody DppRequested requested) {
        if (requested == null || requested.getTopic() == null || requested.getTime() == null) {
            return ResponseEntity.badRequest().body(new Status("error", "Invalid schedule request"));
        }

        this.topic = requested.getTopic();
        Instant firstRun = getFirstRunTime(requested.getTime());

        // Cancel any existing schedule first
        if (schedule != null && !schedule.isCancelled()) {
            schedule.cancel(false);
        }

        schedule = taskScheduler.scheduleAtFixedRate(
                () -> {
                    List<Questions> questions = service.dppGenerator(topic);
                    service.sendMail(topic, questions);
                },
                firstRun,
                Duration.ofDays(1)
        );

        return new ResponseEntity<>(new Status("scheduled", "Daily DPP scheduled for topic: " + topic), HttpStatus.OK);
    }

    /**
     * 🔹 Stop scheduled DPP emails.
     */
    @DeleteMapping("/schedule")
    public ResponseEntity<Status> stopDpp() {
        if (schedule != null && !schedule.isCancelled()) {
            schedule.cancel(false);
            topic = "";
            return ResponseEntity.ok(new Status("success", "Scheduled DPP stopped successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Status("error", "No active DPP schedule found"));
    }

    /**
     * 🔹 Utility to get the next scheduled time for the DPP.
     */
    private Instant getFirstRunTime(LocalTime time) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextRun = now.withHour(time.getHour())
                .withMinute(time.getMinute())
                .withSecond(0)
                .withNano(0);

        if (nextRun.isBefore(now)) {
            nextRun = nextRun.plusDays(1);
        }
        return nextRun.atZone(ZoneId.systemDefault()).toInstant();
    }
}
