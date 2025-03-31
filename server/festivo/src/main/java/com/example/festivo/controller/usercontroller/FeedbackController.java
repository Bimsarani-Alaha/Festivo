package com.example.festivo.controller.usercontroller;


import com.example.festivo.entity.userentity.Feedback;
import com.example.festivo.repository.userrepository.FeedbackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FeedbackController {

    @Autowired
    private FeedbackRepo feedbackRepo;

    @PostMapping("/public/addFeedback")
    Feedback addFeedback(@RequestBody Feedback addFeedback){
        return feedbackRepo.save(addFeedback);
    }

    @GetMapping("/public/getAllFeedback")
    List<Feedback> getAllFeedback(){
        return feedbackRepo.findAll();
    }

    @GetMapping("/public/feedById/{id}")
    Feedback getFeedbackById(@PathVariable String id){
        return feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with ID: " + id));
    }

    @PutMapping("/public/updateFeedback/{id}")
    Feedback updateFeedback(@RequestBody Feedback updateFeedback,@PathVariable String id){
        return feedbackRepo.findById(id)
                .map(feedback -> {
                    feedback.setRate(updateFeedback.getRate());
                    feedback.setReview(updateFeedback.getReview());
                    return feedbackRepo.save(feedback);
                }).orElseThrow(()->new RuntimeException("Feedback not found with ID: " + id));
    }

    @DeleteMapping("/public/deleteFeedback/{id}")
    String deleteFeedback(@PathVariable String id){
        if (!feedbackRepo.existsById(id)){
            throw new RuntimeException("Feedback not found with ID: "+id);
        }

        feedbackRepo.deleteById(id);

        return "Feedback id:"+id+" has been deleted Success";
    }

}

