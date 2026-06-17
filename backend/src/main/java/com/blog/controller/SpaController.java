package com.blog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
        "/",
        "/post/{path:[^\\.]*}",
        "/admin",
        "/login",
        "/register",
        "/archive"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
