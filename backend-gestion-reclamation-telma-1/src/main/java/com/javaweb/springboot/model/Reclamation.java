package com.javaweb.springboot.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "reclamations")
public class Reclamation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "type_reclamation")
    private String typeReclamation;

    @Column(name = "date_reclamation")
    private LocalDate dateReclamation;

    @Column(name = "name_customer")
    private String nameCustomer;

    @Column(name = "first_name_customer")
    private String firstNameCustomer;

    @Column(name = "msisdn")
    private String msisdn;

    @Column(name = "meter_id")
    private String meterID;

    @Column(name = "trans_id")
    private String transID;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "date_achat")
    private LocalDate dateAchat;

    @Column(name = "quantity")
    private Integer quantity;  // Nouvel attribut pour la quantité

    @Column(name = "code")
    private String code;  // Nouvel attribut pour le code
    
    @Column(name = "status")
    private boolean status = false;  // Nouvel attribut pour le statut, initialisé à false

    // Constructeur par défaut
    public Reclamation() {
    }

    // Constructeur avec tous les attributs sauf l'ID
    public Reclamation(String typeReclamation, LocalDate dateReclamation, String nameCustomer, 
                       String firstNameCustomer, String msisdn, String meterID, 
                       String transID, Double amount, LocalDate dateAchat, Integer quantity, String code) {
        this.typeReclamation = typeReclamation;
        this.dateReclamation = dateReclamation;
        this.nameCustomer = nameCustomer;
        this.firstNameCustomer = firstNameCustomer;
        this.msisdn = msisdn;
        this.meterID = meterID;
        this.transID = transID;
        this.amount = amount;
        this.dateAchat = dateAchat;
        this.quantity = quantity;
        this.code = code;
        this.status = false;  // Initialisation à "non traité" par défaut
   
    }

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTypeReclamation() {
		return typeReclamation;
	}

	public void setTypeReclamation(String typeReclamation) {
		this.typeReclamation = typeReclamation;
	}

	public LocalDate getDateReclamation() {
		return dateReclamation;
	}

	public void setDateReclamation(LocalDate dateReclamation) {
		this.dateReclamation = dateReclamation;
	}

	public String getNameCustomer() {
		return nameCustomer;
	}

	public void setNameCustomer(String nameCustomer) {
		this.nameCustomer = nameCustomer;
	}

	public String getFirstNameCustomer() {
		return firstNameCustomer;
	}

	public void setFirstNameCustomer(String firstNameCustomer) {
		this.firstNameCustomer = firstNameCustomer;
	}

	public String getMsisdn() {
		return msisdn;
	}

	public void setMsisdn(String msisdn) {
		this.msisdn = msisdn;
	}

	public String getMeterID() {
		return meterID;
	}

	public void setMeterID(String meterID) {
		this.meterID = meterID;
	}

	public String getTransID() {
		return transID;
	}

	public void setTransID(String transID) {
		this.transID = transID;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public LocalDate getDateAchat() {
		return dateAchat;
	}

	public void setDateAchat(LocalDate dateAchat) {
		this.dateAchat = dateAchat;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	


}
