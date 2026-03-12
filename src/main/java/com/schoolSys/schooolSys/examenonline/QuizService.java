package com.schoolSys.schooolSys.examenonline;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.examenonline.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final TentativeRepository tentativeRepository;

    public List<QuizDTO> findAll(Long classeId, String statut) {
        List<Quiz> quizzes;
        if (classeId != null) {
            quizzes = quizRepository.findByClasseIdOrderByCreatedAtDesc(classeId);
        } else if (statut != null) {
            quizzes = quizRepository.findByStatutOrderByCreatedAtDesc(statut);
        } else {
            quizzes = quizRepository.findAllByOrderByCreatedAtDesc();
        }
        return quizzes.stream().map(this::toDTO).toList();
    }

    public QuizDTO findById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));
        return toDTO(quiz);
    }

    public QuizDetailDTO findDetailById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));

        List<Question> questions = questionRepository.findByQuizIdOrderByOrdreAsc(id);
        List<QuestionDTO> questionDTOs = questions.stream().map(this::toQuestionDTO).toList();

        return QuizDetailDTO.builder()
                .id(quiz.getId())
                .titre(quiz.getTitre())
                .description(quiz.getDescription())
                .moduleId(quiz.getModuleId())
                .classeId(quiz.getClasseId())
                .enseignantId(quiz.getEnseignantId())
                .dureeMinutes(quiz.getDureeMinutes())
                .noteTotale(quiz.getNoteTotale())
                .melangerQuestions(quiz.getMelangerQuestions())
                .melangerReponses(quiz.getMelangerReponses())
                .afficherResultats(quiz.getAfficherResultats())
                .tentativesMax(quiz.getTentativesMax())
                .dateDebut(quiz.getDateDebut())
                .dateFin(quiz.getDateFin())
                .statut(quiz.getStatut())
                .questions(questionDTOs)
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }

    public List<QuizDTO> findByClasse(Long classeId) {
        return quizRepository.findByClasseIdOrderByCreatedAtDesc(classeId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public QuizDTO create(CreateQuizRequest request) {
        Quiz quiz = Quiz.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .moduleId(request.getModuleId())
                .classeId(request.getClasseId())
                .enseignantId(request.getEnseignantId())
                .dureeMinutes(request.getDureeMinutes())
                .noteTotale(request.getNoteTotale())
                .melangerQuestions(request.getMelangerQuestions())
                .melangerReponses(request.getMelangerReponses())
                .afficherResultats(request.getAfficherResultats())
                .tentativesMax(request.getTentativesMax())
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .statut(request.getStatut())
                .build();
        return toDTO(quizRepository.save(quiz));
    }

    @Transactional
    public QuizDTO update(Long id, CreateQuizRequest request) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));

        quiz.setTitre(request.getTitre());
        quiz.setDescription(request.getDescription());
        quiz.setModuleId(request.getModuleId());
        quiz.setClasseId(request.getClasseId());
        quiz.setEnseignantId(request.getEnseignantId());
        quiz.setDureeMinutes(request.getDureeMinutes());
        quiz.setNoteTotale(request.getNoteTotale());
        quiz.setMelangerQuestions(request.getMelangerQuestions());
        quiz.setMelangerReponses(request.getMelangerReponses());
        quiz.setAfficherResultats(request.getAfficherResultats());
        quiz.setTentativesMax(request.getTentativesMax());
        quiz.setDateDebut(request.getDateDebut());
        quiz.setDateFin(request.getDateFin());
        quiz.setStatut(request.getStatut());
        quiz.setUpdatedAt(LocalDateTime.now());

        return toDTO(quizRepository.save(quiz));
    }

    @Transactional
    public QuizDTO publish(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));
        quiz.setStatut("PUBLIE");
        quiz.setUpdatedAt(LocalDateTime.now());
        return toDTO(quizRepository.save(quiz));
    }

    @Transactional
    public void delete(Long id) {
        if (!quizRepository.existsById(id)) {
            throw new ResourceNotFoundException("Quiz", id);
        }
        quizRepository.deleteById(id);
    }

    private QuizDTO toDTO(Quiz quiz) {
        long totalQuestions = questionRepository.countByQuizId(quiz.getId());
        long totalTentatives = tentativeRepository.countByQuizId(quiz.getId());

        return QuizDTO.builder()
                .id(quiz.getId())
                .titre(quiz.getTitre())
                .description(quiz.getDescription())
                .moduleId(quiz.getModuleId())
                .classeId(quiz.getClasseId())
                .enseignantId(quiz.getEnseignantId())
                .dureeMinutes(quiz.getDureeMinutes())
                .noteTotale(quiz.getNoteTotale())
                .melangerQuestions(quiz.getMelangerQuestions())
                .melangerReponses(quiz.getMelangerReponses())
                .afficherResultats(quiz.getAfficherResultats())
                .tentativesMax(quiz.getTentativesMax())
                .dateDebut(quiz.getDateDebut())
                .dateFin(quiz.getDateFin())
                .statut(quiz.getStatut())
                .totalQuestions(totalQuestions)
                .totalTentatives(totalTentatives)
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }

    private QuestionDTO toQuestionDTO(Question question) {
        List<ChoixReponseDTO> choixDTOs = question.getChoix().stream()
                .map(c -> ChoixReponseDTO.builder()
                        .id(c.getId())
                        .texte(c.getTexte())
                        .correct(c.getCorrect())
                        .ordre(c.getOrdre())
                        .build())
                .toList();

        return QuestionDTO.builder()
                .id(question.getId())
                .quizId(question.getQuiz().getId())
                .texte(question.getTexte())
                .typeQuestion(question.getTypeQuestion())
                .points(question.getPoints())
                .ordre(question.getOrdre())
                .explication(question.getExplication())
                .imageUrl(question.getImageUrl())
                .obligatoire(question.getObligatoire())
                .choix(choixDTOs)
                .build();
    }
}
