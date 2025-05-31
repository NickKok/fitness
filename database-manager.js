document.addEventListener('DOMContentLoaded', () => {
    loadExercises();

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const exercises = JSON.parse(localStorage.getItem('exerciseDatabase') || '[]');
        const filteredExercises = exercises.filter(exercise =>
            exercise.name.toLowerCase().includes(searchTerm) ||
            exercise.attributes.bodyParts.join(',').toLowerCase().includes(searchTerm) ||
            exercise.attributes.bodyAreas.join(',').toLowerCase().includes(searchTerm) ||
            exercise.attributes.exerciseTypes.join(',').toLowerCase().includes(searchTerm) ||
            exercise.description.toLowerCase().includes(searchTerm) ||
            exercise.equipment.toLowerCase().includes(searchTerm)
        );
        displayExercises(filteredExercises);
    });

    // Form submission
    document.getElementById('exerciseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveExercise();
    });
});

function loadExercises() {
    const exercises = JSON.parse(localStorage.getItem('exerciseDatabase') || '[]');
    document.getElementById('noDataMessage').style.display = exercises.length ? 'none' : 'block';
    displayExercises(exercises);
}

function displayExercises(exercises) {
    const tableBody = document.getElementById('exerciseTableBody');
    tableBody.innerHTML = '';
    exercises.forEach((exercise, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exercise.name}</td>
            <td>${exercise.attributes.bodyParts.join(', ')}</td>
            <td>${exercise.attributes.bodyAreas.join(', ')}</td>
            <td>${exercise.attributes.difficulty}</td>
            <td>${exercise.attributes.exerciseTypes.join(', ')}</td>
            <td>${exercise.description}</td>
            <td>${exercise.equipment}</td>
            <td>
                <button onclick="editExercise(${index})">Edit</button>
                <button onclick="deleteExercise(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showAddExerciseModal() {
    document.getElementById('modalTitle').textContent = 'Add New Exercise';
    document.getElementById('exerciseForm').reset();
    document.getElementById('exerciseForm').dataset.index = '';
    document.getElementById('addExerciseModal').style.display = 'block';
}

function editExercise(index) {
    const exercises = JSON.parse(localStorage.getItem('exerciseDatabase') || '[]');
    const exercise = exercises[index];
    document.getElementById('modalTitle').textContent = 'Edit Exercise';
    document.getElementById('exerciseName').value = exercise.name;
    document.getElementById('bodyParts').value = exercise.attributes.bodyParts.join(',');
    document.getElementById('bodyAreas').value = exercise.attributes.bodyAreas.join(',');
    document.getElementById('difficulty').value = exercise.attributes.difficulty;
    document.getElementById('exerciseTypes').value = exercise.attributes.exerciseTypes.join(',');
    document.getElementById('description').value = exercise.description;
    document.getElementById('equipment').value = exercise.equipment;
    document.getElementById('exerciseForm').dataset.index = index;
    document.getElementById('addExerciseModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addExerciseModal').style.display = 'none';
}

function saveExercise() {
    const exercises = JSON.parse(localStorage.getItem('exerciseDatabase') || '[]');
    const index = document.getElementById('exerciseForm').dataset.index;
    const exercise = {
        name: document.getElementById('exerciseName').value,
        attributes: {
            bodyParts: document.getElementById('bodyParts').value.split(',').map(s => s.trim()).filter(s => s),
            bodyAreas: document.getElementById('bodyAreas').value.split(',').map(s => s.trim()).filter(s => s),
            difficulty: document.getElementById('difficulty').value,
            exerciseTypes: document.getElementById('exerciseTypes').value.split(',').map(s => s.trim()).filter(s => s)
        },
        description: document.getElementById('description').value,
        equipment: document.getElementById('equipment').value
    };

    if (index === '') {
        exercises.push(exercise);
    } else {
        exercises[index] = exercise;
    }

    localStorage.setItem('exerciseDatabase', JSON.stringify(exercises));
    loadExercises();
    closeModal();
}

function deleteExercise(index) {
    const exercises = JSON.parse(localStorage.getItem('exerciseDatabase') || '[]');
    exercises.splice(index, 1);
    localStorage.setItem('exerciseDatabase', JSON.stringify(exercises));
    loadExercises();
}

function скачатьJSON() {
    const exercises = JSON.parse(localStorage.getItem('exerciseDatabase') || '[]');
    const blob = new Blob([JSON.stringify(exercises, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exercise-database.json';
    a.click();
    URL.revokeObjectURL(url);
}