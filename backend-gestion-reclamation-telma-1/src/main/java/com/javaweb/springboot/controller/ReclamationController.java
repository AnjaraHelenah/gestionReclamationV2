package com.javaweb.springboot.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javaweb.springboot.model.Reclamation;
import com.javaweb.springboot.repository.ReclamationRepository;
import com.javaweb.springboot.service.ReclamationService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {
	@Autowired
    private ReclamationRepository reclamationRepository;
	
	@Autowired
    private ReclamationService reclamationService;

    @PostMapping
    public ResponseEntity<Reclamation> createReclamation(@RequestBody Reclamation reclamation) {
        try {
            Reclamation savedReclamation = reclamationRepository.save(reclamation);
            return new ResponseEntity<>(savedReclamation, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
 // Endpoint pour récupérer toutes les réclamations enregistrées
    @GetMapping
    public ResponseEntity<List<Reclamation>> getAllReclamations() {
        try {
            List<Reclamation> reclamations = reclamationRepository.findAll();
            if (reclamations.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(reclamations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
 // Endpoint pour mettre à jour le statut d'une réclamation
    @PatchMapping("/{id}/status")
    public ResponseEntity<Reclamation> updateReclamationStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        Optional<Reclamation> reclamationData = reclamationService.findById(id);

        if (reclamationData.isPresent()) {
            Reclamation reclamation = reclamationData.get();
            reclamation.setStatus(status.get("status"));
            Reclamation updatedReclamation = reclamationService.save(reclamation);
            return ResponseEntity.ok(updatedReclamation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    // Endpoint pour supprimer une réclamation par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteReclamation(@PathVariable Long id) {
        try {
            reclamationRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
