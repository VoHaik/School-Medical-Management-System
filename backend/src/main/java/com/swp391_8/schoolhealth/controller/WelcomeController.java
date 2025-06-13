package com.swp391_8.schoolhealth.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WelcomeController {

    @GetMapping("/")
    public String index() {
        return "redirect:/index.html";
    }
}