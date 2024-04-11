package com.olcmat.AssignmentSubmissionApp.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.olcmat.AssignmentSubmissionApp.domain.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long>{

	@Query("select a from Comment a"
			+ " where a.assignment.id = :assignmentId")
	Set<Comment> findByAssignmentId(Long assignmentId);

}
