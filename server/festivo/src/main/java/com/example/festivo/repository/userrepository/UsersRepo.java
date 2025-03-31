package com.example.festivo.repository.userrepository;

import com.example.festivo.entity.userentity.OurUsers;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsersRepo extends MongoRepository<OurUsers, String> {
    Optional<OurUsers> findByEmail(String email);
}
