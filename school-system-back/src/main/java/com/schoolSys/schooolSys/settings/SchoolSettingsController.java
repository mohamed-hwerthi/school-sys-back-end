package com.schoolSys.schooolSys.settings;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.settings.dto.SchoolSettingsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SchoolSettingsController {

    private final SchoolSettingsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<SchoolSettingsDTO>> get() {
        return ResponseEntity.ok(ApiResponse.ok(service.getSettings()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<SchoolSettingsDTO>> update(
            @RequestBody SchoolSettingsDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.updateSettings(dto)));
    }
}
