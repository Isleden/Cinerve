package com.cinerve.cinerve_backend.controller;

import com.cinerve.cinerve_backend.model.User;
import com.cinerve.cinerve_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_ANON_KEY}")
    private String supabaseAnonKey;

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
    public ResponseEntity<?> uploadPhoto(
            @RequestParam String username,
            @RequestParam("file") MultipartFile file) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        try {
            String fileName = username + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseAnonKey);
            headers.set("Content-Type", file.getContentType());
            headers.set("x-upsert", "true");

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            String uploadUrl = supabaseUrl + "/storage/v1/object/avatars/" + fileName;
            restTemplate.exchange(uploadUrl, HttpMethod.POST, requestEntity, String.class);

            String photoUrl = supabaseUrl + "/storage/v1/object/public/avatars/" + fileName;

            User user = userOpt.get();
            user.setPhotoUrl(photoUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload photo: " + e.getMessage()));
        }
    }
}