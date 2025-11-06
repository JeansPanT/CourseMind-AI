package org.coursemind.Model;

public class Status {
    private String status;
    private String message;

    public Status(String status, String message) {
        this.status = status;
        this.message = message;
    }

    // Getters and setters (optional, but recommended)
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

