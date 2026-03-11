package com.schoolSys.schooolSys.common.exception;

/**
 * Thrown when a requested resource (entity) cannot be found in the database.
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * @param resource the type of resource (e.g. "Student", "Course")
     * @param id       the ID that was looked up
     */
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id);
    }
}
