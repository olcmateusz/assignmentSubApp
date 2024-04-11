package com.olcmat.AssignmentSubmissionApp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.olcmat.AssignmentSubmissionApp.domain.User;
import com.olcmat.AssignmentSubmissionApp.repository.UserRepository;
import com.olcmat.AssignmentSubmissionApp.util.CustomPasswordEncoder;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		Optional<User> userOpt = userRepo.findByUsername(username);
		
		return userOpt.orElseThrow(() -> new UsernameNotFoundException("Invalid Credentials"));
		
	}
	
}
