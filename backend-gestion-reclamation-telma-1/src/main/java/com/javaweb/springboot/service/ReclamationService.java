package com.javaweb.springboot.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javaweb.springboot.model.Reclamation;
import com.javaweb.springboot.repository.ReclamationRepository;

@Service
public class ReclamationService {
	@Autowired
    private ReclamationRepository reclamationRepository;

    public Reclamation createReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    public Optional<Reclamation> getReclamation(Long id) {
        return reclamationRepository.findById(id);
    }

    public void deleteReclamation(Long id) {
        reclamationRepository.deleteById(id);
    }
    public Optional<Reclamation> findById(Long id) {
        return reclamationRepository.findById(id);
    }

    public Reclamation save(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

   

}
