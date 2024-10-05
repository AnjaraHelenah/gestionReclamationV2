package com.javaweb.springboot.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javaweb.springboot.model.Api;
import com.javaweb.springboot.service.ApiService;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/apis")
public class ApiController {
	
	  @Autowired
	    private ApiService apiService;

	  // Endpoint pour enregistrer une nouvelle entité Api
	    @PostMapping("/save")
	    public ResponseEntity<Api> saveApi(@RequestBody Api api) {
	        try {
	            Api savedApi = apiService.saveApi(api);
	            return new ResponseEntity<>(savedApi, HttpStatus.CREATED);
	        } catch (Exception e) {
	            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    // Endpoint pour vérifier l'existence d'une entrée avec meterID et transID
	    @PostMapping("/check")
	    public ResponseEntity<Map<String, Object>> checkApiEntry(@RequestBody Map<String, String> request) {
	        String meterID = request.get("meterID");
	        String transID = request.get("transID");

	        Optional<Api> apiOptional = apiService.findByMeterIDAndTransID(meterID, transID);

	        Map<String, Object> response = new HashMap<>();
	        if (apiOptional.isPresent()) {
	            Api api = apiOptional.get();
	            response.put("exists", true);
	            response.put("statusReason", api.getStatusReason());
	            response.put("msisdn", api.getMsisdn());
	            response.put("meterID", api.getMeterID());
	            response.put("code", api.getCode());
	            response.put("amount", api.getAmount());
	            response.put("quantity", api.getQuantity());
	        } else {
	            response.put("exists", false);
	        }

	        return new ResponseEntity<>(response, HttpStatus.OK);
	    }
}
