// DOM Elements
const routineSelect = document.getElementById('routineSelect');
const routineEditor = document.getElementById('routineEditor');
const routineNameInput = document.getElementById('routineName');
const routineDescription = document.getElementById('routineDescription');
const routineExercises = document.getElementById('routineExercises');
const addExerciseToRoutineBtn = document.getElementById('addExerciseToRoutineBtn');
const downloadRoutineBtn = document.getElementById('downloadRoutineBtn');
const exerciseSelectorModal = new bootstrap.Modal('#exerciseSelectorModal');

// Current routine being edited
let currentRoutine = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeRoutineManager();
});

function initializeRoutineManager() {
    loadFromLocalStorage();
    populateRoutineSelect();
    setupRoutineEventListeners();
}

function setupRoutineEventListeners() {
    routineSelect.addEventListener('change', handleRoutineSelect);
    addExerciseToRoutineBtn.addEventListener('click', openExerciseSelector);
    downloadRoutineBtn.addEventListener('click', downloadRoutineDB);
    
    // Add event listener for exercise selector modal
    document.getElementById('selectExerciseBtn')?.addEventListener('click', addSelectedExerciseToRoutine);
}

function populateRoutineSelect() {
    routineSelect.innerHTML = '<option value="">Select a routine</option>';
    routineDB.forEach(routine => {
        const option = document.createElement('option');
        option.value = routine.meta.name;
        option.textContent = routine.meta.name;
        routineSelect.appendChild(option);
    });
}

function handleRoutineSelect(e) {
    const routineName = e.target.value;
    if (!routineName) {
        routineEditor.style.display = 'none';
        currentRoutine = null;
        return;
    }
    
    currentRoutine = routineDB.find(r => r.meta.name === routineName);
    if (!currentRoutine) {
        console.error("Routine not found:", routineName);
        return;
    }
    
    // Populate routine editor
    routineNameInput.value = currentRoutine.meta.name;
    routineDescription.value = currentRoutine.meta.description || '';
    renderRoutineExercises();
    
    routineEditor.style.display = 'block';
}

function renderRoutineExercises() {
    if (!currentRoutine) return;
    
    routineExercises.innerHTML = '';
    
    currentRoutine.exercises.forEach((exercise, index) => {
        const exerciseData = findExerciseByName(exercise.name) || {};
        const exerciseCard = document.createElement('div');
        exerciseCard.className = 'card mb-3 exercise-card';
        
        exerciseCard.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5>${exercise.name}</h5>
                        <p class="text-muted">${exerciseData.description || ''}</p>
                    </div>
                    <button class="btn btn-sm btn-danger remove-exercise" data-index="${index}">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
                
                <div class="row g-3 mt-2">
                    <div class="col-md-4">
                        <label class="form-label">Sets</label>
                        <input type="text" class="form-control sets-input" 
                               value="${exercise.sets || ''}" data-index="${index}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Reps/Duration</label>
                        <input type="text" class="form-control reps-input" 
                               value="${exercise.reps || exercise.duration || ''}" data-index="${index}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Notes</label>
                        <input type="text" class="form-control notes-input" 
                               value="${exercise.notes || ''}" data-index="${index}">
                    </div>
                </div>
                
                <div class="mt-3">
                    <button class="btn btn-sm btn-outline-primary edit-exercise-btn" data-name="${exercise.name}">
                        <i class="bi bi-pencil"></i> Edit Exercise Definition
                    </button>
                </div>
            </div>
        `;
        
        routineExercises.appendChild(exerciseCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.sets-input, .reps-input, .notes-input').forEach(input => {
        input.addEventListener('change', handleExerciseUpdate);
    });
    
    document.querySelectorAll('.remove-exercise').forEach(btn => {
        btn.addEventListener('click', removeExerciseFromRoutine);
    });
    
    document.querySelectorAll('.edit-exercise-btn').forEach(btn => {
        btn.addEventListener('click', editExerciseDefinition);
    });
}

function handleExerciseUpdate(e) {
    if (!currentRoutine) return;
    
    const index = parseInt(e.target.dataset.index);
    const value = e.target.value;
    
    if (e.target.classList.contains('sets-input')) {
        currentRoutine.exercises[index].sets = value;
    } else if (e.target.classList.contains('reps-input')) {
        if (value.includes('sec') || value.includes('min')) {
            currentRoutine.exercises[index].duration = value;
            delete currentRoutine.exercises[index].reps;
        } else {
            currentRoutine.exercises[index].reps = value;
            delete currentRoutine.exercises[index].duration;
        }
    } else if (e.target.classList.contains('notes-input')) {
        currentRoutine.exercises[index].notes = value;
    }
    
    saveToLocalStorage();
}

function removeExerciseFromRoutine(e) {
    if (!currentRoutine) return;
    
    const index = parseInt(e.target.dataset.index);
    currentRoutine.exercises.splice(index, 1);
    saveToLocalStorage();
    renderRoutineExercises();
}

function editExerciseDefinition(e) {
    const exerciseName = e.target.dataset.name;
    window.location.href = `./exercise-db.html?edit=${encodeURIComponent(exerciseName)}`;
}

function openExerciseSelector() {
    renderExerciseSelectionTable();
    exerciseSelectorModal.show();
}

function renderExerciseSelectionTable() {
    const exerciseSelectionBody = document.getElementById('exerciseSelectionBody');
    if (!exerciseSelectionBody) return;
    
    exerciseSelectionBody.innerHTML = '';
    
    exerciseDB.forEach(exercise => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><input type="radio" name="selectedExercise" value="${exercise.name}"></td>
            <td>${exercise.name}</td>
            <td>${exercise.description.substring(0, 50)}${exercise.description.length > 50 ? '...' : ''}</td>
        `;
        
        exerciseSelectionBody.appendChild(row);
    });
}

function addSelectedExerciseToRoutine() {
    if (!currentRoutine) return;
    
    const selected = document.querySelector('input[name="selectedExercise"]:checked');
    if (!selected) {
        alert('Please select an exercise first');
        return;
    }
    
    const exerciseName = selected.value;
    
    // Add to routine
    currentRoutine.exercises.push({
        name: exerciseName,
        sets: '1',
        reps: '10-12'
    });
    
    saveToLocalStorage();
    renderRoutineExercises();
    exerciseSelectorModal.hide();
}

function downloadRoutineDB() {
    const data = {
        routines: routineDB
    };
    
    downloadJSON(data, 'exercise-routines.json');
}