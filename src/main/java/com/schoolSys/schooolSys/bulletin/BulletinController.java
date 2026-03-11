package com.schoolSys.schooolSys.bulletin;

import com.schoolSys.schooolSys.bulletin.dto.BulletinDTO;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bulletins")
@RequiredArgsConstructor
public class BulletinController {

    private final BulletinService bulletinService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BulletinDTO>>> getBulletins(
            @RequestParam Long classeId,
            @RequestParam Integer trimestre,
            @RequestParam(defaultValue = "etatique") String version) {
        return ResponseEntity.ok(ApiResponse.ok(
                bulletinService.getBulletins(classeId, trimestre, version)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<BulletinDTO>> getBulletin(
            @RequestParam Long classeId,
            @PathVariable Long studentId,
            @RequestParam Integer trimestre,
            @RequestParam(defaultValue = "etatique") String version) {
        return ResponseEntity.ok(ApiResponse.ok(
                bulletinService.getBulletin(classeId, studentId, trimestre, version)));
    }
}
