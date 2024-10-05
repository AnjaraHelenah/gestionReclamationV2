package com.javaweb.springboot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.javaweb.springboot.model.User;

@Service
public class EmailService {
	@Autowired
    private JavaMailSender mailSender;

	public void sendValidationEmail(User user) {
	    try {
	        SimpleMailMessage message = new SimpleMailMessage();
	        message.setTo("raholiarivonyanjara@gmail.com"); // Email de l'administrateur
	        message.setSubject("Validation du compte utilisateur");
	        message.setText("L'utilisateur " + user.getUserName() + " " +user.getFirstName() + " a créé un compte. Veuillez le valider.");
	        mailSender.send(message);
	    } catch (Exception e) {
	        // Log l'erreur pour diagnostiquer
	        System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
	    }
	}
	
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendConfirmationEmail(User user) {
        String subject = "Validation requise pour votre compte";
        String body = "Bonjour " + user.getFirstName() + ",\n\n"
                + "Votre compte a été créé, mais il doit être validé par un administrateur avant que vous puissiez l'utiliser.\n"
                + "Nous vous informerons une fois que votre compte aura été validé.";
        sendEmail(user.getEmail(), subject, body);
    }

}

