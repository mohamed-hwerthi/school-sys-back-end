package com.schoolSys.schooolSys.note;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.note.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
            @RequestParam Long examenId, @RequestParam Integer trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.findByExamen(examenId, trimestre)));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<NoteResponseDTO>>> getByStudent(
            @PathVariable Long studentId, @RequestParam Integer trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.findByStudent(studentId, trimestre)));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<List<NoteResponseDTO>>> upsertBulk(@Valid @RequestBody BulkNoteRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.upsertBulk(dto.getNotes())));
    }

    @GetMapping("/moyennes")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<MoyenneDTO>>> getMoyennes(
            @RequestParam Long classeId, @RequestParam Integer trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.getMoyennes(classeId, trimestre)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- Barèmes ---
    @GetMapping("/baremes")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<BaremeDTO>>> getAllBaremes() {
        return ResponseEntity.ok(ApiResponse.ok(noteService.getAllBaremes()));
    }

    @PostMapping("/baremes")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<BaremeDTO>> createBareme(@Valid @RequestBody BaremeDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(noteService.createBareme(dto)));
    }

    @PutMapping("/baremes/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<BaremeDTO>> updateBareme(@PathVariable Long id, @Valid @RequestBody BaremeDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.updateBareme(id, dto)));
    }

    // --- Compétences ---
    @GetMapping("/competences")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<CompetenceDTO>>> getCompetences(@RequestParam(required = false) Long moduleId) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.getCompetences(moduleId)));
    }

    @PostMapping("/competences")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<CompetenceDTO>> createCompetence(@Valid @RequestBody CompetenceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(noteService.createCompetence(dto)));
    }

    @DeleteMapping("/competences/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<Void> deleteCompetence(@PathVariable Long id) {
        noteService.deleteCompetence(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/evaluations-competences")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<EvaluationCompetenceDTO>>> getEvaluations(
            @RequestParam Long examenId, @RequestParam(required = false) Long eleveId) {
        return ResponseEntity.ok(ApiResponse.ok(noteService.getEvaluationsCompetences(examenId, eleveId)));
    }

    @PostMapping("/evaluations-competences")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<EvaluationCompetenceDTO>> createEvaluation(@Valid @RequestBody EvaluationCompetenceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(noteService.createEvaluationCompetence(dto)));
    }
}
