const API_URL = 'http://localhost:3000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setDefaultDates();
});

// Set default dates
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
    
    const now = new Date();
    document.getElementById('reportYear').value = now.getFullYear();
    document.getElementById('reportMonth').value = now.getMonth() + 1;
}

// Tab Management
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'students') {
        loadStudents();
    } else if (tabName === 'attendance') {
        loadStudentsForAttendance();
    }
}

// Message Display
function showMessage(message, type = 'success') {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type} show`;
    
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}

// Student CRUD Operations
document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const studentData = {
        name: document.getElementById('name').value,
        rollNumber: document.getElementById('rollNumber').value,
        email: document.getElementById('email').value,
        class: document.getElementById('class').value,
        phone: document.getElementById('phone').value
    };
    
    try {
        let response;
        if (studentId) {
            // Update existing student
            response = await fetch(`${API_URL}/students/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
        } else {
            // Create new student
            response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
        }
        
        if (response.ok) {
            showMessage(studentId ? 'Student updated successfully!' : 'Student added successfully!');
            resetForm();
            loadStudents();
        } else {
            const error = await response.json();
            showMessage(error.message || 'Error saving student', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server', 'error');
        console.error(error);
    }
});

function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.querySelector('#studentForm button[type="submit"]').textContent = 'Add Student';
}

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        const students = await response.json();
        
        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Class</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.length === 0 ? 
                        '<tr><td colspan="6" class="no-data">No students found. Add your first student!</td></tr>' :
                        students.map(student => `
                            <tr>
                                <td>${student.rollNumber}</td>
                                <td>${student.name}</td>
                                <td>${student.email}</td>
                                <td>${student.class}</td>
                                <td>${student.phone || '-'}</td>
                                <td class="action-buttons">
                                    <button class="btn btn-sm btn-info" onclick="editStudent('${student._id}')">Edit</button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')
                    }
                </tbody>
            </table>
        `;
        
        document.getElementById('studentsTable').innerHTML = tableHtml;
    } catch (error) {
        showMessage('Error loading students', 'error');
        console.error(error);
    }
}

async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/students/${id}`);
        const student = await response.json();
        
        document.getElementById('studentId').value = student._id;
        document.getElementById('name').value = student.name;
        document.getElementById('rollNumber').value = student.rollNumber;
        document.getElementById('email').value = student.email;
        document.getElementById('class').value = student.class;
        document.getElementById('phone').value = student.phone || '';
        
        document.querySelector('#studentForm button[type="submit"]').textContent = 'Update Student';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showMessage('Error loading student details', 'error');
        console.error(error);
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('Student deleted successfully!');
            loadStudents();
        } else {
            showMessage('Error deleting student', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server', 'error');
        console.error(error);
    }
}

// Attendance Management
async function loadStudentsForAttendance() {
    const date = document.getElementById('attendanceDate').value;
    if (!date) {
        showMessage('Please select a date', 'error');
        return;
    }
    
    try {
        const studentsResponse = await fetch(`${API_URL}/students`);
        const students = await studentsResponse.json();
        
        const attendanceResponse = await fetch(`${API_URL}/attendance/date/${date}`);
        const attendanceRecords = await attendanceResponse.json();
        
        const attendanceMap = {};
        attendanceRecords.forEach(record => {
            attendanceMap[record.studentId._id || record.studentId] = record.status;
        });
        
        const listHtml = `
            <div class="attendance-container">
                ${students.length === 0 ? 
                    '<p class="no-data">No students available. Please add students first.</p>' :
                    students.map(student => `
                        <div class="attendance-item">
                            <div class="student-info">
                                <strong>${student.name}</strong>
                                <span class="roll-number">Roll: ${student.rollNumber}</span>
                                <span class="class-name">Class: ${student.class}</span>
                            </div>
                            <div class="attendance-buttons">
                                <button class="btn ${attendanceMap[student._id] === 'present' ? 'btn-success active' : 'btn-outline'}" 
                                        onclick="markAttendance('${student._id}', 'present')">
                                    Present
                                </button>
                                <button class="btn ${attendanceMap[student._id] === 'absent' ? 'btn-danger active' : 'btn-outline'}" 
                                        onclick="markAttendance('${student._id}', 'absent')">
                                    Absent
                                </button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `;
        
        document.getElementById('attendanceList').innerHTML = listHtml;
    } catch (error) {
        showMessage('Error loading attendance data', 'error');
        console.error(error);
    }
}

async function markAttendance(studentId, status) {
    const date = document.getElementById('attendanceDate').value;
    
    try {
        const response = await fetch(`${API_URL}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId,
                date,
                status
            })
        });
        
        if (response.ok) {
            showMessage(`Marked as ${status}`);
            loadStudentsForAttendance();
        } else {
            showMessage('Error marking attendance', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server', 'error');
        console.error(error);
    }
}

// Monthly Report
async function generateReport() {
    const year = document.getElementById('reportYear').value;
    const month = document.getElementById('reportMonth').value;
    
    if (!year || !month) {
        showMessage('Please select year and month', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/attendance/report/${year}/${month}`);
        const reportData = await response.json();
        
        const reportHtml = `
            <div class="report-header">
                <h3>Attendance Report - ${reportData.monthName} ${reportData.year}</h3>
            </div>
            <table class="data-table report-table">
                <thead>
                    <tr>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Total Days</th>
                        <th>Attendance %</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.report.length === 0 ? 
                        '<tr><td colspan="7" class="no-data">No attendance data for this month</td></tr>' :
                        reportData.report.map(student => `
                            <tr>
                                <td>${student.rollNumber}</td>
                                <td>${student.name}</td>
                                <td>${student.class}</td>
                                <td class="present-count">${student.presentCount}</td>
                                <td class="absent-count">${student.absentCount}</td>
                                <td>${student.totalDays}</td>
                                <td>
                                    <span class="percentage ${student.attendancePercentage >= 75 ? 'good' : 'poor'}">
                                        ${student.attendancePercentage}%
                                    </span>
                                </td>
                            </tr>
                        `).join('')
                    }
                </tbody>
            </table>
        `;
        
        document.getElementById('reportContent').innerHTML = reportHtml;
    } catch (error) {
        showMessage('Error generating report', 'error');
        console.error(error);
    }
}
