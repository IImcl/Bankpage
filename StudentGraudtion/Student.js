const COURSES = [];
const STUDENTS = [];

// Save Test Data to Local Storage to test
if (!localStorage.getItem("students")) {
    const testStudents = [
        {
            id: "S001",
            name: "John Doe",
            courses: [
                {
                    courseName: "3507 Web Development and Programming",
                    midterm: 85,
                    final: 90,
                    grade: "A",
                    gpa: 3.7
                },
                {
                    courseName: "Introduction to Databases",
                    midterm: 75,
                    final: 80,
                    grade: "B",
                    gpa: 3.0
                }
            ]
        },
        {
            id: "S002",
            name: "Jane Smith",
            courses: [
                {
                    courseName: "3507 Web Development and Programming",
                    midterm: 40,
                    final: 50,
                    grade: "F",
                    gpa: 1.0
                },
                {
                    courseName: "Introduction to Databases",
                    midterm: 60,
                    final: 65,
                    grade: "D",
                    gpa: 2.0
                }
            ]
        }
    ];

    const TestCourses = [
        { name: "3507 Web Development and Programming", gradingSystem: "letter" },
        { name: "Introduction to Databases", gradingSystem: "letter" }
    ];

    localStorage.setItem("students", JSON.stringify(testStudents));
    localStorage.setItem("courses", JSON.stringify(TestCourses));
}

//AND This for Save to Local Storage
function saveStudentsToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(STUDENTS));
}

function saveCoursesToLocalStorage() {
    localStorage.setItem("courses", JSON.stringify(COURSES));
}

// Load from Local Storage
function loadFromLocalStorage() {
    const savedStudents = JSON.parse(localStorage.getItem("students"));
    const savedCourses = JSON.parse(localStorage.getItem("courses"));

    if (savedStudents) {
        STUDENTS.splice(0, STUDENTS.length, ...savedStudents);
        updateStudentTable(STUDENTS);
    }

    if (savedCourses) {
        COURSES.splice(0, COURSES.length, ...savedCourses);
        updateCourseDropdown();
        updateFilterDropdown();
        updateLectureDropdown();
    }
}

// Add Course
function addCourse(courseName) {
    const gradingSystem = document.getElementById("grading-system").value;

    if (!courseName.trim()) {
        alert("Enter a valid course name.");
        return;
    }

    const course = { name: courseName, gradingSystem };
    COURSES.push(course);
    saveCoursesToLocalStorage();
    updateCourseDropdown();
    updateFilterDropdown();
    updateLectureDropdown();
    alert(`Course "${courseName}" added!`);
}

// Update Dropdowns
function updateCourseDropdown() {
    const dropdown = document.getElementById("course-select");
    dropdown.innerHTML = '<option value="" disabled selected>Select a course</option>';
    COURSES.forEach(course => {
        const option = document.createElement("option");
        option.value = course.name;
        option.textContent = course.name;
        dropdown.appendChild(option);
    });
}

function updateFilterDropdown() {
    const filterDropdown = document.getElementById("filter-course-select");
    filterDropdown.innerHTML = '<option value="" disabled selected>Select a course</option>';
    COURSES.forEach(course => {
        const option = document.createElement("option");
        option.value = course.name;
        option.textContent = course.name;
        filterDropdown.appendChild(option);
    });
}

function updateLectureDropdown() {
    const lectureDropdown = document.getElementById("lecture-course-select");
    lectureDropdown.innerHTML = '<option value="" disabled selected>Select a course</option>';
    COURSES.forEach(course => {
        const option = document.createElement("option");
        option.value = course.name;
        option.textContent = course.name;
        lectureDropdown.appendChild(option);
    });
}

// FOR Add Student
function addStudent(studentId, studentName, midterm, final, courseName) {
    if (!studentId.trim() || !studentName.trim()) {
        alert("Student ID and Name cannot be empty.");
        return;
    }

    if (midterm < 0 || midterm > 100 || final < 0 || final > 100) {
        alert("Grades must be between 0 and 100.");
        return;
    }

    const course = COURSES.find(c => c.name === courseName);

    if (!course) {
        alert("Course not found! Please add a course first.");
        return;
    }

    const grade = calculateGrade(midterm, final);
    const gpa = ((0.4 * midterm + 0.6 * final) / 25).toFixed(2);

    const student = STUDENTS.find(s => s.id === studentId);
    if (student) {
        student.courses.push({ courseName, midterm, final, grade, gpa });
    } else {
        STUDENTS.push({
            id: studentId,
            name: studentName,
            courses: [{ courseName, midterm, final, grade, gpa }]
        });
    }

    saveStudentsToLocalStorage();
    updateStudentTable(STUDENTS);
    document.getElementById("student-form").reset();
}

// Calculate Grade
function calculateGrade(midterm, final) {
    const score = 0.4 * midterm + 0.6 * final;
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

// View Lecture Details
function viewLectureDetails(CourseName) {
    const courseStudents = STUDENTS.filter(student =>
        student.courses.some(course => course.courseName === CourseName)
    );

    if (courseStudents.length === 0) {
        alert("No students enrolled in this course.");
        return;
    }

    let passed = 0, failed = 0, totalScore = 0, totalCount = 0;

    courseStudents.forEach(student => {
        student.courses.forEach(course => {
            if (course.courseName === CourseName) {
                totalScore += 0.4 * course.midterm + 0.6 * course.final;
                totalCount++;
                if (course.grade !== "F") passed++;
                else failed++;
            }
        });
    });

    const meanScore = totalCount > 0 ? (totalScore / totalCount).toFixed(2) : "0.00";

    document.getElementById("passed-students").textContent = passed;
    document.getElementById("failed-students").textContent = failed;
    document.getElementById("mean-score").textContent = meanScore;
}

// Calculate GPA for a Student
function calculateStudentGPA(studentId) {
    const student = STUDENTS.find(s => s.id === studentId);
    if (!student) {
        alert("Student not found.");
        return;
    }

    let totalGPA = 0;
    let totalCourses = 0;

    student.courses.forEach(course => {
        totalGPA += parseFloat(course.gpa);
        totalCourses++;
    });

    const gpa = totalCourses > 0 ? (totalGPA / totalCourses).toFixed(2) : "0.00";
    document.getElementById("gpa-result").textContent = `GPA for Student ID ${studentId}: ${gpa}`;
}

// Update Student Table
function updateStudentTable(data, courseName = "") {
    const tableBody = document.querySelector("#students-table tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="8">No students found for ${courseName || "any course"}.</td>`;
        tableBody.appendChild(row);
        return;
    }

    data.forEach(student => {
        student.courses.forEach(course => {
            if (!courseName || course.courseName === courseName) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${course.courseName}</td>
                    <td>${course.midterm}</td>
                    <td>${course.final}</td>
                    <td>${course.grade}</td>
                    <td>${course.gpa}</td>
                    <td>
                        <button onclick="editStudent('${student.id}', '${course.courseName}')">Edit</button>
                        <button onclick="deleteStudent('${student.id}', '${course.courseName}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}

// Edit Student
function editStudent(studentId, courseName) {
    const student = STUDENTS.find(s => s.id === studentId);
    const course = student.courses.find(c => c.courseName === courseName);

    document.getElementById("student-id").value = student.id;
    document.getElementById("student-name").value = student.name;
    document.getElementById("midterm-score").value = course.midterm;
    document.getElementById("final-score").value = course.final;
    document.getElementById("course-select").value = courseName;

    document.getElementById("student-form").onsubmit = (e) => {
        e.preventDefault();
        deleteStudent(studentId, courseName);
        addStudent(
            document.getElementById("student-id").value,
            document.getElementById("student-name").value,
            parseFloat(document.getElementById("midterm-score").value),
            parseFloat(document.getElementById("final-score").value),
            document.getElementById("course-select").value
        );
    };
}

// Delete Student
function deleteStudent(studentId, courseName) {
    const student = STUDENTS.find(s => s.id === studentId);
    if (student) {
        student.courses = student.courses.filter(c => c.courseName !== courseName);
        if (student.courses.length === 0) {
            STUDENTS.splice(STUDENTS.indexOf(student), 1);
        }
        saveStudentsToLocalStorage();
        updateStudentTable(STUDENTS);
    }
}

// Event Listeners
document.getElementById("course-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const courseName = document.getElementById("course-name").value;
    addCourse(courseName);
    document.getElementById("course-form").reset();
});

document.getElementById("student-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    const midterm = parseFloat(document.getElementById("midterm-score").value);
    const final = parseFloat(document.getElementById("final-score").value);
    const courseName = document.getElementById("course-select").value;

    addStudent(studentId, studentName, midterm, final, courseName);
});

document.getElementById("gpa-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const studentId = document.getElementById("gpa-student-id").value;
    calculateStudentGPA(studentId);
});

document.getElementById("lecture-details-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const courseName = document.getElementById("lecture-course-select").value;
    viewLectureDetails(courseName);
});

// Initial Load
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);



function isPassed(grade) {
    return grade !== "F"; // Passed if grade is not "F"
}


// Function to display filtered student records
function displayFilteredStudents(filteredStudents) {
    const tableBody = document.querySelector("#students-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    if (filteredStudents.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="8">No records found.</td>`;
        tableBody.appendChild(row);
        return;
    }

    filteredStudents.forEach(({ id, name, courseName, midterm, final, grade, gpa }) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>${courseName}</td>
            <td>${midterm}</td>
            <td>${final}</td>
            <td>${grade}</td>
            <td>${gpa}</td>
            <td><button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Event listener for filtering passed or failed students
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", event => {
        const filterType = event.target.id; // 'view-passed' or 'view-failed'
        const selectedCourse = document.querySelector("#filter-course-select").value;

        if (!selectedCourse) {
            alert("Please select a course to filter.");
            return;
        }

        // Filter students based on selected course and pass/fail status
        const filteredStudents = STUDENTS.flatMap(student =>
            student.courses
                .filter(course => course.courseName === selectedCourse)
                .filter(course => (filterType === "view-passed" ? isPassed(course.grade) : !isPassed(course.grade)))
                .map(course => ({
                    id: student.id,
                    name: student.name,
                    courseName: course.courseName,
                    midterm: course.midterm,
                    final: course.final,
                    grade: course.grade,
                    gpa: course.gpa
                }))
        );

        // Display the filtered students in the table
        displayFilteredStudents(filteredStudents);
    });
});
