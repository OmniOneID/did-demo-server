/*
 * Copyright 2024 OmniOne.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.omnione.did.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Demo controller for handling Verifiable Credentials (VCs) and Verifiable Presentations (VPs)
 * this Controller is used to navigate to the different pages of the demo
 */
@Controller
public class DemoController {
    @GetMapping("/home")
    public String home(){
        return "index";
    }

    @GetMapping("/vpPopup")
    public String vpPopup(){
        return "vpPopup";
    }

    @GetMapping("/success")
    public String success(){
        return "success";
    }

    @GetMapping("/vcPopup")
    public String vcPopup(){
        return "vcPopup";
    }

    @GetMapping("/vcSuccess")
    public String vcSuccess(){
        return "vcSuccess";
    }

    @GetMapping("/qrPush")
    public String qrPush(){
        return "qrPush";
    }

    @GetMapping("/sendEmail")
    public String sendEmail(){
        return "sendEmail";
    }

    @GetMapping("/addVcInfo")
    public String addVcInfo(){
        return "addVcInfo";
    }

    @GetMapping("/addUserInfo")
    public String addUserInfo(){
        return "addUserInfo";
    }

    @GetMapping("/emailForm")
    public String emailForm(){
        return "requestEmailVc";
    }


}
