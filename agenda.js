

/* ========================================
   DARK MODE GLOBAL
======================================== */

const themeToggle =
document.getElementById("themeToggle");

/* CARGAR TEMA GUARDADO */

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark-mode");

    themeToggle.innerHTML = "☀️";
}

/* CAMBIAR TEMA */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem("theme", "dark");

        themeToggle.innerHTML = "☀️";

    }else{

        localStorage.setItem("theme", "light");

        themeToggle.innerHTML = "🌙";
    }

});


/* =========================
   FECHA
========================= */

const months = [
    "Enero","Febrero","Marzo","Abril",
    "Mayo","Junio","Julio","Agosto",
    "Septiembre","Octubre","Noviembre","Diciembre"
];

const currentDate = new Date();

let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let selectedDate = null;

/* =========================
   ELEMENTOS
========================= */

const calendarGrid =
document.getElementById("calendarGrid");

const monthSelect =
document.getElementById("monthSelect");

const yearSelect =
document.getElementById("yearSelect");

const tasksGrid =
document.getElementById("tasksGrid");

const flashcardsGrid =
document.getElementById("flashcardsGrid");

const loadProgress =
document.getElementById("loadProgress");

const loadPercentage =
document.getElementById("loadPercentage");

const loadMessage =
document.getElementById("loadMessage");

/* =========================
   STORAGE
========================= */

let tasks =
JSON.parse(
    localStorage.getItem("tasks")
) || [];

let flashcards =
JSON.parse(
    localStorage.getItem("flashcards")
) || [];

/* =========================
   MOTIVACIÓN DINÁMICA
========================= */

function updateMotivation(){

    const pending =
    tasks.filter(
        task => !task.completed
    ).length;

    const completed =
    tasks.filter(
        task => task.completed
    ).length;

    const hour =
    new Date().getHours();

    let message = "";
    let state = "Estable";

    if(pending >= 8){

        message =
        "Tu carga académica es muy alta. Divide tareas y avanza paso a paso.";

        state = "Saturado";
    }

    else if(pending >= 5){

        message =
        "Tienes varias tareas pendientes. Organiza prioridades y evita procrastinar.";

        state = "Ocupado";
    }

    else if(completed >= 5){

        message =
        "Excelente progreso. Mantén el ritmo y sigue avanzando.";

        state = "Productivo";
    }

    else{

        message =
        "Tu organización está equilibrada. Aprovecha para estudiar con calma.";

        state = "Estable";
    }

    if(hour >= 22){

        message =
        "Descansar también es importante para rendir mejor mañana.";

        state = "Descanso";
    }

    document.getElementById("motivationText")
    .innerText = message;

    document.getElementById("pendingTasksMotivation")
    .innerText = pending;

    document.getElementById("completedTasksMotivation")
    .innerText = completed;

    document.getElementById("motivationLevel")
    .innerText = state;
}

/* =========================
   SELECTORES
========================= */

months.forEach((month, index) => {

    const option =
    document.createElement("option");

    option.value = index;
    option.textContent = month;

    monthSelect.appendChild(option);
});

for(let year = 2024; year <= 2035; year++){

    const option =
    document.createElement("option");

    option.value = year;
    option.textContent = year;

    yearSelect.appendChild(option);
}

monthSelect.value = currentMonth;
yearSelect.value = currentYear;

/* =========================
   CALENDARIO
========================= */

function renderCalendar(){

    calendarGrid.innerHTML = "";

    const firstDay =
    new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();

    const daysInMonth =
    new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

    let adjusted =
    firstDay === 0 ? 6 : firstDay - 1;

    for(let i = 0; i < adjusted; i++){

        const empty =
        document.createElement("div");

        empty.classList.add("empty");

        calendarGrid.appendChild(empty);
    }

    for(let day = 1; day <= daysInMonth; day++){

        const dayElement =
        document.createElement("div");

        dayElement.classList.add("calendar-day");

        const fullDate =
        `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        dayElement.innerText = day;

        const tasksForDay =
        tasks.filter(
            task => task.date === fullDate
        );

        if(tasksForDay.length > 0){

            const dot =
            document.createElement("span");

            dot.classList.add(
                "calendar-dot",
                tasksForDay[0].priority
            );

            dayElement.appendChild(dot);
        }

        dayElement.addEventListener("click", () => {

            selectedDate = fullDate;

            filterTasksByDate(fullDate);

            document
            .querySelectorAll(".calendar-day")
            .forEach(el => {

                el.classList.remove("active-day");
            });

            dayElement.classList.add("active-day");
        });

        calendarGrid.appendChild(dayElement);
    }
}

/* =========================
   CAMBIO MES
========================= */

monthSelect.addEventListener("change", () => {

    currentMonth =
    parseInt(monthSelect.value);

    renderCalendar();
});

yearSelect.addEventListener("change", () => {

    currentYear =
    parseInt(yearSelect.value);

    renderCalendar();
});

document.getElementById("prevMonth")
.addEventListener("click", () => {

    currentMonth--;

    if(currentMonth < 0){

        currentMonth = 11;
        currentYear--;
    }

    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;

    renderCalendar();
});

document.getElementById("nextMonth")
.addEventListener("click", () => {

    currentMonth++;

    if(currentMonth > 11){

        currentMonth = 0;
        currentYear++;
    }

    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;

    renderCalendar();
});

/* =========================
   AGREGAR TAREA
========================= */

document.getElementById("addTaskBtn")
.addEventListener("click", () => {

    const title =
    document.getElementById("taskTitle").value;

    const date =
    document.getElementById("taskDate").value;

    const time =
    document.getElementById("taskTime").value;

    const priority =
    document.getElementById("taskPriority").value;

    if(title === "" || date === ""){

        alert("Completa los campos.");
        return;
    }

    const task = {

        id:Date.now(),

        title,
        date,
        time,
        priority,

        completed:false
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    renderCalendar();

    updateAcademicLoad();

    updateMotivation();

    clearTaskInputs();
});

/* =========================
   LIMPIAR
========================= */

function clearTaskInputs(){

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskTime").value = "";
}

/* =========================
   RENDER TASKS
========================= */

function renderTasks(filtered = tasks){

    tasksGrid.innerHTML = "";

    filtered.forEach(task => {

        const card =
        document.createElement("div");

        card.classList.add(
            "task-card",
            task.priority
        );

        if(task.completed){

            card.classList.add("completed");
        }

        card.innerHTML = `

            <div class="task-header">

                <h3>
                    ${task.title}
                </h3>

                <span class="priority-tag ${task.priority}">
                    ${task.priority}
                </span>

            </div>

            <p>
                ${task.date}
            </p>

            <p>
                ${task.time || "Sin horario"}
            </p>

            <div class="task-buttons">

                <button onclick="toggleTask(${task.id})">

                    ${
                        task.completed
                        ? "Completada"
                        : "Completar"
                    }

                </button>

                <button onclick="deleteTask(${task.id})">

                    Eliminar

                </button>

            </div>
        `;

        tasksGrid.appendChild(card);
    });

    updateStats();
}

/* =========================
   FILTRAR
========================= */

function filterTasksByDate(date){

    const filtered =
    tasks.filter(
        task => task.date === date
    );

    renderTasks(filtered);
}

/* =========================
   COMPLETAR
========================= */

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed =
            !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();

    updateAcademicLoad();

    updateMotivation();
}

/* =========================
   ELIMINAR
========================= */

function deleteTask(id){

    tasks =
    tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();

    renderCalendar();

    updateAcademicLoad();

    updateMotivation();
}

/* =========================
   CARGA ACADÉMICA
========================= */

function updateAcademicLoad(){

    let score = 0;

    tasks.forEach(task => {

        if(task.completed) return;

        if(task.priority === "alta"){
            score += 30;
        }

        if(task.priority === "media"){
            score += 20;
        }

        if(task.priority === "baja"){
            score += 10;
        }

        const today = new Date();

        const taskDate =
        new Date(task.date);

        const diff =
        (taskDate - today)
        / (1000 * 60 * 60 * 24);

        if(diff <= 2){
            score += 20;
        }
    });

    if(score > 100){
        score = 100;
    }

    loadProgress.style.width =
    score + "%";

    loadPercentage.innerText =
    score + "%";

    if(score >= 80){

        loadMessage.innerText =
        "Tu carga académica es muy alta.";
    }

    else if(score >= 50){

        loadMessage.innerText =
        "Tienes varias tareas importantes.";
    }

    else{

        loadMessage.innerText =
        "Tu carga académica está equilibrada.";
    }
}

/* =========================
   STORAGE
========================= */

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function saveFlashcards(){

    localStorage.setItem(
        "flashcards",
        JSON.stringify(flashcards)
    );
}

/* =========================
   FLASHCARDS
========================= */

document.getElementById("addFlashcardBtn")
.addEventListener("click", () => {

    const question =
    document.getElementById("flashQuestion").value;

    const answer =
    document.getElementById("flashAnswer").value;

    const subject =
    document.getElementById("flashSubject").value;

    const difficulty =
    document.getElementById("flashDifficulty").value;

    if(question === "" || answer === ""){

        alert("Completa la flashcard.");
        return;
    }

    flashcards.push({

        id:Date.now(),

        question,
        answer,
        subject,
        difficulty
    });

    saveFlashcards();

    renderFlashcards();

    clearFlashInputs();
});

/* =========================
   LIMPIAR FLASH
========================= */

function clearFlashInputs(){

    document.getElementById("flashQuestion").value = "";
    document.getElementById("flashAnswer").value = "";
}

/* =========================
   RENDER FLASHCARDS
========================= */

function renderFlashcards(){

    flashcardsGrid.innerHTML = "";

    const subjectFilter =
    document.getElementById("filterSubject").value;

    const difficultyFilter =
    document.getElementById("filterDifficulty").value;

    let filtered =
    flashcards.filter(card => {

        const subjectMatch =
        subjectFilter === "all"
        || card.subject === subjectFilter;

        const difficultyMatch =
        difficultyFilter === "all"
        || card.difficulty === difficultyFilter;

        return subjectMatch && difficultyMatch;
    });

    filtered.forEach(card => {

        const flash =
        document.createElement("div");

        flash.classList.add("flashcard");

        flash.innerHTML = `

            <div class="flashcard-inner">

                <div class="flashcard-front">

                    <h3>
                        ${card.question}
                    </h3>

                    <small>
                        ${card.subject}
                    </small>

                </div>

                <div class="flashcard-back">

                    <p>
                        ${card.answer}
                    </p>

                    <button onclick="deleteFlashcard(${card.id})">
                        Eliminar
                    </button>

                </div>

            </div>
        `;

        flash.addEventListener("click", () => {

            flash.classList.toggle("flip");
        });

        flashcardsGrid.appendChild(flash);
    });

    updateStats();
}

/* =========================
   ELIMINAR FLASH
========================= */

function deleteFlashcard(id){

    flashcards =
    flashcards.filter(
        card => card.id !== id
    );

    saveFlashcards();

    renderFlashcards();
}

/* =========================
   FILTROS
========================= */

document.getElementById("filterSubject")
.addEventListener("change", renderFlashcards);

document.getElementById("filterDifficulty")
.addEventListener("change", renderFlashcards);

/* =========================
   ESTADÍSTICAS
========================= */

function updateStats(){

    document.getElementById("completedTasks")
    .innerText =

    tasks.filter(
        task => task.completed
    ).length;

    document.getElementById("pendingTasks")
    .innerText =

    tasks.filter(
        task => !task.completed
    ).length;

    document.getElementById("flashcardsCount")
    .innerText = flashcards.length;
}

/* =========================
   MODO ESTUDIO
========================= */

let studyCards = [];
let currentStudy = 0;

document.getElementById("studyModeBtn")
.addEventListener("click", () => {

    const subject =
    document.getElementById("filterSubject").value;

    const difficulty =
    document.getElementById("filterDifficulty").value;

    studyCards =
    flashcards.filter(card => {

        const subjectMatch =
        subject === "all"
        || card.subject === subject;

        const difficultyMatch =
        difficulty === "all"
        || card.difficulty === difficulty;

        return subjectMatch && difficultyMatch;
    });

    if(studyCards.length === 0){

        alert("No hay flashcards.");
        return;
    }

    currentStudy = 0;

    showStudyCard();

    document.getElementById("studyPanel")
    .classList.remove("hidden");
});

/* =========================
   MOSTRAR CARD
========================= */

function showStudyCard(){

    const card =
    studyCards[currentStudy];

    document.getElementById("studyQuestion")
    .innerText = card.question;

    document.getElementById("studyAnswer")
    .innerText = card.answer;

    document.getElementById("studyInner")
    .classList.remove("flipped");
}

/* =========================
   FLIP
========================= */

document.getElementById("flipFlashcard")
.addEventListener("click", () => {

    document.getElementById("studyInner")
    .classList.toggle("flipped");
});

/* =========================
   NEXT
========================= */

document.getElementById("nextFlashcard")
.addEventListener("click", () => {

    currentStudy++;

    if(currentStudy >= studyCards.length){

        currentStudy = 0;
    }

    showStudyCard();
});

/* =========================
   PREV
========================= */

document.getElementById("prevFlashcard")
.addEventListener("click", () => {

    currentStudy--;

    if(currentStudy < 0){

        currentStudy =
        studyCards.length - 1;
    }

    showStudyCard();
});

/* =========================
   CLOSE
========================= */

document.getElementById("closeStudyBtn")
.addEventListener("click", () => {

    document.getElementById("studyPanel")
    .classList.add("hidden");
});

/* =========================
   INIT
========================= */

renderCalendar();

renderTasks();

renderFlashcards();

updateAcademicLoad();

updateStats();

updateMotivation();