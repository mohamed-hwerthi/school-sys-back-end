package com.schoolSys.schooolSys.conseilclasse;

import com.schoolSys.schooolSys.auth.JwtAuthenticationFilter;
import com.schoolSys.schooolSys.auth.JwtTokenProvider;
import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.conseilclasse.dto.ConseilClasseDTO;
import com.schoolSys.schooolSys.conseilclasse.dto.PropositionPassageDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ConseilClasseController.class)
@WithMockUser
@DisplayName("ConseilClasseController Integration Tests")
class ConseilClasseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ConseilClasseService conseilClasseService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUp() throws Exception {
        doAnswer(inv -> {
            inv.<jakarta.servlet.FilterChain>getArgument(2)
                    .doFilter(inv.getArgument(0), inv.getArgument(1));
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());
    }

    private ConseilClasseDTO sampleConseil() {
        PropositionPassageDTO admis = PropositionPassageDTO.builder()
                .studentId(1L).studentName("Amine Ziani")
                .niveauActuel("1ère année").classeActuelle("1A")
                .moyenneT1(14.0).moyenneT2(16.0).moyenneT3(12.0)
                .moyenneAnnuelle(14.0).rang(1)
                .decisionProposee("PASSAGE").niveauSuivant("2ème année")
                .build();
        PropositionPassageDTO redouble = PropositionPassageDTO.builder()
                .studentId(2L).studentName("Sara Bennani")
                .niveauActuel("1ère année").classeActuelle("1A")
                .moyenneT1(8.0).moyenneT2(9.0).moyenneT3(7.0)
                .moyenneAnnuelle(8.0).rang(2)
                .decisionProposee("REDOUBLEMENT").niveauSuivant("2ème année")
                .build();
        return ConseilClasseDTO.builder()
                .classeId(1L).classeNom("1A").niveauNom("1ère année")
                .niveauSuivant("2ème année").seuilPassage(10.0)
                .anneeScolaire("2025-2026")
                .propositions(List.of(admis, redouble))
                .build();
    }

    @Test
    @WithMockUser(authorities = "MANAGE_ANNEE_SCOLAIRE")
    @DisplayName("GET /api/conseil-classe/{id} should return 200 with annual averages and proposals")
    void shouldReturn200WithProposals() throws Exception {
        when(conseilClasseService.getConseilClasse(1L)).thenReturn(sampleConseil());

        mockMvc.perform(get("/api/conseil-classe/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.classeNom").value("1A"))
                .andExpect(jsonPath("$.data.seuilPassage").value(10.0))
                .andExpect(jsonPath("$.data.niveauSuivant").value("2ème année"))
                .andExpect(jsonPath("$.data.propositions").isArray())
                .andExpect(jsonPath("$.data.propositions[0].studentName").value("Amine Ziani"))
                .andExpect(jsonPath("$.data.propositions[0].moyenneAnnuelle").value(14.0))
                .andExpect(jsonPath("$.data.propositions[0].rang").value(1))
                .andExpect(jsonPath("$.data.propositions[0].decisionProposee").value("PASSAGE"))
                .andExpect(jsonPath("$.data.propositions[1].decisionProposee").value("REDOUBLEMENT"));
    }

    @Test
    @WithMockUser(authorities = "MANAGE_ANNEE_SCOLAIRE")
    @DisplayName("GET /api/conseil-classe/{id} should return 200 with empty proposals when no grades")
    void shouldReturn200WithEmptyProposals() throws Exception {
        ConseilClasseDTO empty = ConseilClasseDTO.builder()
                .classeId(9L).classeNom("9C").niveauNom("9ème année")
                .seuilPassage(10.0).propositions(List.of())
                .build();
        when(conseilClasseService.getConseilClasse(9L)).thenReturn(empty);

        mockMvc.perform(get("/api/conseil-classe/9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.propositions").isEmpty());
    }

    @Test
    @WithMockUser(authorities = "MANAGE_ANNEE_SCOLAIRE")
    @DisplayName("GET /api/conseil-classe/{id} should return 404 when the class does not exist")
    void shouldReturn404WhenClasseNotFound() throws Exception {
        when(conseilClasseService.getConseilClasse(404L))
                .thenThrow(new ResourceNotFoundException("Classe", 404L));

        mockMvc.perform(get("/api/conseil-classe/404"))
                .andExpect(status().isNotFound());
    }
}
