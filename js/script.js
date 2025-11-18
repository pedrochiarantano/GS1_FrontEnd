// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let currentProfessionalId = null;
let currentSlide = 0;
let filteredQuestions = [];
let selectedCategory = "all";

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  renderProfessionalCards();
  generateQuizQuestions("all");
});

// ============================================
// SEÇÃO DE PROFISSIONAIS - CARDS
// ============================================

/**
 * Renderiza os cards dos profissionais
 */
function renderProfessionalCards() {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  professionals.forEach((professional) => {
    const card = document.createElement("article");
    card.className = "card";
    card.onclick = () => showSlideshow(professional.id);

    // Criar preview das skills
    const skillsPreview = professional.technicalSkills.slice(0, 2).join(", ");

    card.innerHTML = `
      <img src="${professional.avatar}" alt="${professional.name}" class="avatar">
      <h3>${professional.name}</h3>
      <p class="role">${professional.role}</p>
      <p class="skills-preview">📌 ${skillsPreview}...</p>
    `;

    container.appendChild(card);
  });
}

/**
 * Mostra o slideshow com detalhes do profissional
 */
function showSlideshow(professionId) {
  currentProfessionalId = professionId;
  currentSlide = 0;

  const professional = professionals.find((p) => p.id === professionId);
  if (!professional) return;

  // Ocultar cards e mostrar slideshow
  document.querySelector(".professionals-section").style.display = "none";
  document.getElementById("slideshow-section").classList.remove("hidden");
  document.getElementById("quiz").style.display = "none";

  // Scroll para o topo
  window.scrollTo(0, 0);

  // Atualizar conteúdo do slideshow
  updateSlideshow(professional);
  generateSlideIndicators(3); // 3 slides
}

/**
 * Atualiza o conteúdo do slideshow com os dados do profissional
 */
function updateSlideshow(professional) {
  // Slide 1: Informações Pessoais
  document.getElementById("slideAvatar").src = professional.avatar;
  document.getElementById("slideName").textContent = professional.name;
  document.getElementById("slideRole").textContent = professional.role;
  document.getElementById(
    "slideLocation"
  ).textContent = `📍 ${professional.location}`;
  document.getElementById(
    "slideExperience"
  ).textContent = `${professional.experience} anos`;
  document.getElementById("slideEducation").textContent =
    professional.education;

  // Slide 2: Habilidades Técnicas
  const technicalSkillsContainer = document.getElementById("technicalSkills");
  technicalSkillsContainer.innerHTML = professional.technicalSkills
    .map((skill) => `<span class="skill-tag">${skill}</span>`)
    .join("");

  // Slide 3: Soft Skills e Hobbies
  const softSkillsContainer = document.getElementById("softSkills");
  softSkillsContainer.innerHTML = professional.softSkills
    .map((skill) => `<span class="skill-tag">${skill}</span>`)
    .join("");

  const hobbiesContainer = document.getElementById("hobbies");
  hobbiesContainer.innerHTML = professional.hobbies
    .map((hobby) => `<span class="hobby-tag">${hobby}</span>`)
    .join("");

  showSlide(0);
}

/**
 * Mostra um slide específico
 */
function showSlide(n) {
  const slides = document.querySelectorAll(".slide");

  if (n >= slides.length) {
    currentSlide = 0;
  } else if (n < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = n;
  }

  // Remover classe active de todos os slides
  slides.forEach((slide) => slide.classList.remove("slide-active"));

  // Adicionar classe active ao slide atual
  slides[currentSlide].classList.add("slide-active");

  // Atualizar indicadores
  updateIndicators();
}

/**
 * Avança para o próximo slide
 */
function nextSlide() {
  showSlide(currentSlide + 1);
}

/**
 * Volta para o slide anterior
 */
function previousSlide() {
  showSlide(currentSlide - 1);
}

/**
 * Gera os indicadores de slide
 */
function generateSlideIndicators(count) {
  const container = document.getElementById("slideIndicators");
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const indicator = document.createElement("div");
    indicator.className = `indicator ${i === 0 ? "active" : ""}`;
    indicator.onclick = () => showSlide(i);
    container.appendChild(indicator);
  }
}

/**
 * Atualiza os indicadores de slide
 */
function updateIndicators() {
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentSlide);
  });
}

/**
 * Volta para a seção de cards
 */
function backToCards() {
  currentProfessionalId = null;
  currentSlide = 0;

  document.querySelector(".professionals-section").style.display = "block";
  document.getElementById("slideshow-section").classList.add("hidden");
  document.getElementById("quiz").style.display = "block";

  window.scrollTo(0, 0);
}

// Listeners para os botões de ação (não precisam funcionar, só estética)
document.addEventListener("DOMContentLoaded", () => {
  const btnRecommend = document.querySelector(".btn-recommend");
  const btnMessage = document.querySelector(".btn-message");

  if (btnRecommend) {
    btnRecommend.addEventListener("click", () => {
      alert("✓ Profissional recomendado com sucesso!");
    });
  }

  if (btnMessage) {
    btnMessage.addEventListener("click", () => {
      alert(
        "✉ Mensagem enviada para " +
          (professionals.find((p) => p.id === currentProfessionalId)?.name ||
            "profissional")
      );
    });
  }
});

// ============================================
// SEÇÃO QUIZ
// ============================================

/**
 * Gera as perguntas do quiz filtradas por categoria
 */
function generateQuizQuestions(category) {
  selectedCategory = category;
  const container = document.getElementById("questionsContainer");
  container.innerHTML = "";

  // Filtrar perguntas
  if (category === "all") {
    filteredQuestions = quizQuestions;
  } else {
    filteredQuestions = quizQuestions.filter((q) => q.category === category);
  }

  // Renderizar perguntas
  filteredQuestions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}) ${question.question}`;

    questionDiv.appendChild(legend);

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      const input = document.createElement("input");

      input.type = "radio";
      input.name = `q${question.id}`;
      input.value = optionIndex;

      label.appendChild(input);
      label.appendChild(document.createTextNode(option));

      questionDiv.appendChild(label);
    });

    container.appendChild(questionDiv);
  });

  // Ocultar resultado anterior
  document.getElementById("quizResult").classList.add("hidden");
}

/**
 * Filtra o quiz por categoria
 */
function filterQuiz(category) {
  // Atualizar botões ativos
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Gerar novas perguntas
  generateQuizQuestions(category);

  // Scroll suave para o quiz
  document
    .getElementById("questionsContainer")
    .scrollIntoView({ behavior: "smooth" });
}

/**
 * Submete o quiz e calcula o resultado
 */
function submitQuiz(event) {
  event.preventDefault();

  let correct = 0;
  filteredQuestions.forEach((question) => {
    const selectedOption = document.querySelector(
      `input[name="q${question.id}"]:checked`
    );

    if (selectedOption && parseInt(selectedOption.value) === question.correct) {
      correct++;
    }
  });

  const total = filteredQuestions.length;
  const percentage = Math.round((correct / total) * 100);

  // Gerar mensagem de resultado
  let resultMessage = `Você acertou ${correct} de ${total} questões (${percentage}%)!\n\n`;

  if (percentage === 100) {
    resultMessage += "🎉 Excelente! Você é um especialista neste tópico!";
  } else if (percentage >= 80) {
    resultMessage += "✓ Muito bom! Você tem um ótimo conhecimento!";
  } else if (percentage >= 60) {
    resultMessage += "✓ Bom! Você tem conhecimento no assunto.";
  } else if (percentage >= 40) {
    resultMessage +=
      "! Você tem algo de conhecimento, mas há pontos a melhorar.";
  } else {
    resultMessage += "! Que tal estudar mais sobre este tópico?";
  }

  // Mostrar resultado
  const resultDiv = document.getElementById("quizResult");
  resultDiv.classList.remove("hidden");
  document.getElementById("resultMessage").textContent = resultMessage;

  // Scroll para o resultado
  resultDiv.scrollIntoView({ behavior: "smooth" });
}

// Listener para o formulário
document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    quizForm.addEventListener("submit", submitQuiz);
  }
});
