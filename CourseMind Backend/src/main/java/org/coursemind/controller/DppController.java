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
    String topic="";



    private final DppService service;

    private ScheduledFuture<?> schedule;

    private final ThreadPoolTaskScheduler taskScheduler;

    public DppController(DppService service, ThreadPoolTaskScheduler taskScheduler) {
        this.service = service;
        this.taskScheduler = taskScheduler;
    }

    @PostMapping("")
    public ResponseEntity<DPPResponse> create(@RequestBody Map<String, String> request) {
        String topic = request.get("topics");
        List<Questions> questions = service.dppGenerator(topic);
        DPPResponse response = new DPPResponse(topic, questions);
        return ResponseEntity.ok(response);
    }

    @PostMapping("schedule")
    public ResponseEntity<Status> createDpp(@RequestBody DppRequested requested){
        topic = requested.getTopic();
        LocalDateTime dateTime = LocalDateTime.of(LocalDate.now(), requested.getTime());
        Instant firstrun=getFirstRunTime(requested.getTime());

        schedule=taskScheduler.scheduleAtFixedRate(
                ()->{
                    List<Questions> questions=service.dppGenerator(topic);
                    service.sendMail(topic,questions);
                },firstrun, Duration.ofDays(1)
        );
        Status status=new Status("scheduled daily", topic);


        return new ResponseEntity<>(status, HttpStatus.OK);
    }
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


    @DeleteMapping("schedule")
    public ResponseEntity<Status> stopDpp(){
        boolean stopped = schedule.cancel(false);
        topic = "";
        if(stopped) {
            Status status=new Status("success","Scheduled DPP stopped successfully");
            return new ResponseEntity<>(status, HttpStatus.OK);
        } else {
            return null;
        }
    }
}
