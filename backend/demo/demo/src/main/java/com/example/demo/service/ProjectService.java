package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.StudentAnalyticsDTO;

import com.example.demo.entity.CertificateDocument;
import com.example.demo.entity.DeadlineRule;
import com.example.demo.entity.NotificationDocument;
import com.example.demo.entity.ProjectDocument;
import com.example.demo.entity.Student;
import com.example.demo.entity.User;

import com.example.demo.repository.CertificateMongoRepository;
import com.example.demo.repository.DeadlineRuleRepository;
import com.example.demo.repository.NotificationMongoRepository;
import com.example.demo.repository.ProjectMongoRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.UserRepository;

@Service
public class ProjectService {

    @Autowired
    private DeadlineRuleRepository deadlineRuleRepository;

    @Autowired
    private ProjectMongoRepository projectMongoRepository;

    @Autowired
    private NotificationMongoRepository notificationMongoRepository;

    @Autowired
    private CertificateMongoRepository certificateMongoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    // =====================================
    // MONGODB PROJECT APIs
    // =====================================

    public ProjectDocument createMongoProject(ProjectDocument project) {

        if (project.getStatus() == null || project.getStatus().isEmpty()) {
            project.setStatus("PENDING");
        }

        if (project.getSubmittedDate() == null || project.getSubmittedDate().isEmpty()) {
            project.setSubmittedDate(LocalDate.now().toString());
        }
        project.setUpdatedDate(LocalDate.now().toString());

        if (project.getVersion() == 0) {
            project.setVersion(1);
        }

        // Enrich with student department if not provided
        if ((project.getDepartment() == null || project.getDepartment().isEmpty()) && project.getStudentId() != null) {
            Optional<Student> student = studentRepository.findByUserId(project.getStudentId());
            student.ifPresent(s -> project.setDepartment(s.getDepartment()));
        }

        return projectMongoRepository.save(project);
    }

    public List<ProjectDocument> getMongoProjectsByStudent(Long studentId) {
        return projectMongoRepository.findByStudentId(studentId);
    }

    public List<ProjectDocument> getMongoFacultyProjects(Long facultyId) {
        List<ProjectDocument> projects = projectMongoRepository.findByFacultyId(facultyId);
        // Enrich department for older projects that don't have it
        for (ProjectDocument p : projects) {
            if ((p.getDepartment() == null || p.getDepartment().isEmpty()) && p.getStudentId() != null) {
                Optional<Student> student = studentRepository.findByUserId(p.getStudentId());
                student.ifPresent(s -> p.setDepartment(s.getDepartment()));
            }
        }
        return projects;
    }

    public List<ProjectDocument> getAllProjects() {
        return projectMongoRepository.findAll();
    }

    public ProjectDocument getMongoProjectById(String id) {
        return projectMongoRepository.findById(id).orElseThrow();
    }

    public ProjectDocument reviewMongoProject(
            String id,
            String status,
            String feedback,
            String grade) {

        ProjectDocument project = projectMongoRepository.findById(id).orElseThrow();

        project.setStatus(status);
        project.setFeedback(feedback);
        project.setGrade(grade);
        project.setUpdatedDate(LocalDate.now().toString());

        ProjectDocument saved = projectMongoRepository.save(project);

        // Send notification to student
        if (project.getStudentId() != null) {
            NotificationDocument notification = new NotificationDocument();
            notification.setUserId(project.getStudentId());
            notification.setRole("STUDENT");
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());

            if ("APPROVED".equalsIgnoreCase(status)) {
                notification.setTitle("Project Approved");
                notification.setMessage("Your project '" + project.getTitle() + "' has been approved." + (grade != null ? " Grade: " + grade : ""));
                notification.setType("success");
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                notification.setTitle("Project Rejected");
                notification.setMessage("Your project '" + project.getTitle() + "' was rejected." + (feedback != null ? " Reason: " + feedback : ""));
                notification.setType("danger");
            } else {
                notification.setTitle("Faculty Feedback Received");
                notification.setMessage("Faculty left feedback on '" + project.getTitle() + "'." + (feedback != null ? " " + feedback : ""));
                notification.setType("info");
            }
            notificationMongoRepository.save(notification);
        }

        return saved;
    }

    public ProjectDocument updateMongoProject(
            String id,
            ProjectDocument updatedProject) {

        ProjectDocument project = projectMongoRepository.findById(id).orElseThrow();

        project.setTitle(updatedProject.getTitle());
        project.setAbstractText(updatedProject.getAbstractText());
        project.setTechnology(updatedProject.getTechnology());
        project.setSubject(updatedProject.getSubject());
        project.setGithubUrl(updatedProject.getGithubUrl());
        project.setFileName(updatedProject.getFileName());
        project.setFileURL(updatedProject.getFileURL());
        project.setFacultyId(updatedProject.getFacultyId());
        project.setFacultyName(updatedProject.getFacultyName());
        if ("PENDING".equalsIgnoreCase(updatedProject.getStatus())
                && ("REJECTED".equalsIgnoreCase(project.getStatus()) || "RESUBMITTED".equalsIgnoreCase(project.getStatus()))) {
            project.setFeedback(null);
            project.setGrade(null);
            project.setVersion(project.getVersion() + 1);
            project.setSubmittedDate(LocalDate.now().toString());
        } else if (project.getSubmittedDate() == null || project.getSubmittedDate().isEmpty()) {
            project.setSubmittedDate(LocalDate.now().toString());
        }
        if (updatedProject.getStatus() != null && !updatedProject.getStatus().isEmpty()) {
            project.setStatus(updatedProject.getStatus());
        }
        project.setUpdatedDate(LocalDate.now().toString());

        return projectMongoRepository.save(project);
    }

    public ProjectDocument resubmitProject(String id) {

        ProjectDocument project = projectMongoRepository.findById(id).orElseThrow();

        project.setStatus("PENDING");
        project.setFeedback(null);
        project.setGrade(null);
        project.setVersion(project.getVersion() + 1);
        project.setSubmittedDate(LocalDate.now().toString());
        project.setUpdatedDate(LocalDate.now().toString());

        return projectMongoRepository.save(project);
    }

    public void deleteMongoProject(String id) {
        projectMongoRepository.deleteById(id);
    }

    // =====================================
    // MONGODB CERTIFICATES
    // =====================================

    public CertificateDocument createMongoCertificate(CertificateDocument certificate) {

        if (certificate.getStatus() == null || certificate.getStatus().isEmpty()) {
            certificate.setStatus("PENDING");
        }
        if (certificate.getSubmittedDate() == null || certificate.getSubmittedDate().isEmpty()) {
            certificate.setSubmittedDate(LocalDate.now().toString());
        }
        if (certificate.getUploadDate() == null || certificate.getUploadDate().isEmpty()) {
            certificate.setUploadDate(LocalDate.now().toString());
        }
        certificate.setUpdatedDate(LocalDate.now().toString());

        // Enrich department from student profile
        if ((certificate.getDepartment() == null || certificate.getDepartment().isEmpty()) && certificate.getStudentId() != null) {
            Optional<Student> student = studentRepository.findByUserId(certificate.getStudentId().longValue());
            student.ifPresent(s -> certificate.setDepartment(s.getDepartment()));
        }

        return certificateMongoRepository.save(certificate);
    }

    public List<CertificateDocument> getAllCertificates() {
        return certificateMongoRepository.findAll();
    }

    public List<CertificateDocument> getCertificatesByStudent(Long studentId) {
        return certificateMongoRepository.findByStudentId(studentId);
    }

    public List<CertificateDocument> getCertificatesByFaculty(Integer facultyId) {
        List<CertificateDocument> certs = certificateMongoRepository.findByFacultyId(facultyId);
        // Enrich department for older certificates that don't have it
        for (CertificateDocument c : certs) {
            if ((c.getDepartment() == null || c.getDepartment().isEmpty()) && c.getStudentId() != null) {
                Optional<Student> student = studentRepository.findByUserId(c.getStudentId().longValue());
                student.ifPresent(s -> c.setDepartment(s.getDepartment()));
            }
        }
        return certs;
    }

    public CertificateDocument verifyCertificate(
            String id,
            String status,
            String remarks) {

        CertificateDocument certificate = certificateMongoRepository.findById(id).orElseThrow();

        certificate.setStatus(status);
        certificate.setRemarks(remarks);
        certificate.setUpdatedDate(LocalDate.now().toString());

        CertificateDocument saved = certificateMongoRepository.save(certificate);

        // Send notification to student
        if (certificate.getStudentId() != null) {
            NotificationDocument notification = new NotificationDocument();
            notification.setUserId(Long.valueOf(certificate.getStudentId()));
            notification.setRole("STUDENT");
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());

            if ("APPROVED".equalsIgnoreCase(status)) {
                notification.setTitle("Certificate Approved");
                notification.setMessage("Your certificate '" + certificate.getTitle() + "' has been approved.");
                notification.setType("success");
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                notification.setTitle("Certificate Rejected");
                notification.setMessage("'" + certificate.getTitle() + "' was rejected." + (remarks != null ? " Reason: " + remarks : " Please resubmit."));
                notification.setType("danger");
            } else {
                notification.setTitle("Certificate Update");
                notification.setMessage("Your certificate '" + certificate.getTitle() + "' status changed to " + status + ".");
                notification.setType("info");
            }
            notificationMongoRepository.save(notification);
        }

        return saved;
    }

    public CertificateDocument resubmitCertificate(String id) {

        CertificateDocument certificate = certificateMongoRepository.findById(id).orElseThrow();

        certificate.setStatus("RESUBMITTED");
        certificate.setRemarks(null);
        certificate.setVersion(certificate.getVersion() + 1);
        certificate.setSubmittedDate(LocalDate.now().toString());
        certificate.setUpdatedDate(LocalDate.now().toString());

        return certificateMongoRepository.save(certificate);
    }

    public String deleteCertificate(String id) {
        certificateMongoRepository.deleteById(id);
        return "Certificate Deleted";
    }

    public CertificateDocument updateCertificate(String id, CertificateDocument updatedCert) {

        CertificateDocument certificate = certificateMongoRepository.findById(id).orElseThrow();

        certificate.setTitle(updatedCert.getTitle());
        certificate.setOrganization(updatedCert.getOrganization());
        certificate.setCategory(updatedCert.getCategory());
        certificate.setIssueDate(updatedCert.getIssueDate());
        certificate.setFileName(updatedCert.getFileName());
        certificate.setFileURL(updatedCert.getFileURL());
        certificate.setFacultyId(updatedCert.getFacultyId());
        certificate.setFacultyName(updatedCert.getFacultyName());
        if ("PENDING".equalsIgnoreCase(updatedCert.getStatus())
                && ("REJECTED".equalsIgnoreCase(certificate.getStatus()) || "RESUBMITTED".equalsIgnoreCase(certificate.getStatus()))) {
            certificate.setRemarks(null);
            certificate.setVersion(certificate.getVersion() + 1);
            certificate.setSubmittedDate(LocalDate.now().toString());
        } else if (certificate.getSubmittedDate() == null || certificate.getSubmittedDate().isEmpty()) {
            certificate.setSubmittedDate(LocalDate.now().toString());
        }
        if (updatedCert.getUploadDate() != null && !updatedCert.getUploadDate().isEmpty()) {
            certificate.setUploadDate(updatedCert.getUploadDate());
        } else if (certificate.getUploadDate() == null || certificate.getUploadDate().isEmpty()) {
            certificate.setUploadDate(LocalDate.now().toString());
        }
        if (updatedCert.getStatus() != null && !updatedCert.getStatus().isEmpty()) {
            certificate.setStatus(updatedCert.getStatus());
        }
        certificate.setUpdatedDate(LocalDate.now().toString());

        return certificateMongoRepository.save(certificate);
    }

    // =====================================
    // NOTIFICATIONS
    // =====================================

    public NotificationDocument createNotification(NotificationDocument notification) {

        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);

        return notificationMongoRepository.save(notification);
    }

    public List<NotificationDocument> getNotificationsByUser(Long userId) {
        return notificationMongoRepository.findByUserId(userId);
    }

    public NotificationDocument markNotificationAsRead(String id) {

        NotificationDocument notification = notificationMongoRepository.findById(id).orElseThrow();

        notification.setRead(true);

        return notificationMongoRepository.save(notification);
    }

    public String deleteNotification(String id) {
        notificationMongoRepository.deleteById(id);
        return "Notification Deleted";
    }

    // =====================================
    // STUDENT ANALYTICS
    // =====================================

    public StudentAnalyticsDTO getStudentAnalytics(Long studentId) {

        List<ProjectDocument> projects = projectMongoRepository.findByStudentId(studentId);

        StudentAnalyticsDTO dto = new StudentAnalyticsDTO();

        dto.setTotalProjects(projects.size());

        dto.setApprovedProjects(
                projects.stream()
                        .filter(project -> "APPROVED".equalsIgnoreCase(project.getStatus()))
                        .count());

        dto.setPendingProjects(
                projects.stream()
                        .filter(project -> "PENDING".equalsIgnoreCase(project.getStatus()))
                        .count());

        dto.setRejectedProjects(
                projects.stream()
                        .filter(project -> "REJECTED".equalsIgnoreCase(project.getStatus()))
                        .count());

        return dto;
    }

    // =====================================
    // SEARCH & FILTER
    // =====================================

    public List<ProjectDocument> searchProjectsByTitle(String title) {
        return projectMongoRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<ProjectDocument> filterProjectsByStatus(String status) {
        return projectMongoRepository.findByStatus(status);
    }

    public List<ProjectDocument> filterProjectsByTechnology(String technology) {
        return projectMongoRepository.findByTechnologyContainingIgnoreCase(technology);
    }

    public List<ProjectDocument> filterProjects(String status, String technology) {
        return projectMongoRepository.findByStatusAndTechnologyContainingIgnoreCase(status, technology);
    }

    // =====================================
    // OVERALL ANALYTICS
    // =====================================

    public Map<String, Long> getDashboardData() {

        Map<String, Long> dashboard = new HashMap<>();

        long totalProjects = projectMongoRepository.count();

        List<ProjectDocument> allProjects = projectMongoRepository.findAll();

        long approvedProjects = allProjects.stream()
                .filter(project -> "APPROVED".equalsIgnoreCase(project.getStatus()))
                .count();

        long pendingProjects = allProjects.stream()
                .filter(project -> "PENDING".equalsIgnoreCase(project.getStatus()))
                .count();

        long rejectedProjects = allProjects.stream()
                .filter(project -> "REJECTED".equalsIgnoreCase(project.getStatus()))
                .count();

        dashboard.put("totalProjects", totalProjects);
        dashboard.put("approvedProjects", approvedProjects);
        dashboard.put("pendingProjects", pendingProjects);
        dashboard.put("rejectedProjects", rejectedProjects);

        return dashboard;
    }

    // =====================================
    // ADMIN USER MANAGEMENT
    // =====================================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> searchUsers(String name) {
        return userRepository.findByFullNameContainingIgnoreCase(name);
    }

    public List<User> filterUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public User updateUser(Long id, User updatedUser) {

        User user = userRepository.findById(id).orElseThrow();

        user.setFullName(updatedUser.getFullName());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());

        return userRepository.save(user);
    }

    public String deleteUser(Long id) {
        userRepository.deleteById(id);
        return "User Deleted";
    }

    // =====================================
    // DEADLINE RULES
    // =====================================

    public List<DeadlineRule> getAllDeadlineRules() {
        return deadlineRuleRepository.findAll();
    }

    public List<DeadlineRule> getDeadlineRulesByType(String type) {
        return deadlineRuleRepository.findByType(type);
    }

    public DeadlineRule createOrUpdateDeadlineRule(DeadlineRule rule) {

        Optional<DeadlineRule> existing =
                deadlineRuleRepository.findByTypeAndName(rule.getType(), rule.getName());

        if (existing.isPresent()) {
            DeadlineRule existingRule = existing.get();
            existingRule.setDeadline(rule.getDeadline());
            existingRule.setResubmissions(rule.getResubmissions());
            existingRule.setStatus(rule.getStatus());
            return deadlineRuleRepository.save(existingRule);
        }

        if (rule.getStatus() == null || rule.getStatus().isEmpty()) {
            rule.setStatus("Active");
        }

        return deadlineRuleRepository.save(rule);
    }

    public String deleteDeadlineRule(String id) {
        deadlineRuleRepository.deleteById(id);
        return "Deadline rule deleted";
    }
}
