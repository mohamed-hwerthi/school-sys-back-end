package com.schoolSys.schooolSys.cantine;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, UUID> {

    List<Menu> findBySemaineOrderByDateMenuAsc(Integer semaine);

    List<Menu> findByDateMenuBetweenOrderByDateMenuAsc(LocalDate start, LocalDate end);

    List<Menu> findByDateMenu(LocalDate date);

    List<Menu> findByTypeRegime(String typeRegime);
}
