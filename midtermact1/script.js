let students = [];
const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));

// Helper: Age Calculation
const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

// Form Logic
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const dob = document.getElementById('birthdate').value;
    const age = calculateAge(dob);

    // 1. AGE VALIDATION
    if (age < 18) {
        alert("Registration Blocked: Only students aged 18 and above are allowed.");
        return;
    }

    const editIndex = document.getElementById('editIndex').value;
    const fName = document.getElementById('firstName').value.trim();
    const lName = document.getElementById('lastName').value.trim();

    // 2. DUPLICATE CHECK
    const isDuplicate = students.some((s, idx) => 
        idx != editIndex && 
        s.firstName.toLowerCase() === fName.toLowerCase() && 
        s.lastName.toLowerCase() === lName.toLowerCase()
    );

    if (isDuplicate) {
        alert("This student name is already in the record.");
        return;
    }

    const studentObj = {
        id: document.getElementById('idNum').value || "ID-" + Math.floor(1000 + Math.random() * 9000),
        firstName: fName,
        lastName: lName,
        middleName: document.getElementById('middleName').value.trim(),
        birthdate: dob,
        course: document.getElementById('course').value,
        yearLevel: document.getElementById('yearLevel').value
    };

    if (editIndex === "-1") {
        students.push(studentObj);
    } else {
        students[editIndex] = studentObj;
    }

    resetForm();
    renderTable();
});

// Render Table Function
function renderTable() {
    const tableBody = document.getElementById('studentTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    tableBody.innerHTML = "";

    // Alphabetical Sort
    students.sort((a, b) => a.lastName.localeCompare(b.lastName));

    const filtered = students.filter(s => 
        s.firstName.toLowerCase().includes(searchTerm) || 
        s.lastName.toLowerCase().includes(searchTerm) ||
        s.course.toLowerCase().includes(searchTerm)
    );

    filtered.forEach((s, displayIdx) => {
        // IMPORTANT: Makuha ang tamang index sa original array gamit ang ID
        const realIdx = students.findIndex(item => item.id === s.id);
        const age = calculateAge(s.birthdate);

        tableBody.innerHTML += `
            <tr class="align-middle">
                <td class="ps-3 text-muted small">${displayIdx + 1}</td>
                <td class="fw-bold text-dark">${s.lastName}, ${s.firstName}</td>
                <td><span class="badge bg-light text-dark border">${age} yrs</span></td>
                <td>${s.course}-${s.yearLevel}</td>
                <td class="text-center">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-view" onclick="viewStudent(${realIdx})">View</button>
                        <button class="btn btn-sm btn-outline-warning" onclick="editStudent(${realIdx})">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent(${realIdx})">Del</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// View Function
function viewStudent(index) {
    const s = students[index];
    const age = calculateAge(s.birthdate);
    document.getElementById('viewDetails').innerHTML = `
        <h2 class="text-primary fw-bold">${s.id}</h2>
        <h4 class="mb-0">${s.firstName} ${s.middleName} ${s.lastName}</h4>
        <p class="text-muted">${s.course} - Year ${s.yearLevel}</p>
        <hr>
        <p><strong>Birthdate:</strong> ${s.birthdate}</p>
        <p><strong>Age:</strong> ${age} years old</p>
    `;
    viewModal.show();
}

// Edit Function
function editStudent(index) {
    const s = students[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('idNum').value = s.id;
    document.getElementById('firstName').value = s.firstName;
    document.getElementById('lastName').value = s.lastName;
    document.getElementById('middleName').value = s.middleName;
    document.getElementById('birthdate').value = s.birthdate;
    document.getElementById('course').value = s.course;
    document.getElementById('yearLevel').value = s.yearLevel;

    document.getElementById('formTitle').innerText = "Update Student";
    document.getElementById('submitBtn').innerText = "Update Record";
    document.getElementById('submitBtn').className = "btn btn-success w-100 fw-bold";
}

// Delete Function
function deleteStudent(index) {
    if (confirm("Delete this student record?")) {
        students.splice(index, 1);
        renderTable();
    }
}

// Reset Function
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('editIndex').value = "-1";
    document.getElementById('idNum').value = "";
    document.getElementById('formTitle').innerText = "Student Form";
    document.getElementById('submitBtn').innerText = "Add Student";
    document.getElementById('submitBtn').className = "btn btn-primary w-100 fw-bold";
}