package com.schoolSys.schooolSys.student;

import org.springframework.data.jpa.domain.Specification;

public final class StudentSpecification {

    private StudentSpecification() {}

    private static final Specification<Student> NO_OP = (root, query, cb) -> cb.conjunction();

    public static Specification<Student> search(String query) {
        if (query == null || query.isBlank()) return NO_OP;
        String like = "%" + query.toLowerCase() + "%";
        return (root, cq, cb) -> cb.or(
                cb.like(cb.lower(root.get("firstName")), like),
                cb.like(cb.lower(root.get("lastName")), like),
                cb.like(cb.lower(root.get("firstNameAr")), like),
                cb.like(cb.lower(root.get("lastNameAr")), like),
                cb.like(cb.lower(root.get("registrationNumber")), like),
                cb.like(cb.lower(root.get("classe")), like)
        );
    }

    public static Specification<Student> hasNiveau(String niveau) {
        if (niveau == null || niveau.isBlank()) return NO_OP;
        return (root, cq, cb) -> cb.equal(root.get("niveau"), niveau);
    }

    public static Specification<Student> hasClasse(String classe) {
        if (classe == null || classe.isBlank()) return NO_OP;
        return (root, cq, cb) -> cb.equal(root.get("classe"), classe);
    }

    public static Specification<Student> hasStatus(String status) {
        if (status == null || status.isBlank()) return NO_OP;
        return (root, cq, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Student> hasSex(String sex) {
        if (sex == null || sex.isBlank()) return NO_OP;
        return (root, cq, cb) -> cb.equal(root.get("sex"), sex);
    }

    public static Specification<Student> isBlocked(Boolean blocked) {
        if (blocked == null) return NO_OP;
        return (root, cq, cb) -> cb.equal(root.get("isBlocked"), blocked);
    }
}
