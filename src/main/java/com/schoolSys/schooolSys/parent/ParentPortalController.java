package com.schoolSys.schooolSys.parent;

import com.schoolSys.schooolSys.absence.dto.AbsenceResponseDTO;
import com.schoolSys.schooolSys.bulletin.dto.BulletinDTO;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.emploidutemps.dto.EmploiDuTempsResponseDTO;
import com.schoolSys.schooolSys.note.dto.NoteResponseDTO;
import com.schoolSys.schooolSys.parent.dto.ChildDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parent-portal")
@RequiredArgsConstructor
public class ParentPortalController {

    private final ParentPortalService parentPortalService;

    @GetMapping("/children")
    @PreAuthorize("hasAuthority('PARENT_ACCESS')")
    public ResponseEntity<ApiResponse<List<ChildDTO>>> getChildren(Authentication auth) {
        Long parentUserId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok(parentPortalService.getChildren(parentUserId)));
    }

    @GetMapping("/children/{studentId}/notes")
    @PreAuthorize("hasAuthority('PARENT_ACCESS')")
    public ResponseEntity<ApiResponse<List<NoteResponseDTO>>> getChildNotes(
            Authentication auth,
            @PathVariable Long studentId,
            @RequestParam(required = false, defaultValue = "1") Integer trimestre) {
        Long parentUserId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok(
                parentPortalService.getChildNotes(parentUserId, studentId, trimestre)));
    }

    @GetMapping("/children/{studentId}/absences")
    @PreAuthorize("hasAuthority('PARENT_ACCESS')")
    public ResponseEntity<ApiResponse<List<AbsenceResponseDTO>>> getChildAbsences(
            Authentication auth,
            @PathVariable Long studentId) {
        Long parentUserId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok(
                parentPortalService.getChildAbsences(parentUserId, studentId)));
    }

    @GetMapping("/children/{studentId}/bulletin")
    @PreAuthorize("hasAuthority('PARENT_ACCESS')")
    public ResponseEntity<ApiResponse<BulletinDTO>> getChildBulletin(
            Authentication auth,
            @PathVariable Long studentId,
            @RequestParam Long classeId,
            @RequestParam(required = false, defaultValue = "1") Integer trimestre) {
        Long parentUserId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok(
                parentPortalService.getChildBulletin(parentUserId, studentId, classeId, trimestre)));
    }

    @GetMapping("/children/{studentId}/emploi-du-temps")
    @PreAuthorize("hasAuthority('PARENT_ACCESS')")
    public ResponseEntity<ApiResponse<List<EmploiDuTempsResponseDTO>>> getChildEmploiDuTemps(
            Authentication auth,
            @PathVariable Long studentId) {
        Long parentUserId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok(
                parentPortalService.getChildEmploiDuTemps(parentUserId, studentId)));
    }

    private Long extractUserId(Authentication auth) {
        try {
            return Long.parseLong(auth.getName());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid user authentication");
        }
    }
}
