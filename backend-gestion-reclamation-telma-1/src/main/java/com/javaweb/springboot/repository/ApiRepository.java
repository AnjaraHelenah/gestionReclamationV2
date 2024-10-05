package com.javaweb.springboot.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaweb.springboot.model.Api;

@Repository
public interface ApiRepository extends JpaRepository<Api, Long>{
	 // Méthode pour rechercher une entrée par meterID et transID
    Optional<Api> findByMeterIDAndTransID(String meterID, String transID);

}
