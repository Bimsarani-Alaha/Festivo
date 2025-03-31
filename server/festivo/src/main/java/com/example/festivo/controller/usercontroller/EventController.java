package com.example.festivo.controller.usercontroller;


import com.example.festivo.entity.userentity.Event;
import com.example.festivo.repository.userrepository.EventRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class EventController {

    @Autowired
    private EventRepo eventRepo;

    @PostMapping("/public/addEvent")
    Event addEvent(@RequestBody Event addEvent){
        return eventRepo.save(addEvent);
    }

    @GetMapping("/public/getAllEvent")
    List<Event>getAllEvent(){
        return eventRepo.findAll();
    }

    @GetMapping("/public/eventById/{id}")
    Event getEventById(@PathVariable String id){
        return eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
    }

    @PutMapping("/public/updateEvent/{id}")
    Event updateEvent(@RequestBody Event updateEvent,@PathVariable String id){
        return eventRepo.findById(id)
                .map(event -> {
                    event.setEventName(updateEvent.getEventName());
                    event.setEventTheme(updateEvent.getEventTheme());
                    event.setEventDate(updateEvent.getEventDate());
                    event.setEventType(updateEvent.getEventType());
                    event.setNoOfGuest(updateEvent.getNoOfGuest());
                    event.setSpecialRequest(updateEvent.getSpecialRequest());
                    event.setEventPackage(updateEvent.getEventPackage());
                    return eventRepo.save(event);
                }).orElseThrow(()->new RuntimeException("Event not found with ID: " + id));
    }

    @DeleteMapping("/public/deleteEvent/{id}")
    String deleteEvent(@PathVariable String id){
        if (!eventRepo.existsById(id)){
            throw new RuntimeException("Event not found with ID: "+id);
        }

        eventRepo.deleteById(id);

        return "Event id:"+id+" has been deleted Success";
    }
}

