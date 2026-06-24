// Survey Questions Data
const questions = [
  {
    id: "r1",
    category: "Experiencia",
    title: "¿Ha usado alguna vez algún servicio de tipo reparación, instalación u otro?",
    description: "Ej. Carpintero, herrero, plomero, electricista, fotógrafo, mecánico, pintor, etc.",
    type: "single",
    required: true,
    options: [
      { text: "Sí, he contratado estos servicios", value: "Sí" },
      { text: "No, nunca los he utilizado", value: "No" }
    ]
  },
  {
    id: "r2",
    category: "Frecuencia",
    title: "¿Cuántas veces en el último año ha necesitado contratar un servicio de mantenimiento o reparación?",
    description: "Por qué importa: Nos ayuda a saber si esta será una aplicación de uso frecuente o de un solo uso.",
    type: "single",
    required: true,
    options: [
      { text: "1 a 2 veces", value: "1-2 veces" },
      { text: "3 a 5 veces", value: "3-5 veces" },
      { text: "Más de 5 veces", value: "Mas de 5 veces" }
    ]
  },
  {
    id: "r3",
    category: "Adquisición",
    title: "Cuando surge una emergencia o necesidad y no tiene un contacto de confianza, ¿cuál es su primer paso para encontrar a alguien?",
    description: "Queremos entender por dónde empiezan las personas su búsqueda de profesionales.",
    type: "single",
    required: true,
    options: [
      { text: "Preguntar a familiares/vecinos (Boca a boca)", value: "a) Preguntar a familiares/vecinos (Boca a boca)" },
      { text: "Buscar en grupos de Facebook o WhatsApp de la colonia", value: "b) Buscar en grupos de Facebook o WhatsApp de la colonia" },
      { text: "Buscar en Google Maps / Internet", value: "c) Buscar en Google Maps / Internet" },
      { text: "Buscar anuncios en la calle", value: "d) Buscar anuncios en la calle" }
    ]
  },
  {
    id: "r4",
    category: "Fricción",
    title: "¿Cuál es su mayor temor o queja al contratar a un profesional que no conoce?",
    description: "Por qué importa: El problema principal guiará la propuesta de valor y las garantías de la app (Puedes elegir hasta dos opciones).",
    type: "multi",
    maxChoices: 2,
    required: true,
    options: [
      { text: "Que haga un mal trabajo y no dé garantía", value: "a) Que haga un mal trabajo y no dé garantía" },
      { text: "Que altere el precio al final / Precios ocultos", value: "b) Que altere el precio al final / Precios ocultos" },
      { text: "Impuntualidad o que nunca llegue", value: "c) Impuntualidad o que nunca llegue" },
      { text: "Inseguridad de meter a un desconocido a casa", value: "d) Inseguridad de meter a un desconocido a casa" }
    ]
  },
  {
    id: "r5",
    category: "Decisión",
    title: "Antes de contratar, ¿qué factor lo convence de elegir a un profesional sobre otro?",
    description: "Nos dice cuál es la característica decisiva para concretar la contratación.",
    type: "single",
    required: true,
    options: [
      { text: "Recomendación de un conocido", value: "a) Recomendación de un conocido" },
      { text: "Ver fotos de trabajos anteriores", value: "b) Ver fotos de trabajos anteriores" },
      { text: "El precio más bajo", value: "c) El precio más bajo" },
      { text: "La rapidez para atender el problema", value: "d) La rapidez para atender el problema" }
    ]
  },
  {
    id: "r6",
    category: "Validación de Uso",
    title: "Si existiera una aplicación móvil donde pudiera ver a los profesionales de su ciudad, leer reseñas y ver precios base, ¿la utilizaría?",
    description: "Evaluamos el interés real en la propuesta de valor integrada.",
    type: "conditional",
    required: true,
    options: [
      { text: "Sí", value: "Sí" },
      { text: "No", value: "No" },
      { text: "Tal vez, dependería de...", value: "Tal vez" }
    ]
  }
];

// App State
let currentStep = -1; // -1: Intro, 0-5: Questions, 6: Contact Info, 7: Success
const userAnswers = {
  nombre: "",
  telefono: "",
  r1: "",
  r2: "",
  r3: "",
  r4: [], // stores array of selected values
  r5: "",
  r6: ""
};

// DOM Elements
const screenIntro = document.getElementById("screenIntro");
const screenQuiz = document.getElementById("screenQuiz");
const screenContact = document.getElementById("screenContact");
const screenSuccess = document.getElementById("screenSuccess");

const progressContainer = document.getElementById("progressContainer");
const progressBarFill = document.getElementById("progressBarFill");
const progressPercent = document.getElementById("progressPercent");

const questionCategory = document.getElementById("questionCategory");
const questionTitle = document.getElementById("questionTitle");
const questionDescription = document.getElementById("questionDescription");
const answersArea = document.getElementById("answersArea");

const btnStart = document.getElementById("btnStart");
const btnBack = document.getElementById("btnBack");
const btnSkip = document.getElementById("btnSkip");
const btnNext = document.getElementById("btnNext");
const btnContactBack = document.getElementById("btnContactBack");
const btnSubmit = document.getElementById("btnSubmit");

const validationMessage = document.getElementById("validationMessage");
const validationText = document.getElementById("validationText");

const inputName = document.getElementById("inputName");
const inputPhone = document.getElementById("inputPhone");

// Event Listeners
btnStart.addEventListener("click", async () => {
  btnStart.disabled = true;
  const originalHtml = btnStart.innerHTML;
  btnStart.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  try {
    const response = await fetch('/api/check-ip');
    const result = await response.json();
    if (result.hasResponded) {
      alert("Ya hemos recibido una respuesta desde tu conexión. ¡Gracias por participar!");
      btnStart.innerHTML = originalHtml;
      btnStart.disabled = false;
      return;
    }
  } catch (e) {
    console.error("Error verifying IP:", e);
  }
  btnStart.innerHTML = originalHtml;
  btnStart.disabled = false;
  navigateToStep(0);
});
btnBack.addEventListener("click", () => navigateToStep(currentStep - 1));
btnSkip.addEventListener("click", () => handleSkip());
btnNext.addEventListener("click", () => handleNext());
btnContactBack.addEventListener("click", () => navigateToStep(questions.length - 1));
btnSubmit.addEventListener("click", () => handleSubmit());

// Navigation Router
function navigateToStep(step) {
  // Hide all screens
  screenIntro.style.display = "none";
  screenQuiz.style.display = "none";
  screenContact.style.display = "none";
  screenSuccess.style.display = "none";
  
  // Reset animations
  const screens = [screenIntro, screenQuiz, screenContact, screenSuccess];
  screens.forEach(s => s.classList.remove("active"));

  currentStep = step;
  hideValidation();

  if (step === -1) {
    // Intro Screen
    progressContainer.style.display = "none";
    screenIntro.style.display = "block";
    setTimeout(() => screenIntro.classList.add("active"), 50);
  } else if (step >= 0 && step < questions.length) {
    // Quiz Questions
    progressContainer.style.display = "block";
    updateProgressBar();
    screenQuiz.style.display = "block";
    renderQuestion(step);
    setTimeout(() => screenQuiz.classList.add("active"), 50);
  } else if (step === questions.length) {
    // Contact Info Screen
    progressContainer.style.display = "block";
    updateProgressBar();
    screenContact.style.display = "block";
    setTimeout(() => screenContact.classList.add("active"), 50);
  } else if (step === questions.length + 1) {
    // Success Screen
    progressContainer.style.display = "none";
    screenSuccess.style.display = "block";
    setTimeout(() => screenSuccess.classList.add("active"), 50);
  }
}

// Progress Bar Controller
function updateProgressBar() {
  // Total steps including contact screen: questions.length + 1
  const total = questions.length + 1;
  const current = currentStep + 1;
  const percent = Math.round((current / total) * 100);
  progressBarFill.style.width = `${percent}%`;
  progressPercent.innerText = `${percent}%`;
}

// Render Question Form
function renderQuestion(index) {
  const question = questions[index];
  
  // Set categories and text
  questionCategory.innerText = `Pregunta ${index + 1} de ${questions.length} • ${question.category}`;
  questionTitle.innerText = question.title;
  
  if (question.description) {
    questionDescription.innerText = question.description;
    questionDescription.style.display = "block";
  } else {
    questionDescription.style.display = "none";
  }

  // Clear answers area
  answersArea.innerHTML = "";

  // Render options based on type
  if (question.type === "single" || question.type === "conditional") {
    // Single Choice Options (Radio cards)
    question.options.forEach((opt, optIndex) => {
      const card = document.createElement("div");
      card.className = "option-card option-card-single";
      card.id = `opt-${optIndex}`;
      
      const isSelected = userAnswers[question.id] === opt.value || 
                         (question.type === "conditional" && opt.value === "Tal vez" && userAnswers[question.id].startsWith("Tal vez"));
      
      if (isSelected) {
        card.classList.add("selected");
      }

      card.innerHTML = `
        <div class="check-indicator"><i class="fa-solid fa-check"></i></div>
        <div class="option-text">${opt.text}</div>
      `;

      card.addEventListener("click", () => selectSingleOption(index, opt, card));
      answersArea.appendChild(card);
    });

    // If conditional type (like Q6) and "Tal vez" is selected, render/show the text area
    if (question.type === "conditional") {
      const conditionalContainer = document.createElement("div");
      conditionalContainer.className = "conditional-input-container";
      conditionalContainer.id = "conditionalContainer";
      
      const storedVal = userAnswers[question.id];
      const detailsVal = storedVal.startsWith("Tal vez, dependería de:") 
        ? storedVal.replace("Tal vez, dependería de:", "").trim() 
        : "";

      conditionalContainer.innerHTML = `
        <label class="form-label" style="margin-top: 10px;">¿De qué dependería?</label>
        <textarea id="conditionalText" placeholder="Ej. De la seguridad de la app, precios competitivos, etc." rows="3">${detailsVal}</textarea>
      `;

      answersArea.appendChild(conditionalContainer);

      const textInput = conditionalContainer.querySelector("textarea");
      textInput.addEventListener("input", (e) => {
        userAnswers[question.id] = `Tal vez, dependería de: ${e.target.value.trim()}`;
        hideValidation();
      });

      // Show if Tal vez is selected
      if (storedVal.startsWith("Tal vez")) {
        conditionalContainer.style.display = "block";
      }
    }

  } else if (question.type === "multi") {
    // Multi Choice Options (Checkbox cards, limit maxChoices)
    const selectedList = userAnswers[question.id] || [];

    question.options.forEach((opt, optIndex) => {
      const card = document.createElement("div");
      card.className = "option-card option-card-multi";
      card.id = `opt-${optIndex}`;

      const isSelected = selectedList.includes(opt.value);
      if (isSelected) {
        card.classList.add("selected");
      }

      card.innerHTML = `
        <div class="check-indicator"><i class="fa-solid fa-check"></i></div>
        <div class="option-text">${opt.text}</div>
      `;

      card.addEventListener("click", () => toggleMultiOption(index, opt, card));
      answersArea.appendChild(card);
    });

    // Run choice limiter check
    limitMultiChoices(question.maxChoices);
  }

  // Adjust Next / Skip buttons visibility
  // Q1 (r1) is required, others can be empty/skipped
  if (question.required) {
    btnSkip.style.display = "none";
    // If no option is selected, we disable Siguiente to guide user
    updateNextButtonState(index);
  } else {
    btnSkip.style.display = "inline-flex";
    btnNext.disabled = false;
  }
}

// Select handler for Radio Buttons
function selectSingleOption(questionIndex, option, cardElement) {
  const question = questions[questionIndex];
  
  // Deselect all sibling cards
  const cards = answersArea.querySelectorAll(".option-card-single");
  cards.forEach(c => c.classList.remove("selected"));

  // Select clicked card
  cardElement.classList.add("selected");

  // Save answer
  if (question.type === "conditional" && option.value === "Tal vez") {
    const condContainer = document.getElementById("conditionalContainer");
    condContainer.style.display = "block";
    const textInput = document.getElementById("conditionalText");
    userAnswers[question.id] = `Tal vez, dependería de: ${textInput.value.trim()}`;
    textInput.focus();
  } else {
    const condContainer = document.getElementById("conditionalContainer");
    if (condContainer) {
      condContainer.style.display = "none";
      const textInput = document.getElementById("conditionalText");
      textInput.value = ""; // clear
    }
    userAnswers[question.id] = option.value;
  }

  hideValidation();
  updateNextButtonState(questionIndex);
}

// Toggle handler for Checkboxes
function toggleMultiOption(questionIndex, option, cardElement) {
  const question = questions[questionIndex];
  let selectedList = userAnswers[question.id] || [];

  if (selectedList.includes(option.value)) {
    // Remove option
    selectedList = selectedList.filter(v => v !== option.value);
    cardElement.classList.remove("selected");
  } else {
    // Add option if not exceeding maxChoices
    if (selectedList.length < question.maxChoices) {
      selectedList.push(option.value);
      cardElement.classList.add("selected");
    } else {
      showValidation(`Puedes seleccionar un máximo de ${question.maxChoices} respuestas.`);
      return;
    }
  }

  userAnswers[question.id] = selectedList;
  hideValidation();
  limitMultiChoices(question.maxChoices);
  updateNextButtonState(questionIndex);
}

// Disables unselected checkboxes when limits are reached
function limitMultiChoices(maxChoices) {
  const selectedCards = answersArea.querySelectorAll(".option-card-multi.selected");
  const allCards = answersArea.querySelectorAll(".option-card-multi");

  if (selectedCards.length >= maxChoices) {
    allCards.forEach(card => {
      if (!card.classList.contains("selected")) {
        card.classList.add("disabled");
      }
    });
  } else {
    allCards.forEach(card => {
      card.classList.remove("disabled");
    });
  }
}

// Disables Next button if required and not answered yet
function updateNextButtonState(index) {
  const question = questions[index];
  if (question.required) {
    let answered = false;
    if (question.type === "multi") {
      answered = userAnswers[question.id] && userAnswers[question.id].length > 0;
    } else {
      answered = !!userAnswers[question.id];
    }
    btnNext.disabled = !answered;
  } else {
    btnNext.disabled = false;
  }
}

// Next Button Handler
function handleNext() {
  const question = questions[currentStep];

  // Validation
  let isValid = false;
  if (question.type === "multi") {
    isValid = userAnswers[question.id] && userAnswers[question.id].length > 0;
  } else {
    isValid = !!userAnswers[question.id];
  }

  if (question.required && !isValid) {
    showValidation("Esta pregunta es obligatoria para continuar.");
    return;
  }

  // Branching Logic
  // If Q1 is "No", end survey immediately
  if (currentStep === 0 && userAnswers.r1 === 'No') {
    handleSubmit();
    return;
  }

  // If last question (Q6), determine if we show Contact screen
  if (currentStep === questions.length - 1) {
    const r6Answer = userAnswers.r6 || '';
    if (r6Answer === 'No' || r6Answer === '') {
      // Skip contact screen, end survey
      handleSubmit();
      return;
    }
  }

  // Go to next step
  navigateToStep(currentStep + 1);
}

// Skip Button Handler
function handleSkip() {
  const question = questions[currentStep];
  
  // Clear any partial selection when skipping
  if (question.type === "multi") {
    userAnswers[question.id] = [];
  } else {
    userAnswers[question.id] = "";
  }

  // If skipping last question (Q6), skip contact screen
  if (currentStep === questions.length - 1) {
    handleSubmit();
    return;
  }

  navigateToStep(currentStep + 1);
}

// Validation Message Helpers
function showValidation(msg) {
  validationText.innerText = msg;
  validationMessage.style.display = "flex";
}

function hideValidation() {
  validationMessage.style.display = "none";
}

// Submit survey data to the Node Express Backend
async function handleSubmit() {
  // Capture and validate final contact fields only if on the Contact Info screen
  if (currentStep === questions.length) {
    userAnswers.nombre = inputName.value.trim();
    const phoneValue = inputPhone.value.trim();

    // Validación del teléfono
    if (!phoneValue) {
      alert("El número de teléfono es obligatorio.");
      return;
    }
    if (!/^[0-9\s]+$/.test(phoneValue)) {
      alert("El número de teléfono solo debe contener números y espacios.");
      return;
    }
    const digitCount = phoneValue.replace(/\s/g, '').length;
    if (digitCount < 10 || digitCount > 12) {
      alert("El número de teléfono debe tener entre 10 y 12 dígitos.");
      return;
    }
    userAnswers.telefono = phoneValue;
  }

  // Set submitting visual state
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';

  try {
    const response = await fetch('/api/encuesta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userAnswers)
    });

    const result = await response.json();

    if (response.ok) {
      // Advance to success screen
      navigateToStep(questions.length + 1);
    } else {
      alert(`Error al enviar: ${result.error || 'Error desconocido'}`);
      resetSubmitButton();
    }
  } catch (error) {
    console.error('Error submitting survey:', error);
    alert('No se pudo conectar con el servidor. Revisa tu conexión.');
    resetSubmitButton();
  }
}

function resetSubmitButton() {
  btnSubmit.disabled = false;
  btnSubmit.innerHTML = 'Enviar Encuesta <i class="fa-regular fa-paper-plane"></i>';
}

// Initializing application
navigateToStep(-1);
