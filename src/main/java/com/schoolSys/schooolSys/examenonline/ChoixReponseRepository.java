package com.schoolSys.schooolSys.examenonline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChoixReponseRepository extends JpaRepository<ChoixReponse, Long> {

    List<ChoixReponse> findByQuestionIdOrderByOrdreAsc(Long questionId);
}
