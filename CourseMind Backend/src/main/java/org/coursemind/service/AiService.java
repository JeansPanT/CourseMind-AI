package org.coursemind.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String getResponse(String prompt) {
        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content()
                    .trim();
        } catch (Exception e) {
            return "Error generating response: " + e.getMessage();
        }
    }
}
