package com.cinerve.cinerve_backend.controller;

import com.cinerve.cinerve_backend.model.User;
import com.cinerve.cinerve_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // GET /api/user/profile?username=john
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
        User u = user.get();
        // Don't return password
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }

    // PUT /api/user/profile?username=john
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam String username,
            @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        if (body.containsKey("fullName")) user.setFullName(body.get("fullName"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("username")) user.setUsername(body.get("username"));
        if (body.containsKey("photoUrl")) user.setPhotoUrl(body.get("photoUrl"));
        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // PUT /api/user/password?username=john
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestParam String username,
            @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Current password is incorrect"));
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // POST /api/user/photo?username=john
    @PostMapping("/photo")
    public ResponseEntity<?> updatePhoto(
            @RequestParam String username,
            @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        user.setPhotoUrl(body.get("photoUrl"));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("photoUrl", user.getPhotoUrl()));
    }
}