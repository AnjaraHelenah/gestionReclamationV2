package com.javaweb.springboot.service;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javaweb.springboot.model.Api;
import com.javaweb.springboot.repository.ApiRepository;

@Service
public class ApiService {
	@Autowired
    private ApiRepository apiRepository;

    // Méthode pour sauvegarder une entité Api
    public Api saveApi(Api api) {
        return apiRepository.save(api);
    }
    // Méthode pour rechercher une entrée par meterID et transID
    public Optional<Api> findByMeterIDAndTransID(String meterID, String transID) {
        return apiRepository.findByMeterIDAndTransID(meterID, transID);
    }

}
