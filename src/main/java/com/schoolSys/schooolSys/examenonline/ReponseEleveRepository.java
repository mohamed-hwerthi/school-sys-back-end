package com.schoolSys.schooolSys.examenonline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReponseEleveRepository extends JpaRepository<ReponseEleve, Long> {

    List<ReponseEleve> findByTentativeIdOrderByQuestionOrdreAsc(Long tentativeId);

    List<ReponseEleve> findByTentativeIdAndQuestionId(Long tentativeId, Long questionId);
}
