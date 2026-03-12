package com.schoolSys.schooolSys.cantine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CantineStatsDTO {
    private long totalAbonnes;
    private long repasAujourdHui;
    private double tauxPresence;
    private BigDecimal revenuesMensuel;
}
