package com.schoolSys.schooolSys.examenonline;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.examenonline.dto.CreateQuizRequest;
import com.schoolSys.schooolSys.examenonline.dto.QuizDTO;
import com.schoolSys.schooolSys.examenonline.dto.QuizDetailDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<QuizDTO>>> getAll(
            @RequestParam(required = false) Long classeId,
            @RequestParam(required = false) String statut) {
        return ResponseEntity.ok(ApiResponse.ok(quizService.findAll(classeId, statut)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<QuizDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(quizService.findById(id)));
    }

    @GetMapping("/{id}/detail")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<QuizDetailDTO>> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(quizService.findDetailById(id)));
    }

    @GetMapping("/classe/{classeId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<QuizDTO>>> getByClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(ApiResponse.ok(quizService.findByClasse(classeId)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<QuizDTO>> create(@Valid @RequestBody CreateQuizRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(quizService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<QuizDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateQuizRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(quizService.update(id, request)));
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<QuizDTO>> publish(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(quizService.publish(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        quizService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
