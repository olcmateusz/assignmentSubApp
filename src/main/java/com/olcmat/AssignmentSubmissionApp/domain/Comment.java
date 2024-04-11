package com.olcmat.AssignmentSubmissionApp.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="comments")
public class Comment {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private LocalDateTime timeOfCreation;
	@JsonIgnore
	@ManyToOne
	private Assignment assignment;
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User creator;
	@Column(columnDefinition = "TEXT")
	private String comment;
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public LocalDateTime getTimeOfCreation() {
		return timeOfCreation;
	}
	public void setTimeOfCreation(LocalDateTime timeOfCreation) {
		this.timeOfCreation = timeOfCreation;
	}
	public User getCreator() {
		return creator;
	}
	public void setCreator(User creator) {
		this.creator = creator;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public Assignment getAssignment() {
		return assignment;
	}
	public void setAssignment(Assignment assignment) {
		this.assignment = assignment;
	}
	
	
	
}
