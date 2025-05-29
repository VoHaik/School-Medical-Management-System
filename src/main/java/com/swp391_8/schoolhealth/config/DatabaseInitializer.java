package com.swp391_8.schoolhealth.config;

import com.swp391_8.schoolhealth.model.*;
import com.swp391_8.schoolhealth.model.Role.ERole;
import com.swp391_8.schoolhealth.model.User.UserRole;
import com.swp391_8.schoolhealth.model.Medication.MedicationStatus;
import com.swp391_8.schoolhealth.model.MedicalEvent.EventType;
import com.swp391_8.schoolhealth.model.Vaccination.ConsentStatus;
import com.swp391_8.schoolhealth.repository.MedicationRepository;
import com.swp391_8.schoolhealth.repository.RoleRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        Arrays.stream(ERole.values())
              .filter(role -> role != ERole.ROLE_STUDENT) // Skip ROLE_STUDENT due to database constraint
              .forEach(role -> {
                  if (roleRepository.findByName(role).isEmpty()) {
                      Role newRole = new Role();
                      newRole.setName(role);
                      roleRepository.save(newRole);
                      System.out.println("Created role: " + role);
                  }
              });

        // Skip data initialization as per requirement
        System.out.println("Skipping sample data initialization as per requirement");
        return;

        // The following code is kept for reference but will not be executed
        /*
        // Check if users already exist
        if (userRepository.count() > 0) {
            System.out.println("Users already exist, skipping data initialization");
            return;
        }

        // Initialize sample data
        initializeUsers();
        initializeStudents();
        initializeHealthProfiles();
        initializeMedications();
        initializeMedicalEvents();
        initializeMedicalSupplies();
        initializeVaccinations();
        */
    }

    private void initializeUsers() {
        System.out.println("Initializing users...");

        // Create 10 parents
        for (int i = 1; i <= 10; i++) {
            User parent = new User();
            parent.setUsername("parent" + i);
            parent.setPassword(passwordEncoder.encode("bcrypt_hash_" + i));
            parent.setEmail("parent" + i + "@example.com");
            parent.setFullName("Parent " + i);
            parent.setRole(UserRole.Parent);
            parent.setIsActive(true);
            userRepository.save(parent);
        }

        // Create 2 nurses
        for (int i = 1; i <= 2; i++) {
            User nurse = new User();
            nurse.setUsername("nurse" + i);
            nurse.setPassword(passwordEncoder.encode("bcrypt_hash_n" + i));
            nurse.setEmail("nurse" + i + "@example.com");
            nurse.setFullName("Nurse " + i);
            nurse.setRole(UserRole.SchoolNurse);
            nurse.setIsActive(true);
            userRepository.save(nurse);
        }

        // Create 1 admin
        User admin = new User();
        admin.setUsername("admin1");
        admin.setPassword(passwordEncoder.encode("bcrypt_hash_a1"));
        admin.setEmail("admin1@example.com");
        admin.setFullName("Admin System");
        admin.setRole(UserRole.Admin);
        admin.setIsActive(true);
        userRepository.save(admin);

        System.out.println("Users initialized successfully");
    }

    private void initializeStudents() {
        System.out.println("Initializing students...");

        List<User> parents = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.Parent)
                .toList();

        String[] classNames = {"5A", "6B", "4C", "5B", "6A", "4A", "5C", "6C", "4B", "5A"};
        String[] fullNames = {
            "Nguyen Van An", "Tran Thi Binh", "Le Van Cuong", "Pham Thi Dung", "Hoang Van Em",
            "Bui Thi Phuong", "Vu Van Giang", "Do Thi Hoa", "Ngo Van Ich", "Ly Thi Kim"
        };
        String[] birthDates = {
            "2015-03-15", "2014-07-22", "2016-01-10", "2015-09-05", "2014-12-30",
            "2016-04-18", "2015-06-25", "2014-11-11", "2016-02-28", "2015-08-14"
        };

        for (int i = 0; i < 10; i++) {
            Student student = new Student();
            student.setFullName(fullNames[i]);
            student.setDateOfBirth(LocalDate.parse(birthDates[i]));
            student.setParent(parents.get(i));
            student.setClassName(classNames[i]);
            studentRepository.save(student);
        }

        System.out.println("Students initialized successfully");
    }

    private void initializeHealthProfiles() {
        System.out.println("Initializing health profiles...");

        List<Student> students = studentRepository.findAll();
        List<User> users = userRepository.findAll();

        String[][] healthData = {
            {"Dị ứng đậu phộng", null, "Khám định kỳ 2024", "Bình thường", "Bình thường", "Tiêm ngừa sởi 2023"},
            {null, "Hen suyễn", "Dùng thuốc xịt 2024", "Cận thị 1 độ", "Bình thường", "Tiêm ngừa cúm 2024"},
            {"Dị ứng hải sản", null, null, "Bình thường", "Bình thường", "Tiêm ngừa viêm gan B 2023"},
            {null, null, "Khám nha khoa 2024", "Bình thường", "Bình thường", "Tiêm ngừa uốn ván 2023"},
            {"Dị ứng bụi", null, null, "Viễn thị 0.5 độ", "Bình thường", "Tiêm ngừa sởi 2024"},
            {null, null, null, "Bình thường", "Bình thường", "Tiêm ngừa cúm 2024"},
            {null, null, "Khám mắt 2024", "Bình thường", "Bình thường", "Tiêm ngừa viêm gan B 2023"},
            {"Dị ứng sữa", null, null, "Cận thị 1.5 độ", "Bình thường", "Tiêm ngừa sởi 2023"},
            {null, "Viêm mũi dị ứng", "Dùng thuốc nhỏ mũi 2024", "Bình thường", "Bình thường", "Tiêm ngừa cúm 2024"},
            {null, null, null, "Bình thường", "Bình thường", "Tiêm ngừa uốn ván 2024"}
        };

        for (int i = 0; i < students.size(); i++) {
            HealthProfile profile = new HealthProfile();
            profile.setStudent(students.get(i));
            profile.setAllergies(healthData[i][0]);
            profile.setChronicConditions(healthData[i][1]);
            profile.setTreatmentHistory(healthData[i][2]);
            profile.setVision(healthData[i][3]);
            profile.setHearing(healthData[i][4]);
            profile.setVaccinationHistory(healthData[i][5]);
            profile.setUpdatedBy(users.get(i)); // Using parent as updater
            entityManager.persist(profile);
        }

        System.out.println("Health profiles initialized successfully");
    }

    private void initializeMedications() {
        System.out.println("Initializing medications...");

        List<Student> students = studentRepository.findAll();
        List<User> parents = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.Parent)
                .toList();
        List<User> nurses = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.SchoolNurse)
                .toList();

        // Medication data: student index, name, dosage, instructions, status, nurse index (0 or 1), administered date
        Object[][] medicationData = {
            {0, "Paracetamol", "500mg", "Uống sau ăn khi sốt", MedicationStatus.Approved, 0, "2025-05-20 10:00:00"},
            {1, "Ventolin", "2 lần xịt", "Xịt khi khó thở", MedicationStatus.Approved, 0, "2025-05-21 14:00:00"},
            {2, "Antihistamine", "10mg", "Uống khi dị ứng", MedicationStatus.Pending, null, null},
            {4, "Eye drops", "2 giọt/mắt", "Nhỏ mắt 2 lần/ngày", MedicationStatus.Approved, 1, "2025-05-22 09:00:00"},
            {7, "Loratadine", "10mg", "Uống khi dị ứng sữa", MedicationStatus.Approved, 1, "2025-05-23 11:00:00"}
        };

        for (Object[] data : medicationData) {
            Medication medication = new Medication();
            medication.setStudent(students.get((int)data[0]));
            medication.setMedicationName((String)data[1]);
            medication.setDosage((String)data[2]);
            medication.setInstructions((String)data[3]);
            medication.setSubmittedBy(parents.get((int)data[0]));
            medication.setStatus((MedicationStatus)data[4]);

            if (data[5] != null) {
                medication.setAdministeredBy(nurses.get((int)data[5]));
                medication.setAdministeredAt(LocalDateTime.parse((String)data[6], java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }

            medicationRepository.save(medication);
        }

        System.out.println("Medications initialized successfully");
    }

    private void initializeMedicalEvents() {
        System.out.println("Initializing medical events...");

        List<Student> students = studentRepository.findAll();
        List<User> nurses = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.SchoolNurse)
                .toList();

        // Event data: student index, event type, description, event date, nurse index (0 or 1)
        Object[][] eventData = {
            {0, EventType.Fever, "Sốt 38.5°C, đã cho uống Paracetamol", "2025-05-20 09:00:00", 0},
            {1, EventType.Accident, "Trầy xước đầu gối do té", "2025-05-21 13:00:00", 0},
            {2, EventType.Fever, "Sốt nhẹ 37.8°C, theo dõi thêm", "2025-05-22 10:00:00", 1},
            {4, EventType.Fall, "Té ngã trong giờ thể dục", "2025-05-23 15:00:00", 1},
            {7, EventType.Epidemic, "Nghi ngờ cúm, cách ly tạm thời", "2025-05-24 08:00:00", 0},
            {9, EventType.Other, "Đau bụng, nghỉ học 1 ngày", "2025-05-25 07:00:00", 1}
        };

        for (Object[] data : eventData) {
            MedicalEvent event = new MedicalEvent();
            event.setStudent(students.get((int)data[0]));
            event.setEventType((EventType)data[1]);
            event.setDescription((String)data[2]);
            event.setEventDate(LocalDateTime.parse((String)data[3], java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            event.setHandledBy(nurses.get((int)data[4]));
            entityManager.persist(event);
        }

        System.out.println("Medical events initialized successfully");
    }

    private void initializeMedicalSupplies() {
        System.out.println("Initializing medical supplies...");

        // Get all medical events
        List<MedicalEvent> events = entityManager.createQuery("SELECT e FROM MedicalEvent e", MedicalEvent.class).getResultList();
        List<User> nurses = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.SchoolNurse)
                .toList();

        // Supply data: event index, name, quantity, unit, nurse index
        Object[][] supplyData = {
            {0, "Paracetamol", 1, "tablet", 0},
            {1, "Bandage", 2, "piece", 0},
            {2, "Thermometer", 1, "unit", 1},
            {3, "Antiseptic", 10, "ml", 1},
            {4, "Mask", 1, "piece", 0},
            {5, "Antacid", 2, "tablet", 1}
        };

        for (int i = 0; i < supplyData.length; i++) {
            Object[] data = supplyData[i];
            MedicalSupply supply = new MedicalSupply();
            supply.setEvent(events.get((int)data[0]));
            supply.setName((String)data[1]);
            supply.setQuantityUsed((Integer)data[2]);
            supply.setUnit((String)data[3]);
            supply.setUpdatedBy(nurses.get((int)data[4]));
            entityManager.persist(supply);
        }

        System.out.println("Medical supplies initialized successfully");
    }

    private void initializeVaccinations() {
        System.out.println("Initializing vaccinations...");

        List<Student> students = studentRepository.findAll();
        List<User> parents = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.Parent)
                .toList();
        List<User> nurses = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.SchoolNurse)
                .toList();

        // Vaccination data: student index, vaccine name, date, consent status, parent index, result, follow-up date, nurse index
        Object[][] vaccinationData = {
            {0, "Cúm", "2025-05-10", ConsentStatus.Approved, 0, "Thành công", "2025-05-17", 0},
            {1, "Sởi", "2025-05-10", ConsentStatus.Approved, 1, "Thành công", "2025-05-17", 0},
            {2, "Viêm gan B", "2025-05-10", ConsentStatus.Pending, null, null, null, null},
            {3, "Cúm", "2025-05-10", ConsentStatus.Approved, 3, "Thành công", "2025-05-17", 1},
            {4, "Uốn ván", "2025-05-10", ConsentStatus.Approved, 4, "Thành công", "2025-05-17", 1},
            {5, "Cúm", "2025-05-10", ConsentStatus.Approved, 5, "Thành công", "2025-05-17", 0}
        };

        for (Object[] data : vaccinationData) {
            Vaccination vaccination = new Vaccination();
            vaccination.setStudent(students.get((int)data[0]));
            vaccination.setVaccineName((String)data[1]);
            vaccination.setVaccinationDate(LocalDate.parse((String)data[2]));
            vaccination.setConsentStatus((ConsentStatus)data[3]);

            if (data[4] != null) {
                vaccination.setConsentBy(parents.get((int)data[4]));
            }

            vaccination.setResult((String)data[5]);

            if (data[6] != null) {
                vaccination.setFollowUpDate(LocalDate.parse((String)data[6]));
            }

            if (data[7] != null) {
                vaccination.setAdministeredBy(nurses.get((int)data[7]));
            }

            entityManager.persist(vaccination);
        }

        System.out.println("Vaccinations initialized successfully");
    }
}
