Fitness App Hub V1 31/5/2025
Overview
The Fitness App Hub is a web-based application designed to help users manage their fitness routines and exercise data. It provides a centralized platform with three main modules: Exercise Database Manager, Routine Builder, and Routine Recorder. These modules allow users to create, manage, and track workouts, with support for importing and exporting data in JSON format. The app leverages HTML, JavaScript, and local storage to provide a seamless, client-side experience without requiring a backend server.
Purpose
The Fitness App Hub aims to streamline fitness tracking by enabling users to:

Manage Exercises: Create, update, and delete exercises with attributes (e.g., muscle groups targeted) in a customizable database.
Build Routines: Create workout routines by selecting exercises from the database and defining parameters like reps, time, and comments.
Record Workouts: Track workout progress by selecting and logging routines, with options to edit and save changes.
Data Portability: Import and export exercise and routine data as JSON files for easy sharing and backup.

Workflow
The application is structured around a hub-and-spoke model, with index.html serving as the central hub linking to three specialized modules. Below is the workflow for each component:
1. Index (Fitness App Hub - index.html)

Purpose: Acts as the landing page, providing navigation to the three modules and data management features.
Features:
Navigation: Links to Exercise Database Manager, Routine Builder, and Routine Recorder.
Data Management:
Upload JSON files for exercises (exercise-database.json) and routines (workout-routines.json).
Download current exercise and routine data as JSON files.




Workflow:
Users land on the hub page.
They can upload JSON files to populate the exercise database or routines.
They can download the current state of the database or routines as JSON.
Users select a module (e.g., Routine Recorder) to perform specific tasks.



2. Exercise Database Manager (database-manager.html)

Purpose: Manages a collection of exercises stored in exercise-database.json.
Features:
Display a table of exercises with their names and attributes (e.g., "core, abs, lite").
Add new exercises via a form.
Edit or delete existing exercises.
Download the exercise database as a JSON file.


Workflow:
If no exercise data is loaded, users are prompted to upload a JSON file from the hub.
Exercises are displayed in a table with options to edit or delete.
Users can add new exercises by entering a name and attributes.
Changes are saved to localStorage and can be exported as a JSON file.



3. Routine Builder (routine-builder.html)

Purpose: Allows users to create and manage workout routines by selecting exercises from the database.
Features:
Search and filter exercises from the database to add to a routine.
Define routine details (e.g., exercise reps, time, comments).
Save routines to localStorage and export as workout-routines.json.
Remove exercises from the current routine.


Workflow:
Users search for exercises from the loaded database.
Selected exercises are added to a "Current Routine" table, where users can specify reps, time, and comments.
Users save the routine with a name, storing it in localStorage.
Routines can be downloaded as a JSON file or edited later.



4. Routine Recorder (routine-recorder.html)

Purpose: Tracks workout progress by allowing users to select and log routines.
Features:
Display available routines from workout-routines.json.
Select a routine to view its exercises and log progress.
Edit routine details (e.g., name, exercises) and save changes.
Add new exercises to a routine during tracking.


Workflow:
If no routines are loaded, users are prompted to upload a JSON file from the hub.
Users select a routine from a dropdown to view its exercises.
They can edit the routine (e.g., update exercise details) or add new exercises.
Changes are saved to localStorage for persistence.



File Structure

index.html: The main hub page for navigation and data management.
database-manager.html: Manages the exercise database with CRUD functionality.
routine-builder.html: Builds and saves workout routines.
routine-recorder.html: Tracks and records workout progress.
exercise-database.json: Stores the exercise database with names and attributes (e.g., muscle groups, intensity).
workout-routines.json: Stores workout routines with names, exercises, and details (e.g., reps, time, comments).
Other Files (assumed, not provided):
CSS and JavaScript files for styling and functionality (e.g., form handling, localStorage management, JSON parsing).



Data Structure

Exercise Database (exercise-database.json):
Array of objects with name (string) and attributes (string, comma-separated tags like "core,abs,lite").
Example: {"name":"Push-ups","attributes":"core,upper,arms,chest,back,full"}


Workout Routines (workout-routines.json):
Array of routine objects with name, optional description, notes, and an exercises array.
Each exercise has name, reps, time, comments, and optional attributes or rest.
Example: {"name":"Full Body Tabata","exercises":[{"name":"Jumping Jacks","time":"20","rest":"10","attributes":"warmup,cardio,full"}]}



Technical Details

Frontend: Built with HTML, JavaScript, and likely CSS for styling (CSS file not provided).
Storage: Uses localStorage to persist exercise and routine data client-side.
Data Format: JSON for importing/exporting exercises and routines, ensuring portability.
Dependencies: Assumes JavaScript for dynamic functionality (e.g., DOM manipulation, event handling), but no external libraries are explicitly referenced in the provided files.

Usage

Setup:
Clone or download the repository.
Host the files on a local server (e.g., using http-server or a browser's live server extension) to avoid CORS issues with file uploads.


Initial Data:
Upload exercise-database.json and workout-routines.json via the hub (index.html) to populate the app.


Operation:
Use Exercise Database Manager to add/edit exercises.
Use Routine Builder to create routines from the exercise database.
Use Routine Recorder to track workouts and update routines.
Export data as JSON for backup or sharing.


Notes:
Ensure JSON files are valid before uploading to avoid parsing errors.
The app is client-side, so all data is stored in the browser's localStorage.



Potential Improvements

Validation: Add input validation for JSON uploads and form submissions to prevent errors.
Visualization: Integrate charts (e.g., Chart.js) to visualize workout progress or calories burned.
UI/UX: Enhance styling with a CSS framework (e.g., Tailwind CSS) for better responsiveness and aesthetics.
Error Handling: Improve feedback for invalid JSON or missing data.
Backend Integration: Add a backend (e.g., Node.js) for cloud storage and multi-device syncing.

License
This project is open-source and available under the MIT License (assumed, as no license file is provided).
