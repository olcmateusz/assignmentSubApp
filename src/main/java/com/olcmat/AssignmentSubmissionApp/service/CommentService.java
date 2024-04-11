package com.olcmat.AssignmentSubmissionApp.service;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.olcmat.AssignmentSubmissionApp.domain.Assignment;
import com.olcmat.AssignmentSubmissionApp.domain.Comment;
import com.olcmat.AssignmentSubmissionApp.domain.User;
import com.olcmat.AssignmentSubmissionApp.dto.CommentDto;
import com.olcmat.AssignmentSubmissionApp.repository.AssignmentRepository;
import com.olcmat.AssignmentSubmissionApp.repository.CommentRepository;

@Service
public class CommentService {

	@Autowired
	private CommentRepository commentRepo;
	
	@Autowired
	private AssignmentRepository assignmentRepo;
	
	public Comment save(CommentDto commentDto, User user) {
		
		Comment comment = new Comment();
		Assignment assignment = assignmentRepo.getById(commentDto.getAssignmentId());
		
		comment.setAssignment(assignment);
		comment.setComment(commentDto.getText());
		comment.setCreator(user);
		comment.setTimeOfCreation(LocalDateTime.now());
		
		return commentRepo.save(comment);

	}

	public Set<Comment> getAssignmentComment(Long assignmentId) {
		
		Set<Comment> comments = commentRepo.findByAssignmentId(assignmentId);
		
	return comments;
	}

	
}
