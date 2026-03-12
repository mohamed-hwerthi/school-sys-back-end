package com.schoolSys.schooolSys.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Long> {

    List<Annonce> findByActifTrueOrderByDatePublicationDesc();

    List<Annonce> findByDestinatairesInAndActifTrueOrderByDatePublicationDesc(List<String> destinataires);

    List<Annonce> findByTypeAndActifTrueOrderByDatePublicationDesc(String type);
}
