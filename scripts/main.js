// Global data stores
let exerciseDB = [];
let routineDB = [];

// DOM Elements
const domElements = {
    exerciseFileInput: document.getElementById('exerciseFileInput'),
    routineFileInput: document.getElementById('routineFileInput'),
    // ... other elements
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
});

function setupEventListeners() {
    if (domElements.exerciseFileInput) {
        domElements.exerciseFileInput.addEventListener('change', handleExerciseFileUpload);
    }
    
    if (domElements.routineFileInput) {
        domElements.routineFileInput.addEventListener('change', handleRoutineFileUpload);
    }
}

function handleExerciseFileUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            exerciseDB = data.exercises || [];
            saveToLocalStorage();
            if (typeof renderExerciseTable === 'function') renderExerciseTable();
            if (typeof populateRoutineSelect === 'function') populateRoutineSelect();
            alert('Exercise database loaded successfully!');
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

function handleRoutineFileUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            routineDB = data.routines || [];
            saveToLocalStorage();
            if (typeof populateRoutineSelect === 'function') populateRoutineSelect();
            alert('Routine database loaded successfully!');
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveToLocalStorage() {
    localStorage.setItem('exerciseDB', JSON.stringify(exerciseDB));
    localStorage.setItem('routineDB', JSON.stringify(routineDB));
}

function loadFromLocalStorage() {
    exerciseDB = JSON.parse(localStorage.getItem('exerciseDB')) || [];
    routineDB = JSON.parse(localStorage.getItem('routineDB')) || [];
}

// Utility to find exercise by name
function findExerciseByName(name) {
    return exerciseDB.find(ex => ex.name === name);
}

// Utility to update exercise in DB
function updateExercise(updatedExercise) {
    const index = exerciseDB.findIndex(ex => ex.name === updatedExercise.name);
    if (index !== -1) {
        exerciseDB[index] = updatedExercise;
        saveToLocalStorage();
        return true;
    }
    return false;
}
