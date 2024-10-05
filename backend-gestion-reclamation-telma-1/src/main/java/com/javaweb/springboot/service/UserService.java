package com.javaweb.springboot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javaweb.springboot.model.User;
import com.javaweb.springboot.repository.UserRepository;

@Service
public class UserService {
	 @Autowired
	    private UserRepository userRepository; // Utiliser votre repository pour interagir avec la base de données

	    public User registerNewUser(User user) {
	        // Logique pour enregistrer un nouvel utilisateur
	        return userRepository.save(user);
	    }

	    public void validateUser(Long userId, String role) {
	        // Logique pour valider un utilisateur et définir son rôle
	        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
	        user.setRole(role);
	        userRepository.save(user);
	    }

	    public User getUserById(Long userId) {
	        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
	    }
	    public void saveUser(User user) {
	        // Vous pouvez ajouter des validations ou transformations ici si nécessaire
	        userRepository.save(user);
	    }
	 
}

