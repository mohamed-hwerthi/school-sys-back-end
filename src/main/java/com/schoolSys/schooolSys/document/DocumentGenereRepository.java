package com.schoolSys.schooolSys.document;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentGenereRepository extends JpaRepository<DocumentGenere, Long> {

    List<DocumentGenere> findAllByOrderByCreatedAtDesc();

    List<DocumentGenere> findByEleveIdOrderByCreatedAtDesc(Long eleveId);

    List<DocumentGenere> findByTypeDocumentOrderByCreatedAtDesc(DocumentGenere.TypeDocument typeDocument);
}
