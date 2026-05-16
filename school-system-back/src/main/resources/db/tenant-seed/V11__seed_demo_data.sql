-- =============================================================
-- Demo data for testing: niveaux, classes, domaines, modules,
-- students, examens, notes, recommendations, observations
-- =============================================================

-- ── Niveaux ──────────────────────────────────────────────────
INSERT INTO niveaux (id, name) VALUES
    (1, '1ère année'),
    (2, '2ème année'),
    (3, '3ème année'),
    (4, '4ème année'),
    (5, '5ème année'),
    (6, '6ème année')
ON CONFLICT (name) DO NOTHING;

-- ── Classes ──────────────────────────────────────────────────
INSERT INTO classes (niveau_id, letter) VALUES
    (1, 'A'), (1, 'B'),
    (2, 'A'), (2, 'B'),
    (3, 'A'),
    (4, 'A'),
    (5, 'A'),
    (6, 'A')
ON CONFLICT (niveau_id, letter) DO NOTHING;

-- ── Domaines (for 6ème année as primary test level) ─────────
INSERT INTO domaines (id, name, name_ar, ordre, niveau_id) VALUES
    (1, 'Langue Arabe',              'مجال اللغة العربية',         1, 6),
    (2, 'Langue Française',          'مجال اللغة الفرنسية',        2, 6),
    (3, 'Sciences & Technologie',    'مجال العلوم و التكنولوجيا',  3, 6),
    (4, 'Éducation & Citoyenneté',   'مجال التنشئة الاجتماعية',    4, 6)
ON CONFLICT DO NOTHING;

-- ── Modules (6ème année) ─────────────────────────────────────
INSERT INTO modules (id, name, coeff_etatique, coeff_prive, ordre_etatique, ordre_prive, niveau_id, domaine_id) VALUES
    -- Langue Arabe
    (1, 'القراءة',      2, 2, 1, 1, 6, 1),
    (2, 'الإنتاج الكتابي', 2, 2, 2, 2, 6, 1),
    (3, 'قواعد اللغة',  1, 1, 3, 3, 6, 1),
    -- Langue Française
    (4, 'Lecture',       2, 2, 1, 1, 6, 2),
    (5, 'Production écrite', 2, 2, 2, 2, 6, 2),
    (6, 'Grammaire',    1, 1, 3, 3, 6, 2),
    -- Sciences & Technologie
    (7, 'Mathématiques', 2, 3, 1, 1, 6, 3),
    (8, 'Éveil scientifique', 1, 1, 2, 2, 6, 3),
    (9, 'Technologie',  1, 1, 3, 3, 6, 3),
    -- Éducation
    (10, 'Éducation islamique', 1, 1, 1, 1, 6, 4),
    (11, 'Éducation civique',   1, 1, 2, 2, 6, 4),
    (12, 'Histoire-Géo',        1, 1, 3, 3, 6, 4)
ON CONFLICT DO NOTHING;

-- ── Students (6ème A = classe "6A") ──────────────────────────
INSERT INTO students (id, first_name, last_name, first_name_ar, last_name_ar, sex, classe, niveau, status)
VALUES
    (1,  'Ahmed',   'Ben Salah',    'أحمد',    'بن صالح',    'M', '6A', '6ème année', 'Actif'),
    (2,  'Fatma',   'Trabelsi',     'فاطمة',   'الطرابلسي',  'F', '6A', '6ème année', 'Actif'),
    (3,  'Mohamed', 'Gharbi',       'محمد',     'الغربي',     'M', '6A', '6ème année', 'Actif'),
    (4,  'Amira',   'Bouazizi',     'أميرة',   'البوعزيزي',  'F', '6A', '6ème année', 'Actif'),
    (5,  'Youssef', 'Hammami',      'يوسف',    'الهمامي',    'M', '6A', '6ème année', 'Actif'),
    (6,  'Sarra',   'Jebali',       'سارة',    'الجبالي',    'F', '6A', '6ème année', 'Actif'),
    (7,  'Khalil',  'Meddeb',       'خليل',    'المدب',      'M', '6A', '6ème année', 'Actif'),
    (8,  'Ines',    'Chaabane',     'إيناس',   'الشعباني',   'F', '6A', '6ème année', 'Actif'),
    (9,  'Omar',    'Karoui',       'عمر',     'القروي',     'M', '6A', '6ème année', 'Actif'),
    (10, 'Mariem',  'Sfaxi',        'مريم',    'الصفاقسي',   'F', '6A', '6ème année', 'Actif')
ON CONFLICT DO NOTHING;

-- ── Get the classe ID for 6A ─────────────────────────────────
-- We need the classe_id for examens. 6ème année = niveau_id 6, letter A
-- Using a DO block to set variables

DO $$
DECLARE
    v_classe_id BIGINT;
BEGIN
    SELECT id INTO v_classe_id FROM classes WHERE niveau_id = 6 AND letter = 'A';

    IF v_classe_id IS NULL THEN
        RAISE NOTICE 'Classe 6A not found, skipping examen/note seeding';
        RETURN;
    END IF;

    -- ── Examens (2 per module for 6A) ────────────────────────
    INSERT INTO examens (id, name, coeff_etatique, coeff_prive, ordre_etatique, ordre_prive, classe_id, module_id)
    VALUES
        -- القراءة
        (1,  'Oral',          1, 1, 1, 1, v_classe_id, 1),
        (2,  'Écrit',         2, 2, 2, 2, v_classe_id, 1),
        -- الإنتاج الكتابي
        (3,  'Oral',          1, 1, 1, 1, v_classe_id, 2),
        (4,  'Écrit',         2, 2, 2, 2, v_classe_id, 2),
        -- قواعد اللغة
        (5,  'Contrôle',      1, 1, 1, 1, v_classe_id, 3),
        (6,  'Synthèse',      2, 2, 2, 2, v_classe_id, 3),
        -- Lecture
        (7,  'Oral',          1, 1, 1, 1, v_classe_id, 4),
        (8,  'Écrit',         2, 2, 2, 2, v_classe_id, 4),
        -- Production écrite
        (9,  'Oral',          1, 1, 1, 1, v_classe_id, 5),
        (10, 'Écrit',         2, 2, 2, 2, v_classe_id, 5),
        -- Grammaire
        (11, 'Contrôle',      1, 1, 1, 1, v_classe_id, 6),
        (12, 'Synthèse',      2, 2, 2, 2, v_classe_id, 6),
        -- Mathématiques
        (13, 'Contrôle',      1, 1, 1, 1, v_classe_id, 7),
        (14, 'Synthèse',      2, 2, 2, 2, v_classe_id, 7),
        -- Éveil scientifique
        (15, 'Contrôle',      1, 1, 1, 1, v_classe_id, 8),
        (16, 'Synthèse',      2, 2, 2, 2, v_classe_id, 8),
        -- Technologie
        (17, 'Pratique',      1, 1, 1, 1, v_classe_id, 9),
        (18, 'Théorie',       2, 2, 2, 2, v_classe_id, 9),
        -- Éducation islamique
        (19, 'Contrôle',      1, 1, 1, 1, v_classe_id, 10),
        (20, 'Synthèse',      2, 2, 2, 2, v_classe_id, 10),
        -- Éducation civique
        (21, 'Contrôle',      1, 1, 1, 1, v_classe_id, 11),
        (22, 'Synthèse',      2, 2, 2, 2, v_classe_id, 11),
        -- Histoire-Géo
        (23, 'Contrôle',      1, 1, 1, 1, v_classe_id, 12),
        (24, 'Synthèse',      2, 2, 2, 2, v_classe_id, 12)
    ON CONFLICT DO NOTHING;

    -- ── Notes (Trimestre 1 for all 10 students) ──────────────
    -- Realistic grades for a Tunisian school

    -- Student 1: Ahmed Ben Salah (excellent - ~18)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (1,1,1,18),(1,2,1,19),(1,3,1,17),(1,4,1,18.5),(1,5,1,18),(1,6,1,17.5),
        (1,7,1,16),(1,8,1,17),(1,9,1,16.5),(1,10,1,17),(1,11,1,18),(1,12,1,19),
        (1,13,1,19),(1,14,1,18.5),(1,15,1,17),(1,16,1,18),(1,17,1,16),(1,18,1,17.5),
        (1,19,1,18),(1,20,1,19),(1,21,1,17),(1,22,1,18),(1,23,1,16.5),(1,24,1,17)
    ON CONFLICT DO NOTHING;

    -- Student 2: Fatma Trabelsi (very good - ~16)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (2,1,1,16),(2,2,1,17),(2,3,1,15),(2,4,1,16.5),(2,5,1,16),(2,6,1,15.5),
        (2,7,1,15),(2,8,1,16),(2,9,1,14.5),(2,10,1,15),(2,11,1,16),(2,12,1,17),
        (2,13,1,17),(2,14,1,16.5),(2,15,1,15),(2,16,1,16),(2,17,1,14),(2,18,1,15.5),
        (2,19,1,16),(2,20,1,17),(2,21,1,15),(2,22,1,16),(2,23,1,14.5),(2,24,1,15)
    ON CONFLICT DO NOTHING;

    -- Student 3: Mohamed Gharbi (good - ~14)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (3,1,1,14),(3,2,1,15),(3,3,1,13),(3,4,1,14.5),(3,5,1,14),(3,6,1,13.5),
        (3,7,1,13),(3,8,1,14),(3,9,1,12.5),(3,10,1,13),(3,11,1,14),(3,12,1,15),
        (3,13,1,15),(3,14,1,14.5),(3,15,1,13),(3,16,1,14),(3,17,1,12),(3,18,1,13.5),
        (3,19,1,14),(3,20,1,15),(3,21,1,13),(3,22,1,14),(3,23,1,12.5),(3,24,1,13)
    ON CONFLICT DO NOTHING;

    -- Student 4: Amira Bouazizi (encouraging - ~12.5)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (4,1,1,12),(4,2,1,13),(4,3,1,11),(4,4,1,13),(4,5,1,12.5),(4,6,1,12),
        (4,7,1,11),(4,8,1,12),(4,9,1,11.5),(4,10,1,12),(4,11,1,13),(4,12,1,14),
        (4,13,1,14),(4,14,1,13),(4,15,1,11.5),(4,16,1,12),(4,17,1,11),(4,18,1,12),
        (4,19,1,13),(4,20,1,13.5),(4,21,1,12),(4,22,1,12.5),(4,23,1,11),(4,24,1,12)
    ON CONFLICT DO NOTHING;

    -- Student 5: Youssef Hammami (average - ~11)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (5,1,1,11),(5,2,1,12),(5,3,1,10),(5,4,1,11.5),(5,5,1,11),(5,6,1,10.5),
        (5,7,1,10),(5,8,1,11),(5,9,1,10),(5,10,1,10.5),(5,11,1,11),(5,12,1,12),
        (5,13,1,12),(5,14,1,11.5),(5,15,1,10),(5,16,1,11),(5,17,1,10),(5,18,1,11),
        (5,19,1,11),(5,20,1,12),(5,21,1,10),(5,22,1,11),(5,23,1,10),(5,24,1,11)
    ON CONFLICT DO NOTHING;

    -- Student 6: Sarra Jebali (good+ - ~15)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (6,1,1,15),(6,2,1,16),(6,3,1,14),(6,4,1,15.5),(6,5,1,15),(6,6,1,14.5),
        (6,7,1,14),(6,8,1,15),(6,9,1,13.5),(6,10,1,14),(6,11,1,15),(6,12,1,16),
        (6,13,1,16),(6,14,1,15.5),(6,15,1,14),(6,16,1,15),(6,17,1,13),(6,18,1,14.5),
        (6,19,1,15),(6,20,1,16),(6,21,1,14),(6,22,1,15),(6,23,1,13.5),(6,24,1,14)
    ON CONFLICT DO NOTHING;

    -- Student 7: Khalil Meddeb (below average - ~9)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (7,1,1,9),(7,2,1,10),(7,3,1,8),(7,4,1,9.5),(7,5,1,9),(7,6,1,8.5),
        (7,7,1,8),(7,8,1,9),(7,9,1,8),(7,10,1,8.5),(7,11,1,9),(7,12,1,10),
        (7,13,1,10),(7,14,1,9.5),(7,15,1,8),(7,16,1,9),(7,17,1,8),(7,18,1,9),
        (7,19,1,9),(7,20,1,10),(7,21,1,8),(7,22,1,9),(7,23,1,8),(7,24,1,9)
    ON CONFLICT DO NOTHING;

    -- Student 8: Ines Chaabane (very good - ~17)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (8,1,1,17),(8,2,1,18),(8,3,1,16),(8,4,1,17.5),(8,5,1,17),(8,6,1,16.5),
        (8,7,1,16),(8,8,1,17),(8,9,1,15.5),(8,10,1,16),(8,11,1,17),(8,12,1,18),
        (8,13,1,18),(8,14,1,17.5),(8,15,1,16),(8,16,1,17),(8,17,1,15),(8,18,1,16.5),
        (8,19,1,17),(8,20,1,18),(8,21,1,16),(8,22,1,17),(8,23,1,15.5),(8,24,1,16)
    ON CONFLICT DO NOTHING;

    -- Student 9: Omar Karoui (average - ~10.5)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (9,1,1,10),(9,2,1,11),(9,3,1,9.5),(9,4,1,10.5),(9,5,1,10),(9,6,1,10),
        (9,7,1,10),(9,8,1,11),(9,9,1,9.5),(9,10,1,10),(9,11,1,11),(9,12,1,11.5),
        (9,13,1,11),(9,14,1,10.5),(9,15,1,10),(9,16,1,10.5),(9,17,1,9.5),(9,18,1,10),
        (9,19,1,10.5),(9,20,1,11),(9,21,1,10),(9,22,1,10.5),(9,23,1,9.5),(9,24,1,10)
    ON CONFLICT DO NOTHING;

    -- Student 10: Mariem Sfaxi (weak - ~7.5)
    INSERT INTO notes (student_id, examen_id, trimestre, valeur) VALUES
        (10,1,1,7),(10,2,1,8),(10,3,1,6.5),(10,4,1,7.5),(10,5,1,7),(10,6,1,7),
        (10,7,1,7),(10,8,1,8),(10,9,1,6.5),(10,10,1,7),(10,11,1,8),(10,12,1,8.5),
        (10,13,1,8),(10,14,1,7.5),(10,15,1,7),(10,16,1,7.5),(10,17,1,6.5),(10,18,1,7),
        (10,19,1,7.5),(10,20,1,8),(10,21,1,7),(10,22,1,7.5),(10,23,1,6.5),(10,24,1,7)
    ON CONFLICT DO NOTHING;

    -- ── Recommandations (Trimestre 1 - sample) ──────────────
    INSERT INTO recommandations (student_id, domaine_id, trimestre, texte) VALUES
        (1, 1, 1, 'أداء ممتاز، واصل على هذا المنوال'),
        (1, 3, 1, 'متفوق في الرياضيات، يحتاج تعزيز في التكنولوجيا'),
        (7, 1, 1, 'يحتاج إلى مزيد من المراجعة والتدريب'),
        (7, 3, 1, 'بحاجة إلى دعم في الرياضيات'),
        (10, 1, 1, 'مستوى ضعيف، يجب المتابعة مع الأولياء'),
        (10, 3, 1, 'يحتاج إلى دروس دعم ومساندة')
    ON CONFLICT DO NOTHING;

    -- ── Observations (Trimestre 1 - sample) ──────────────────
    INSERT INTO observations_trimestre (student_id, trimestre, comportement, certificat_type) VALUES
        (1, 1, 'سلوك حسن، مجتهد ومنضبط', NULL),
        (2, 1, 'تلميذة مجتهدة ومنظمة', NULL),
        (7, 1, 'يحتاج إلى تحسين سلوكه في القسم', NULL),
        (8, 1, 'تلميذة مثالية في السلوك والعمل', NULL),
        (10, 1, 'كثيرة الغياب، يجب متابعة الأولياء', NULL)
    ON CONFLICT DO NOTHING;

END $$;
