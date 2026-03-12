package com.schoolSys.schooolSys.note;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.note.dto.BulkNoteRequestDTO;
import com.schoolSys.schooolSys.note.dto.MoyenneDTO;
import com.schoolSys.schooolSys.note.dto.NoteResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<NoteResponseDTO>>> getByExamen(
            @RequestParam Long examenId,
            @RequestParam Integer trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.findByExamen(examenId, trimestre)));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<NoteResponseDTO>>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam Integer trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.findByStudent(studentId, trimestre)));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<List<NoteResponseDTO>>> upsertBulk(
            @Valid @RequestBody BulkNoteRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.upsertBulk(dto.getNotes())));
    }

    @GetMapping("/moyennes")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<MoyenneDTO>>> getMoyennes(
            @RequestParam Long classeId,
            @RequestParam Integer trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.getMoyennes(classeId, trimestre)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
