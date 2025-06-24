package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicalEventDTO;
import com.swp391_8.schoolhealth.model.MedicalEvent;
import com.swp391_8.schoolhealth.model.MedicationInventory;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.MedicalEventRepository;
import com.swp391_8.schoolhealth.repository.MedicationInventoryRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.exception.InvalidOperationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Deprecated
public class MedicalEventService {

    @Autowired
    private MedicalEventRepository medicalEventRepository;

    @Autowired
    private StudentRepository studentRepository;    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MedicationInventoryRepository medicationInventoryRepository;

    public List<MedicalEventDTO> getAllMedicalEvents(String studentCode, LocalDate startDate, LocalDate endDate, String severity, String eventTypeName, String status) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        if (startDate != null) {
            startDateTime = startDate.atStartOfDay();
        }
        if (endDate != null) {
            endDateTime = endDate.atTime(23, 59, 59); // End of the day
        }
        // Corrected repository method name and passed status
        return medicalEventRepository.findMedicalEventsByCriteria(studentCode, startDateTime, endDateTime, severity, eventTypeName, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicalEventDTO> getMedicalEventsByStudentStudentCode(String studentCode) {
        return medicalEventRepository.findByStudent_StudentCode(studentCode).stream() // Corrected repository method name
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }    @Transactional
    public MedicalEventDTO createMedicalEvent(MedicalEventDTO medicalEventDTO, String creatorUsername) {
        Student student = studentRepository.findByStudentCode(medicalEventDTO.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + medicalEventDTO.getStudentCode()));
        User recordedByUser = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + creatorUsername));

        // Kiểm tra và cập nhật số lượng thuốc nếu có thuốc được sử dụng
        if (medicalEventDTO.getMedicationGiven() != null && !medicalEventDTO.getMedicationGiven().isEmpty()) {
            // Tìm thuốc trong kho
            MedicationInventory medication = medicationInventoryRepository.findByMedicationNameIgnoreCase(medicalEventDTO.getMedicationGiven());
            if (medication == null) {
                throw new ResourceNotFoundException("Không tìm thấy thuốc: " + medicalEventDTO.getMedicationGiven());
            }
            
            int requestedQuantity = medicalEventDTO.getMedicationQuantity() != null ? medicalEventDTO.getMedicationQuantity() : 1;
            if (medication.getQuantity() < requestedQuantity) {
                throw new InvalidOperationException("Không đủ thuốc trong kho. Hiện chỉ còn " + medication.getQuantity() + " " + medication.getForm());
            }
            
            // Cập nhật số lượng thuốc trong kho
            medication.setQuantity(medication.getQuantity() - requestedQuantity);
            medicationInventoryRepository.save(medication);
        }

        MedicalEvent medicalEvent = new MedicalEvent();
        medicalEvent.setStudent(student);
        medicalEvent.setEventType(medicalEventDTO.getEventType());
        medicalEvent.setDescription(medicalEventDTO.getDescription());
        medicalEvent.setEventDatetime(medicalEventDTO.getEventDatetime() != null ? medicalEventDTO.getEventDatetime() : LocalDateTime.now());
        medicalEvent.setRecordedBy(recordedByUser);        medicalEvent.setSymptoms(medicalEventDTO.getSymptoms());
        medicalEvent.setSeverity(medicalEventDTO.getSeverity());
        medicalEvent.setActionTaken(medicalEventDTO.getActionTaken());
        medicalEvent.setMedicationGiven(medicalEventDTO.getMedicationGiven());
        medicalEvent.setMedicationQuantity(medicalEventDTO.getMedicationQuantity());
        medicalEvent.setStatus(medicalEventDTO.getStatus());
        // createdAt is handled by @PrePersist

        MedicalEvent savedEvent = medicalEventRepository.save(medicalEvent);
        return convertToDTO(savedEvent);
    }    @Transactional
    public MedicalEventDTO updateMedicalEvent(Integer eventId, MedicalEventDTO medicalEventDTO, String updaterUsername) {
        MedicalEvent existingEvent = medicalEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalEvent not found with id: " + eventId));
        User recordedByUser = userRepository.findByUsername(updaterUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + updaterUsername));

        // Kiểm tra nếu có thay đổi thuốc hoặc số lượng
        String oldMedication = existingEvent.getMedicationGiven();
        Integer oldQuantity = existingEvent.getMedicationQuantity() != null ? existingEvent.getMedicationQuantity() : 0;
        
        String newMedication = medicalEventDTO.getMedicationGiven();
        Integer newQuantity = medicalEventDTO.getMedicationQuantity() != null ? medicalEventDTO.getMedicationQuantity() : 0;
        
        // Nếu thuốc thay đổi, hoàn trả thuốc cũ vào kho và giảm thuốc mới
        if (oldMedication != null && !oldMedication.isEmpty()) {
            if (!oldMedication.equals(newMedication) || !oldQuantity.equals(newQuantity)) {
                // Hoàn trả thuốc cũ vào kho
                MedicationInventory oldMed = medicationInventoryRepository.findByMedicationNameIgnoreCase(oldMedication);
                if (oldMed != null) {
                    oldMed.setQuantity(oldMed.getQuantity() + oldQuantity);
                    medicationInventoryRepository.save(oldMed);
                }
                
                // Giảm thuốc mới từ kho nếu có
                if (newMedication != null && !newMedication.isEmpty()) {
                    MedicationInventory newMed = medicationInventoryRepository.findByMedicationNameIgnoreCase(newMedication);
                    if (newMed == null) {
                        throw new ResourceNotFoundException("Không tìm thấy thuốc: " + newMedication);
                    }
                    
                    if (newMed.getQuantity() < newQuantity) {
                        throw new InvalidOperationException("Không đủ thuốc trong kho. Hiện chỉ còn " + newMed.getQuantity() + " " + newMed.getForm());
                    }
                    
                    newMed.setQuantity(newMed.getQuantity() - newQuantity);
                    medicationInventoryRepository.save(newMed);
                }
            }
        } else if (newMedication != null && !newMedication.isEmpty()) {
            // Nếu trước đó không có thuốc, chỉ cần trừ thuốc mới
            MedicationInventory newMed = medicationInventoryRepository.findByMedicationNameIgnoreCase(newMedication);
            if (newMed == null) {
                throw new ResourceNotFoundException("Không tìm thấy thuốc: " + newMedication);
            }
            
            if (newMed.getQuantity() < newQuantity) {
                throw new InvalidOperationException("Không đủ thuốc trong kho. Hiện chỉ còn " + newMed.getQuantity() + " " + newMed.getForm());
            }
            
            newMed.setQuantity(newMed.getQuantity() - newQuantity);
            medicationInventoryRepository.save(newMed);
        }
        
        if (medicalEventDTO.getStudentCode() != null && !medicalEventDTO.getStudentCode().equals(existingEvent.getStudent().getStudentCode())) {
            Student student = studentRepository.findByStudentCode(medicalEventDTO.getStudentCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + medicalEventDTO.getStudentCode()));
            existingEvent.setStudent(student);
        }

        if (medicalEventDTO.getEventType() != null) {
            existingEvent.setEventType(medicalEventDTO.getEventType());
        }
        existingEvent.setDescription(medicalEventDTO.getDescription());
        existingEvent.setEventDatetime(medicalEventDTO.getEventDatetime() != null ? medicalEventDTO.getEventDatetime() : existingEvent.getEventDatetime());
        existingEvent.setRecordedBy(recordedByUser); // Update who last modified/recorded it        existingEvent.setSymptoms(medicalEventDTO.getSymptoms());
        existingEvent.setSeverity(medicalEventDTO.getSeverity());
        existingEvent.setActionTaken(medicalEventDTO.getActionTaken());
        existingEvent.setMedicationGiven(medicalEventDTO.getMedicationGiven());
        existingEvent.setMedicationQuantity(medicalEventDTO.getMedicationQuantity());
        existingEvent.setStatus(medicalEventDTO.getStatus());

        MedicalEvent updatedEvent = medicalEventRepository.save(existingEvent);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public void deleteMedicalEvent(Integer eventId) {
        if (!medicalEventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("MedicalEvent not found with id: " + eventId);
        }
        medicalEventRepository.deleteById(eventId);
    }    /**
     * Xử lý cập nhật số lượng thuốc trong kho khi tạo hoặc cập nhật sự kiện y tế
     * 
     * @param medicationName - Tên thuốc cần cập nhật số lượng
     * @param quantity - Số lượng thuốc đã sử dụng (số âm để trừ khỏi kho)
     * @throws IllegalStateException nếu không đủ thuốc trong kho
     */
    @Transactional
    private void updateMedicationInventory(String medicationName, int quantity) {
        // Nếu không có thuốc hoặc số lượng bằng 0, không cần làm gì
        if (medicationName == null || medicationName.isEmpty() || quantity <= 0) {
            return;
        }
        
        // Tìm thuốc trong kho
        MedicationInventory medication = medicationInventoryRepository.findByMedicationNameIgnoreCase(medicationName);
        if (medication == null) {
            throw new ResourceNotFoundException("Không tìm thấy thuốc: " + medicationName);
        }
        
        // Kiểm tra số lượng
        int newQuantity = medication.getQuantity() - quantity;
        if (newQuantity < 0) {
            throw new IllegalStateException("Không đủ thuốc trong kho. Chỉ còn " + medication.getQuantity() + " " + 
                                          medication.getForm() + " " + medicationName);
        }
        
        // Cập nhật số lượng
        medication.setQuantity(newQuantity);
        medicationInventoryRepository.save(medication);
    }

    private MedicalEventDTO convertToDTO(MedicalEvent event) {
        if (event == null) return null;
        MedicalEventDTO dto = new MedicalEventDTO();
        dto.setId(event.getId()); // Corrected: Use getId() from MedicalEvent and setId() for MedicalEventDTO
        if (event.getStudent() != null) {
            dto.setStudentCode(event.getStudent().getStudentCode());
            // Assuming StudentDTO or direct student name access is handled elsewhere or not needed here
            // dto.setStudentName(event.getStudent().getFullName()); // If Student has getFullName()
        }
        // Just set the event type directly as a string
        dto.setEventType(event.getEventType());
        dto.setDescription(event.getDescription());
        dto.setEventDatetime(event.getEventDatetime());
        if (event.getRecordedBy() != null) {
            dto.setHandledByUsername(event.getRecordedBy().getUsername()); // Corrected: setHandledByUsername
        }
        dto.setSymptoms(event.getSymptoms());
        dto.setSeverity(event.getSeverity());
        dto.setActionTaken(event.getActionTaken());        dto.setMedicationGiven(event.getMedicationGiven());
        dto.setMedicationQuantity(event.getMedicationQuantity());
        dto.setStatus(event.getStatus());
        // dto.setCreatedAt(event.getCreatedAt()); // MedicalEventDTO does not have createdAt
        return dto;
    }
}
