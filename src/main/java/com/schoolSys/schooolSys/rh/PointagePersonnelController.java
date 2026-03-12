package com.schoolSys.schooolSys.rh;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.rh.dto.CreatePointageRequest;
import com.schoolSys.schooolSys.rh.dto.PointageDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rh/pointage")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('MANAGE_RH')")
public class PointagePersonnelController {

    private final PointagePersonnelService pointageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PointageDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(pointageService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PointageDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(pointageService.getById(id)));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<PointageDTO>>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.ok(pointageService.getByDate(date)));
    }

    @GetMapping("/employe/{employeId}")
    public ResponseEntity<ApiResponse<List<PointageDTO>>> getByEmploye(
            @PathVariable Long employeId,
            @RequestParam(defaultValue = "ENSEIGNANT") String employeType) {
        return ResponseEntity.ok(ApiResponse.ok(pointageService.getByEmploye(employeId, employeType)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PointageDTO>> create(
            @Valid @RequestBody CreatePointageRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(pointageService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PointageDTO>> update(
            @PathVariable Long id, @Valid @RequestBody CreatePointageRequest dto) {
        return ResponseEntity.ok(ApiResponse.ok(pointageService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pointageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
