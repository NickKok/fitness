// Global data stores
let exerciseDB = [];
let routineDB = [];

// DOM Elements
const domElements = {
    exerciseFileInput: document.getElementById('exerciseFileInput'),
    routineFileInput: document.getElementById('routineFileInput'),
    downloadExerciseBtn: document.getElementById('downloadExerciseBtn'),
    downloadRoutineBtn: document.getElementById('downloadRoutineBtn')
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
    
    // Check for exercise to edit (passed from routine manager)
    if (window.location.search.includes('edit=')) {
        const exerciseName = decodeURIComponent(window.location.search.split('edit=')[1]);
        const exerciseModal = new bootstrap.Modal('#exerciseModal');
        openExerciseModal(exerciseName);
        exerciseModal.show();
    }
});

// Set up global event listeners
function setupEventListeners() {
    // File upload handlers
    if (domElements.exerciseFileInput) {
        domElements.exerciseFileInput.addEventListener('change', handleExerciseFileUpload);
    }
    
    if (domElements.routineFileInput) {
        domElements.routineFileInput.addEventListener('change', handleRoutineFileUpload);
    }
    
    // Download buttons
    if (domElements.downloadExerciseBtn) {
        domElements.downloadExerciseBtn.addEventListener('click', () => {
            downloadExerciseDB();
        });
    }
    
    if (domElements.downloadRoutineBtn) {
        domElements.downloadRoutineBtn.addEventListener('click', () => {
            downloadRoutineDB();
        });
    }
}

// Handle exercise database file upload
function handleExerciseFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.exercises) {
                exerciseDB = data.exercises;
            } else if (Array.isArray(data)) {
                exerciseDB = data;
            } else {
                throw new Error("Invalid exercise database format");
            }
            
            saveToLocalStorage();
            
            // Update UI if on exercise page
            if (typeof renderExerciseTable === 'function') {
                renderExerciseTable();
            }
            
            // Update routine select if on routine page
            if (typeof populateRoutineSelect === 'function') {
                populateRoutineSelect();
            }
            
            showAlert('Exercise database loaded successfully!', 'success');
        } catch (error) {
            console.error("Error parsing exercise JSON:", error);
            showAlert(`Error loading exercise database: ${error.message}`, 'danger');
        }
    };
    
    reader.onerror = () => {
        showAlert('Error reading file', 'danger');
    };
    
    reader.readAsText(file);
}

// Handle routine database file upload
function handleRoutineFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.routines) {
                routineDB = data.routines;
            } else if (Array.isArray(data)) {
                routineDB = data;
            } else {
                throw new Error("Invalid routine database format");
            }
            
            saveToLocalStorage();
            
            // Update UI if on routine page
            if (typeof populateRoutineSelect === 'function') {
                populateRoutineSelect();
            }
            
            showAlert('Routine database loaded successfully!', 'success');
        } catch (error) {
            console.error("Error parsing routine JSON:", error);
            showAlert(`Error loading routine database: ${error.message}`, 'danger');
        }
    };
    
    reader.onerror = () => {
        showAlert('Error reading file', 'danger');
    };
    
    reader.readAsText(file);
}

// Download exercise database as JSON file
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

// Download routine database as JSON file
function downloadRoutineDB() {
    const data = {
        meta: {
            version: "1.0",
            type: "routine_database",
            last_updated: new Date().toISOString().split('T')[0],
            routine_count: routineDB.length
        },
        routines: routineDB
    };
    
    downloadJSON(data, 'exercise-routines.json');
}

// Helper function to download any JSON data
function downloadJSON(data, filename) {
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showAlert(`${filename} downloaded successfully!`, 'success');
    } catch (error) {
        console.error("Error downloading JSON:", error);
        showAlert(`Error downloading file: ${error.message}`, 'danger');
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('exerciseDB', JSON.stringify(exerciseDB));
        localStorage.setItem('routineDB', JSON.stringify(routineDB));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
        showAlert('Error saving data to browser storage', 'danger');
    }
}

// Load data from localStorage
function loadFromLocalStorage() {
    try {
        const exerciseData = localStorage.getItem('exerciseDB');
        const routineData = localStorage.getItem('routineDB');
        
        exerciseDB = exerciseData ? JSON.parse(exerciseData) : [];
        routineDB = routineData ? JSON.parse(routineData) : [];
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        exerciseDB = [];
        routineDB = [];
    }
}

// Find exercise by name
function findExerciseByName(name) {
    return exerciseDB.find(ex => ex.name === name);
}

// Update exercise in database
function updateExercise(updatedExercise) {
    const index = exerciseDB.findIndex(ex => ex.name === updatedExercise.name);
    if (index !== -1) {
        exerciseDB[index] = updatedExercise;
        saveToLocalStorage();
        return true;
    }
    return false;
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove any existing alerts first
    const existingAlert = document.querySelector('.global-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `global-alert alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.prepend(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Open exercise modal (shared between pages)
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
        if (!exercise) {
            showAlert('Exercise not found in database', 'warning');
            return;
        }
        
        modalTitle.textContent = 'Edit Exercise';
        exerciseId.value = exercise.name;
        exerciseNameInput.value = exercise.name;
        exerciseDescription.value = exercise.description;
        exerciseAttributes.value = exercise.attributes.join(', ');
        exerciseMethod.value = exercise.method.replace(/<br>/g, '\n');
        exerciseTips.value = exercise.tips || '';
        
        if (deleteExerciseBtn) {
            deleteExerciseBtn.style.display = 'inline-block';
        }
    } else {
        // Add new exercise
        modalTitle.textContent = 'Add New Exercise';
        exerciseId.value = '';
        exerciseNameInput.value = '';
        exerciseDescription.value = '';
        exerciseAttributes.value = '';
        exerciseMethod.value = '';
        exerciseTips.value = '';
        
        if (deleteExerciseBtn) {
            deleteExerciseBtn.style.display = 'none';
        }
    }
    
    // Initialize modal if not already initialized
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const exerciseModal = new bootstrap.Modal('#exerciseModal');
        exerciseModal.show();
    }
}

// Save exercise (shared between pages)
function saveExercise() {
    const exerciseId = document.getElementById('exerciseId')?.value;
    const exerciseName = document.getElementById('exerciseName')?.value;
    const exerciseDescription = document.getElementById('exerciseDescription')?.value;
    const exerciseAttributes = document.getElementById('exerciseAttributes')?.value;
    const exerciseMethod = document.getElementById('exerciseMethod')?.value;
    const exerciseTips = document.getElementById('exerciseTips')?.value;
    
    // Validate required fields
    if (!exerciseName || !exerciseDescription || !exerciseMethod) {
        showAlert('Name, description, and method are required fields', 'warning');
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
        tips: exerciseTips || ''
    };
    
    if (exerciseId && exerciseId !== exerciseName) {
        // Name changed - remove old entry
        deleteExercise(exerciseId);
    }
    
    // Add or update exercise
    const existingIndex = exerciseDB.findIndex(ex => ex.name === exerciseName);
    if (existingIndex !== -1) {
        exerciseDB[existingIndex] = exercise;
    } else {
        exerciseDB.push(exercise);
    }
    
    saveToLocalStorage();
    
    // Update UI
    if (typeof renderExerciseTable === 'function') {
        renderExerciseTable();
    }
    
    if (typeof renderRoutineExercises === 'function') {
        renderRoutineExercises();
    }
    
    showAlert(`Exercise "${exerciseName}" saved successfully!`, 'success');
    
    // Close modal if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const exerciseModal = bootstrap.Modal.getInstance('#exerciseModal');
        if (exerciseModal) {
            exerciseModal.hide();
        }
    }
    
    // If we came from routine manager, go back
    if (window.location.search.includes('edit=')) {
        window.history.back();
    }
}

// Delete exercise (shared between pages)
function deleteExercise(exerciseName) {
    if (!confirm(`Are you sure you want to delete "${exerciseName}"? This will remove it from all routines.`)) {
        return;
    }
    
    const index = exerciseDB.findIndex(ex => ex.name === exerciseName);
    if (index !== -1) {
        // Remove from exercise DB
        exerciseDB.splice(index, 1);
        
        // Remove from all routines
        routineDB.forEach(routine => {
            routine.exercises = routine.exercises.filter(ex => ex.name !== exerciseName);
        });
        
        saveToLocalStorage();
        
        // Update UI
        if (typeof renderExerciseTable === 'function') {
            renderExerciseTable();
        }
        
        if (typeof renderRoutineExercises === 'function') {
            renderRoutineExercises();
        }
        
        showAlert(`Exercise "${exerciseName}" deleted successfully`, 'success');
        
        // Close modal if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const exerciseModal = bootstrap.Modal.getInstance('#exerciseModal');
            if (exerciseModal) {
                exerciseModal.hide();
            }
        }
    }
}