// DOM Elements
const exerciseTableBody = document.getElementById('exerciseTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addExerciseBtn = document.getElementById('addExerciseBtn');
const downloadExerciseBtn = document.getElementById('downloadExerciseBtn');
const exerciseModal = new bootstrap.Modal('#exerciseModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderExerciseTable();
    setupExerciseEventListeners();
});

function setupExerciseEventListeners() {
    addExerciseBtn.addEventListener('click', () => openExerciseModal());
    downloadExerciseBtn.addEventListener('click', downloadExerciseDB);
    searchBtn.addEventListener('click', () => renderExerciseTable());
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') renderExerciseTable();
    });
}

function renderExerciseTable() {
    exerciseTableBody.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredExercises = exerciseDB.filter(exercise => {
        const nameMatch = exercise.name.toLowerCase().includes(searchTerm);
        const descMatch = exercise.description.toLowerCase().includes(searchTerm);
        const attrMatch = exercise.attributes.some(attr => 
            attr.toLowerCase().includes(searchTerm)
        );
        return nameMatch || descMatch || attrMatch;
    });
    
    filteredExercises.forEach(exercise => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${exercise.name}</td>
            <td>${exercise.description}</td>
            <td>${exercise.attributes.join(', ')}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${exercise.name}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${exercise.name}">Delete</button>
            </td>
        `;
        
        exerciseTableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const exerciseName = e.target.dataset.id;
            openExerciseModal(exerciseName);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const exerciseName = e.target.dataset.id;
            deleteExercise(exerciseName);
        });
    });
}

function openExerciseModal(exerciseName = null) {
    const modalTitle = document.getElementById('modalTitle');
    const exerciseId = document.getElementById('exerciseId');
    const exerciseNameInput = document.getElementById('exerciseName');
    const exerciseDescription = document.getElementById('exerciseDescription');
    const exerciseAttributes = document.getElementById('exerciseAttributes');
    const exerciseMethod = document.getElementById('exerciseMethod');
    const exerciseTips = document.getElementById('exerciseTips');
    const deleteExerciseBtn = document.getElementById('deleteExerciseBtn');
    
    if (exerciseName) {
        // Edit existing exercise
        const exercise = findExerciseByName(exerciseName);
        if (!exercise) return;
        
        modalTitle.textContent = 'Edit Exercise';
        exerciseId.value = exercise.name;
        exerciseNameInput.value = exercise.name;
        exerciseDescription.value = exercise.description;
        exerciseAttributes.value = exercise.attributes.join(', ');
        exerciseMethod.value = exercise.method.replace(/<br>/g, '\n');
        exerciseTips.value = exercise.tips || '';
        deleteExerciseBtn.style.display = 'inline-block';
    } else {
        // Add new exercise
        modalTitle.textContent = 'Add New Exercise';
        exerciseId.value = '';
        exerciseNameInput.value = '';
        exerciseDescription.value = '';
        exerciseAttributes.value = '';
        exerciseMethod.value = '';
        exerciseTips.value = '';
        deleteExerciseBtn.style.display = 'none';
    }
    
    exerciseModal.show();
}

function saveExercise() {
    const exerciseId = document.getElementById('exerciseId').value;
    const exerciseName = document.getElementById('exerciseName').value;
    const exerciseDescription = document.getElementById('exerciseDescription').value;
    const exerciseAttributes = document.getElementById('exerciseAttributes').value;
    const exerciseMethod = document.getElementById('exerciseMethod').value;
    const exerciseTips = document.getElementById('exerciseTips').value;
    
    // Validate
    if (!exerciseName || !exerciseDescription || !exerciseMethod) {
        alert('Name, description, and method are required!');
        return;
    }
    
    const attributesArray = exerciseAttributes
        .split(',')
        .map(attr => attr.trim())
        .filter(attr => attr);
    
    const methodSteps = exerciseMethod
        .split('\n')
        .map(step => step.trim())
        .filter(step => step);
    
    const exercise = {
        name: exerciseName,
        description: exerciseDescription,
        attributes: attributesArray,
        method: methodSteps.join('\n'),
        tips: exerciseTips
    };
    
    if (exerciseId && exerciseId !== exerciseName) {
        // Name changed - remove old entry
        deleteExercise(exerciseId);
    }
    
    // Add or update
    const existingIndex = exerciseDB.findIndex(ex => ex.name === exerciseName);
    if (existingIndex !== -1) {
        exerciseDB[existingIndex] = exercise;
    } else {
        exerciseDB.push(exercise);
    }
    
    saveToLocalStorage();
    renderExerciseTable();
    exerciseModal.hide();
}

function deleteExercise(exerciseName) {
    if (!confirm(`Delete "${exerciseName}"? This cannot be undone.`)) return;
    
    const index = exerciseDB.findIndex(ex => ex.name === exerciseName);
    if (index !== -1) {
        exerciseDB.splice(index, 1);
        saveToLocalStorage();
        renderExerciseTable();
    }
}

function downloadExerciseDB() {
    const data = {
        meta: {
            version: "2.1",
            type: "exercise_database",
            last_updated: new Date().toISOString().split('T')[0],
            exercise_count: exerciseDB.length
        },
        exercises: exerciseDB
    };
    
    downloadJSON(data, 'exercise-database.json');
}

// Set up modal buttons
document.getElementById('saveExerciseBtn').addEventListener('click', saveExercise);
document.getElementById('deleteExerciseBtn').addEventListener('click', () => {
    const exerciseName = document.getElementById('exerciseId').value;
    if (exerciseName) {
        deleteExercise(exerciseName);
        exerciseModal.hide();
    }
});