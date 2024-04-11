package com.olcmat.AssignmentSubmissionApp.dto;

import com.olcmat.AssignmentSubmissionApp.domain.Assignment;
import com.olcmat.AssignmentSubmissionApp.enums.AssignmentEnum;
import com.olcmat.AssignmentSubmissionApp.enums.AssignmentStatusEnum;

public class AssignmentResponse {

	private Assignment assignment;
	private AssignmentEnum[] assignmentEnum = AssignmentEnum.values();
	private AssignmentStatusEnum[] statusEnums = AssignmentStatusEnum.values();
	
	
	
	public AssignmentResponse(Assignment assignment) {
		super();
		this.assignment = assignment;
	}
	public Assignment getAssignment() {
		return assignment;
	}
	public void setAssignment(Assignment assignment) {
		this.assignment = assignment;
	}
	public AssignmentEnum[] getAssignmentEnum() {
		return assignmentEnum;
	}
	public AssignmentStatusEnum[] getStatusEnums() {
		return statusEnums;
	}

	
	
}
