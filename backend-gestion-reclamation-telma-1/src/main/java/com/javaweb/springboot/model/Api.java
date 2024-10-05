package com.javaweb.springboot.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "apis")
public class Api {
	
	
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private long id;
		
		 @Column(name = "status_code")
	    private int statusCode;
		 
		 @Column(name = "status_reason")
	    private String statusReason;
		 
		 @Column(name = "msisdn")
	    private String msisdn;
		 
		 @Column(name = "meter_id")
	    private String meterID;
		 
		 @Column(name = "amount")
	    private double amount;
		 
		 @Column(name = "quantity")
	    private String quantity;
		 
		 @Column(name = "trans_id")
	    private String transID;
		 
		 @Column(name = "date_achat")
	    private LocalDate dateAchat;
		 
		 @Column(name = "code")
	    private String code;

	    // Constructeurs
	    public Api() {
	    }

	    public Api(int statusCode, String statusReason, String msisdn, String meterID, double amount, String quantity, String transID, LocalDate dateAchat, String code) {
	        this.statusCode = statusCode;
	        this.statusReason = statusReason;
	        this.msisdn = msisdn;
	        this.meterID = meterID;
	        this.amount = amount;
	        this.quantity = quantity;
	        this.transID = transID;
	        this.dateAchat = dateAchat;
	        this.code = code;
	    }

		public long getId() {
			return id;
		}

		public void setId(long id) {
			this.id = id;
		}

		public int getStatusCode() {
			return statusCode;
		}

		public void setStatusCode(int statusCode) {
			this.statusCode = statusCode;
		}

		public String getStatusReason() {
			return statusReason;
		}

		public void setStatusReason(String statusReason) {
			this.statusReason = statusReason;
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

		public double getAmount() {
			return amount;
		}

		public void setAmount(double amount) {
			this.amount = amount;
		}

		

		public String getQuantity() {
			return quantity;
		}

		public void setQuantity(String quantity) {
			this.quantity = quantity;
		}

		public String getTransID() {
			return transID;
		}

		public void setTransID(String transID) {
			this.transID = transID;
		}

		public LocalDate getDateAchat() {
			return dateAchat;
		}

		public void setDateAchat(LocalDate dateAchat) {
			this.dateAchat = dateAchat;
		}

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}
	    

}
