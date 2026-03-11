import type { BulletinDTO } from "@/api/bulletins.api";

interface Props {
  bulletin: BulletinDTO;
  schoolName?: string;
  schoolNameAr?: string;
  anneeScolaire?: string;
}

export default function BulletinPrint({
  bulletin,
  schoolName = "المدرسة الابتدائية",
  schoolNameAr,
  anneeScolaire = "2025 / 2026",
}: Props) {
  const b = bulletin;
  const isPrive = b.version === "prive";
  const trimestreAr = ["الثلاثي الأول", "الثلاثي الثاني", "الثلاثي الثالث"][
    b.trimestre - 1
  ];

  // Count max exams across all modules for colspan
  const maxExams = Math.max(
    ...b.domaines.flatMap((d) => d.modules.map((m) => m.examens.length)),
    ...b.modulesHorsDomaine.map((m) => m.examens.length),
    1
  );

  return (
    <div
      className="bulletin-page bg-white text-black"
      dir="rtl"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "8mm 10mm",
        fontFamily: "'Amiri', 'Traditional Arabic', 'Arial', serif",
        fontSize: "11px",
        lineHeight: 1.6,
      }}
    >
      {/* Header */}
      {isPrive ? (
        /* ── Private School Header ── */
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "4mm",
            borderBottom: "3px double #1a5276",
            paddingBottom: "3mm",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#1a5276" }}>
              {schoolNameAr || schoolName}
            </div>
            <div style={{ fontSize: "9px", color: "#555", marginTop: "1mm" }}>
              مدرسة خاصة
            </div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                border: "2px solid #1a5276",
                color: "#1a5276",
                display: "inline-block",
                padding: "2mm 6mm",
                borderRadius: "4px",
              }}
            >
              بطاقة أعداد ـ {trimestreAr}
            </div>
            <div style={{ fontSize: "10px", marginTop: "2mm", color: "#555" }}>
              السنة الدراسية: {anneeScolaire}
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#1a5276" }}>
              {schoolName}
            </div>
            <div style={{ fontSize: "9px", color: "#555", marginTop: "1mm" }}>
              École Privée
            </div>
          </div>
        </div>
      ) : (
        /* ── Government (Étatique) Header ── */
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "4mm",
            borderBottom: "2px solid #333",
            paddingBottom: "3mm",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "9px", color: "#555" }}>
              الجمهورية التونسية
            </div>
            <div style={{ fontSize: "9px", color: "#555" }}>
              وزارة التربية
            </div>
            <div style={{ fontSize: "13px", fontWeight: "bold", marginTop: "2mm" }}>
              {schoolNameAr || schoolName}
            </div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                border: "2px solid #333",
                display: "inline-block",
                padding: "2mm 6mm",
                borderRadius: "4px",
              }}
            >
              بطاقة أعداد ـ {trimestreAr}
            </div>
            <div style={{ fontSize: "10px", marginTop: "2mm", color: "#555" }}>
              السنة الدراسية: {anneeScolaire}
            </div>
          </div>
          <div style={{ textAlign: "left", fontSize: "9px", color: "#555" }}>
            <div>République Tunisienne</div>
            <div>Ministère de l'Éducation</div>
            <div style={{ fontSize: "11px", fontWeight: "bold", marginTop: "2mm" }}>
              {schoolName}
            </div>
          </div>
        </div>
      )}

      {/* Student Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4mm",
          fontSize: "11px",
          backgroundColor: "#f5f5f5",
          padding: "2mm 4mm",
          borderRadius: "3px",
        }}
      >
        <div>
          <strong>التلميذ(ة): </strong>
          {b.studentNameAr || b.studentName}
        </div>
        <div>
          <strong>القسم: </strong>
          {b.classe}
        </div>
        <div>
          <strong>الثلاثي: </strong>
          {trimestreAr}
        </div>
      </div>

      {/* Grades Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "4mm",
          fontSize: "10px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#e8e8e8" }}>
            <th style={thStyle}>المجال</th>
            <th style={thStyle}>المادة</th>
            {Array.from({ length: maxExams }, (_, i) => (
              <th key={i} style={thStyle}>
                اختبار {i + 1}
              </th>
            ))}
            <th style={thStyle}>معدل المادة</th>
            <th style={thStyle}>معدل المجال</th>
            <th style={{ ...thStyle, minWidth: "30mm" }}>توصيات المعلم</th>
          </tr>
        </thead>
        <tbody>
          {b.domaines.map((domaine) => {
            const moduleCount = domaine.modules.length;
            return domaine.modules.map((mod, modIdx) => (
              <tr key={`${domaine.domaineId}-${mod.moduleId}`}>
                {modIdx === 0 && (
                  <td
                    rowSpan={moduleCount}
                    style={{
                      ...tdStyle,
                      fontWeight: "bold",
                      backgroundColor: "#f9f9f9",
                      textAlign: "center",
                      verticalAlign: "middle",
                      writingMode: moduleCount > 2 ? "vertical-rl" : undefined,
                      maxWidth: moduleCount > 2 ? "20px" : undefined,
                      fontSize: moduleCount > 2 ? "10px" : "10px",
                    }}
                  >
                    {domaine.domaineNameAr || domaine.domaineName}
                  </td>
                )}
                <td style={{ ...tdStyle, fontWeight: "500" }}>{mod.moduleName}</td>
                {Array.from({ length: maxExams }, (_, i) => {
                  const ex = mod.examens[i];
                  return (
                    <td key={i} style={{ ...tdStyle, textAlign: "center" }}>
                      {ex?.note != null ? formatNote(ex.note) : "—"}
                    </td>
                  );
                })}
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor:
                      mod.moyenneModule >= 10 ? "#e8f5e9" : "#ffebee",
                  }}
                >
                  {formatNote(mod.moyenneModule)}
                </td>
                {modIdx === 0 && (
                  <td
                    rowSpan={moduleCount}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "12px",
                      verticalAlign: "middle",
                      backgroundColor:
                        domaine.moyenneDomaine >= 10 ? "#e8f5e9" : "#ffebee",
                    }}
                  >
                    {formatNote(domaine.moyenneDomaine)}
                  </td>
                )}
                {modIdx === 0 && (
                  <td
                    rowSpan={moduleCount}
                    style={{
                      ...tdStyle,
                      fontSize: "9px",
                      verticalAlign: "top",
                      lineHeight: 1.5,
                    }}
                  >
                    {domaine.recommandation || ""}
                  </td>
                )}
              </tr>
            ));
          })}
          {/* Modules without domaine */}
          {b.modulesHorsDomaine.length > 0 && (
            <>
              {b.modulesHorsDomaine.map((mod, modIdx) => (
                <tr key={`hd-${mod.moduleId}`}>
                  {modIdx === 0 && (
                    <td
                      rowSpan={b.modulesHorsDomaine.length}
                      style={{
                        ...tdStyle,
                        fontWeight: "bold",
                        backgroundColor: "#f9f9f9",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      مواد أخرى
                    </td>
                  )}
                  <td style={{ ...tdStyle, fontWeight: "500" }}>
                    {mod.moduleName}
                  </td>
                  {Array.from({ length: maxExams }, (_, i) => {
                    const ex = mod.examens[i];
                    return (
                      <td key={i} style={{ ...tdStyle, textAlign: "center" }}>
                        {ex?.note != null ? formatNote(ex.note) : "—"}
                      </td>
                    );
                  })}
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      fontWeight: "bold",
                      backgroundColor:
                        mod.moyenneModule >= 10 ? "#e8f5e9" : "#ffebee",
                    }}
                  >
                    {formatNote(mod.moyenneModule)}
                  </td>
                  {modIdx === 0 && (
                    <>
                      <td
                        rowSpan={b.modulesHorsDomaine.length}
                        style={{ ...tdStyle, textAlign: "center" }}
                      >
                        —
                      </td>
                      <td
                        rowSpan={b.modulesHorsDomaine.length}
                        style={tdStyle}
                      />
                    </>
                  )}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {/* Bottom Section: Stats + General Average */}
      <div
        style={{
          display: "flex",
          gap: "4mm",
          marginBottom: "4mm",
        }}
      >
        {/* General Average Box */}
        <div
          style={{
            flex: 1,
            border: "2px solid #333",
            borderRadius: "4px",
            padding: "3mm",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "2mm" }}>
            المعدل العام
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: b.moyenneGenerale >= 10 ? "#2e7d32" : "#c62828",
            }}
          >
            {formatNote(b.moyenneGenerale)}
          </div>
          <div style={{ fontSize: "9px", color: "#555", marginTop: "1mm" }}>
            / 20
          </div>
        </div>

        {/* Stats Box */}
        <div
          style={{
            flex: 2,
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "3mm",
          }}
        >
          <table style={{ width: "100%", fontSize: "10px" }}>
            <tbody>
              <tr>
                <td style={statLabelStyle}>ترتيب التلميذ</td>
                <td style={statValueStyle}>
                  <strong>{b.rang}</strong> / {b.totalEleves}
                </td>
                <td style={statLabelStyle}>معدل القسم</td>
                <td style={statValueStyle}>{formatNote(b.moyenneClasse)}</td>
              </tr>
              <tr>
                <td style={statLabelStyle}>أعلى معدل</td>
                <td style={{ ...statValueStyle, color: "#2e7d32" }}>
                  {formatNote(b.moyenneMax)}
                </td>
                <td style={statLabelStyle}>أدنى معدل</td>
                <td style={{ ...statValueStyle, color: "#c62828" }}>
                  {formatNote(b.moyenneMin)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Observation & Certificate Row */}
      <div
        style={{
          display: "flex",
          gap: "4mm",
          marginBottom: "4mm",
        }}
      >
        {/* Comportement */}
        <div
          style={{
            flex: 2,
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "3mm",
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: "bold", marginBottom: "1mm" }}>
            ملاحظات السلوك
          </div>
          <div style={{ fontSize: "10px", minHeight: "8mm" }}>
            {b.comportement || ""}
          </div>
        </div>

        {/* Certificate */}
        <div
          style={{
            flex: 1,
            border: "2px solid #b8860b",
            borderRadius: "4px",
            padding: "3mm",
            textAlign: "center",
            backgroundColor: b.certificatType ? "#fffde7" : "transparent",
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: "bold", marginBottom: "1mm" }}>
            الشهادة
          </div>
          <div style={{ fontSize: "12px", fontWeight: "bold", color: "#b8860b" }}>
            {b.certificatType || "—"}
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "6mm",
          fontSize: "10px",
        }}
      >
        <div style={{ textAlign: "center", width: "30%" }}>
          <div style={{ fontWeight: "bold", marginBottom: "10mm" }}>
            إمضاء المعلم(ة)
          </div>
          <div style={{ borderTop: "1px dotted #999", paddingTop: "1mm" }}>
            ............................
          </div>
        </div>
        <div style={{ textAlign: "center", width: "30%" }}>
          <div style={{ fontWeight: "bold", marginBottom: "10mm" }}>
            إمضاء مدير(ة) المدرسة
          </div>
          <div style={{ borderTop: "1px dotted #999", paddingTop: "1mm" }}>
            ............................
          </div>
        </div>
        <div style={{ textAlign: "center", width: "30%" }}>
          <div style={{ fontWeight: "bold", marginBottom: "10mm" }}>
            إمضاء الولي
          </div>
          <div style={{ borderTop: "1px dotted #999", paddingTop: "1mm" }}>
            ............................
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNote(val: number): string {
  return val.toFixed(2);
}

const thStyle: React.CSSProperties = {
  border: "1px solid #999",
  padding: "2mm 2mm",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "9px",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "1.5mm 2mm",
  fontSize: "10px",
};

const statLabelStyle: React.CSSProperties = {
  padding: "1mm 2mm",
  fontWeight: "bold",
  color: "#555",
  whiteSpace: "nowrap",
};

const statValueStyle: React.CSSProperties = {
  padding: "1mm 2mm",
  fontWeight: "bold",
  textAlign: "center",
};
