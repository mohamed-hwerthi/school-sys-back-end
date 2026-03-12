package com.schoolSys.schooolSys.auth;

import com.schoolSys.schooolSys.auth.dto.UserResponseDTO;
import com.schoolSys.schooolSys.auth.dto.CreateUserRequestDTO;
import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserResponseDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toDto);
    }

    public UserResponseDTO getUserById(Long id) {
        return toDto(userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id)));
    }

    @Transactional
    public UserResponseDTO createUser(CreateUserRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = User.builder()
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .role(request.getRole())
            .tenantId(request.getTenantId())
            .build();
        return toDto(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, CreateUserRequestDTO request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());
        user.setTenantId(request.getTenantId());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        return toDto(userRepository.save(user));
    }

    @Transactional
    public void toggleActive(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("User", id);
        userRepository.deleteById(id);
    }

    private UserResponseDTO toDto(User u) {
        return UserResponseDTO.builder()
            .id(u.getId()).email(u.getEmail())
            .firstName(u.getFirstName()).lastName(u.getLastName())
            .role(u.getRole()).tenantId(u.getTenantId()).isActive(u.getIsActive())
            .build();
    }
}
