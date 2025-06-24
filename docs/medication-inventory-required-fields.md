# Medication Inventory Required Fields Guide

## Overview

This document provides information about the required fields in the medication inventory system that cannot be null.

## Required Fields

The following fields in the `medication_inventory` table are required and cannot be null:

1. **Name (medication_name)**: The name of the medication
2. **Form**: The pharmaceutical form (e.g., tablet, liquid, cream)
3. **Dosage**: The strength/dose of the medication (e.g., 500mg, 10mg/ml)
4. **Quantity**: The amount of medication in stock
5. **Expiry (expiry_date)**: The expiration date of the medication

## Implementation Details

These constraints are implemented at both the database and application levels:

1. **Database Level**: 
   - The fields are marked with NOT NULL constraints in the database schema
   - The SQL script `ensure_medication_inventory_constraints.sql` verifies and applies these constraints

2. **Java Entity Level**:
   - The corresponding fields in `MedicationInventory.java` are annotated with `@Column(nullable = false)`
   - This ensures validation at the application level before data is sent to the database

## Optional Fields

The following fields are optional and can be null:

- batch_number
- manufacturer
- storage_location
- unit_cost
- created_by
- updated_by
- updated_at

Note: `created_at` is also required (NOT NULL) but is automatically set by the system.

## Validation

When adding or updating medication inventory data, the system will validate that all required fields are provided. If any required field is missing, the operation will fail with an appropriate error message.
