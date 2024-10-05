package com.javaweb.springboot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javaweb.springboot.exception.ResourceNotFoundException;
import com.javaweb.springboot.model.User;
import com.javaweb.springboot.repository.UserRepository;
import com.javaweb.springboot.service.EmailService;
import com.javaweb.springboot.util.AESUtil.AESUtil;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
	@Autowired 
	private UserRepository userRepository;
	
	@Autowired
    private EmailService emailService;
	
	
	

	
	// get all users
	@GetMapping("/users")
	public List<User> getAllUsers(){
	    return userRepository.findAllByOrderByIdAsc();  // Pour un tri ascendant
	}
	
	// Créer un utilisateur (pour tests ou autres)
		 @PostMapping("/users")
		 public ResponseEntity<User> createUser(@RequestBody User user) {
				User savedUser = userRepository.save(user);
				return ResponseEntity.ok(savedUser);
			    }
		 
		 @GetMapping("/users/{id}")
			public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
			 User user = userRepository.findById(id)
						.orElseThrow(() -> new ResourceNotFoundException("User not exist with id:" + id));
				return ResponseEntity.ok(user);
			}
		 //Inscription de l'utilisateur
		 @PostMapping("/signup")
		 public ResponseEntity<String> signUp(@RequestBody User user) {
		     try {
		         // Chiffrer le mot de passe avec AES avant de sauvegarder
		         String encryptedPassword = AESUtil.encrypt(user.getPassword());
		         user.setPassword(encryptedPassword);
		         user.setEnabled(false); // Désactiver le compte jusqu'à validation
		         userRepository.save(user);

		         // Envoyer l'email de validation à l'administrateur
		         emailService.sendValidationEmail(user);

		         return ResponseEntity.ok("Inscription réussie. Veuillez attendre la validation de l'administrateur.");
		     } catch (Exception e) {
		         return ResponseEntity.status(500).body("Erreur lors de l'inscription : " + e.getMessage());
		     }
		 }

		 	
		 // Méthode pour vérifier l'authentification
		 @PostMapping("/login")
		 public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
		     Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
		     if (optionalUser.isPresent()) {
		         User existingUser = optionalUser.get();
		         if (!existingUser.isEnabled()) {
		             return ResponseEntity.status(403).body(Map.of("message", "Votre compte n'est pas encore validé."));
		         }
		         
		         try {
		             // Déchiffrer le mot de passe stocké
		             String decryptedPassword = AESUtil.decrypt(existingUser.getPassword());

		             if (decryptedPassword.equals(user.getPassword())) {
		                 Map<String, String> response = new HashMap<>();
		                 response.put("message", "Login successful");
		                 response.put("role", existingUser.getRole()); // Inclure le rôle dans la réponse
		                 return ResponseEntity.ok(response);
		             } else {
		                 return ResponseEntity.status(401).body(Map.of("message", "Identifiants incorrects"));
		             }
		         } catch (Exception e) {
		             return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la décryption du mot de passe"));
		         }
		     } else {
		         return ResponseEntity.status(401).body(Map.of("message", "Identifiants incorrects"));
		     }
		 }

		    
		    
		    @GetMapping("/role-by-email")
		    public ResponseEntity<Map<String, String>> getUserRoleByEmail(@RequestParam("email") String email) {
		        Optional<User> optionalUser = userRepository.findByEmail(email);
		        if (optionalUser.isPresent()) {
		            User user = optionalUser.get();
		            Map<String, String> response = new HashMap<>();
		            response.put("role", user.getRole());
		            return ResponseEntity.ok(response);
		        } else {
		            return ResponseEntity.status(404).body(Map.of("message", "Utilisateur non trouvé"));
		        }
		    }

            @PutMapping("/users/{id}")
		    public ResponseEntity<User> updateUser(
		            @PathVariable("id") Long id,  
		            @RequestBody User updatedUserDetails) {

		        // Récupérer l'utilisateur dans la base de données
		        User user = userRepository.findById(id)
		                .orElseThrow(() -> new ResourceNotFoundException("User not found with id :" + id));

		        // Mettre à jour le rôle et l'état de l'utilisateur
		        user.setEnabled(updatedUserDetails.isEnabled());
		        user.setRole(updatedUserDetails.getRole());

		        // Sauvegarder les modifications
		        User updatedUser = userRepository.save(user);

		        // Déchiffrer le mot de passe avant d'envoyer l'email
		        String decryptedPassword;
		        try {
		            decryptedPassword = AESUtil.decrypt(user.getPassword());
		        } catch (Exception e) {
		            return ResponseEntity.status(500).body(null); // Gérer l'erreur si la décryption échoue
		        }

		        // Envoyer l'email de confirmation à l'utilisateur
		        String role = updatedUserDetails.getRole(); // Rôle mis à jour
		        String emailSubject = "Confirmation de rôle";
		        String emailMessage = "Bonjour " + updatedUser.getUserName() +" " + updatedUser.getFirstName() + ",\n\n"
		            + "Votre compte est maintenant actif. Vous êtes un " + role + ".\n"
		            + "Vous pouvez vous connecter avec le mot de passe suivant : " + decryptedPassword + "\n"
		             + "Une fois que vous êtes connectés, changer votre mot de passe " +  ".\n"
		            + "Merci pour votre patience." + "\n"
		            + "\n" + "\n"
		            + "Cordialement," + "\n"
		             + "DSI Intégration Comores.";

		        // Appeler le service d'envoi d'email
		        emailService.sendEmail(updatedUser.getEmail(), emailSubject, emailMessage);

		        return ResponseEntity.ok(updatedUser);
		    }


	    
	    
	 // Nouveau endpoint pour mettre à jour les autres informations de l'utilisateur
	    @PutMapping("/users/{id}/update-info")
	    public ResponseEntity<User> updateUserInfo(
	            @PathVariable("id") Long id,  
	            @RequestBody User updatedUserDetails) {

	        // Récupérer l'utilisateur dans la base de données
	        User user = userRepository.findById(id)
	                .orElseThrow(() -> new ResourceNotFoundException("User not found with id :" + id));

	        // Mettre à jour uniquement les détails sans toucher au rôle et à l'état (enabled)
	        user.setFirstName(updatedUserDetails.getFirstName());
	        user.setUserName(updatedUserDetails.getUserName());
	        user.setEmail(updatedUserDetails.getEmail());
	        user.setPhoneNumber(updatedUserDetails.getPhoneNumber());
	        user.setDepartment(updatedUserDetails.getDepartment());
	        user.setFunction(updatedUserDetails.getFunction());

	        // Sauvegarder les modifications
	        User updatedUser = userRepository.save(user);

	        return ResponseEntity.ok(updatedUser);
	    }
	    
	    @GetMapping("/users/count-disabled")
	    public ResponseEntity<Long> countDisabledUsers() {
	        long disabledUsersCount = userRepository.countByEnabledFalse();
	        return ResponseEntity.ok(disabledUsersCount);
	    }
	    
	    @DeleteMapping("/users/{id}")
	    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable("id") Long id) {
	        User user = userRepository.findById(id)
	                .orElseThrow(() -> new ResourceNotFoundException("User not exist with id:" + id));

	        userRepository.delete(user);

	        Map<String, String> response = new HashMap<>();
	        response.put("message", "Utilisateur supprimé avec succès");
	        return ResponseEntity.ok(response);
	    }
	    
	 // Endpoint pour changer le mot de passe
	    @PutMapping("/change-password")
	    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
	        // Récupérer l'utilisateur en fonction de son email
	        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
	        if (!optionalUser.isPresent()) {
	            System.out.println("Utilisateur non trouvé avec l'email : " + request.getEmail());
	            return ResponseEntity.status(404).body("Utilisateur non trouvé.");
	        }

	        User user = optionalUser.get();

	        // Déchiffrer l'ancien mot de passe pour comparaison
	        String decryptedCurrentPassword;
	        try {
	            decryptedCurrentPassword = AESUtil.decrypt(user.getPassword());
	        } catch (Exception e) {
	            return ResponseEntity.status(500).body("Erreur lors de la décryption du mot de passe.");
	        }

	        // Vérifier que le mot de passe actuel est correct
	        if (!decryptedCurrentPassword.equals(request.getCurrentPassword())) {
	            return ResponseEntity.status(400).body("Mot de passe actuel incorrect.");
	        }

	        // Chiffrer le nouveau mot de passe et l'enregistrer
	        try {
	            String encryptedNewPassword = AESUtil.encrypt(request.getNewPassword());
	            user.setPassword(encryptedNewPassword);
	            userRepository.save(user);
	        } catch (Exception e) {
	            return ResponseEntity.status(500).body("Erreur lors du chiffrement du nouveau mot de passe.");
	        }

	        return ResponseEntity.ok("Mot de passe changé avec succès.");
	    }

	    // Classe pour représenter la requête de changement de mot de passe
	    public static class ChangePasswordRequest {
	        private String email;
	        private String currentPassword;
	        private String newPassword;

	        // Getters et setters
	        public String getEmail() {
	            return email;
	        }

	        public void setEmail(String email) {
	            this.email = email;
	        }

	        public String getCurrentPassword() {
	            return currentPassword;
	        }

	        public void setCurrentPassword(String currentPassword) {
	            this.currentPassword = currentPassword;
	        }

	        public String getNewPassword() {
	            return newPassword;
	        }

	        public void setNewPassword(String newPassword) {
	            this.newPassword = newPassword;
	        }
	    }




}