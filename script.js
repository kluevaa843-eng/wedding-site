document.addEventListener("DOMContentLoaded", () => {

    const intro = document.getElementById("intro");
    const openBtn = document.getElementById("openBtn");

    const sectionsOpen = document.querySelectorAll(".section");

    document.body.classList.add("lock");

    if (openBtn) {
        openBtn.addEventListener("click", (e) => {
            e.preventDefault();

            intro.classList.add("hide");
            document.body.classList.remove("lock");

            if (sectionsOpen.length > 0) {
                sectionsOpen[0].classList.add("show");
            }

            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

});
// 1. Появление секций
const sections = document.querySelectorAll(".section");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.2,
  }
);
sections.forEach((section) => {
  sectionObserver.observe(section);
});

// 2. Таймер
const weddingDate = new Date("2026-07-31T00:00:00").getTime();
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
function updateTimer() {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) {
    daysEl.innerText = "00";
    hoursEl.innerText = "00";
    minutesEl.innerText = "00";
    secondsEl.innerText = "00";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  daysEl.innerText = String(days).padStart(2, "0");
  hoursEl.innerText = String(hours).padStart(2, "0");
  minutesEl.innerText = String(minutes).padStart(2, "0");
  secondsEl.innerText = String(seconds).padStart(2, "0");
}
updateTimer();
setInterval(updateTimer, 1000);

// 3. Карта + пульс
const mapButton = document.getElementById("mapButton");
mapButton.href =
  "https://yandex.ru/maps/org/freedom/56916166864/?ll=50.157479%2C53.435706&z=16.28";

const locationSection = document.querySelector(".location");
const mapObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        mapButton.classList.add("pulse");
      } else {
        mapButton.classList.remove("pulse");
      }
    });
  },
  {
    threshold: 0.4,
  }
);

mapObserver.observe(locationSection);

//анкета


const quiz = document.querySelector(".quiz");
const openQuiz = document.getElementById("openQuiz");
const steps = document.querySelectorAll(".step");
const partnerStep = document.getElementById("partnerStep");

let currentStep = 0;
let hasPartner = false;
let sleepValue = "";

// открыть анкету
openQuiz.addEventListener("click", (e) => {
    e.preventDefault();
    quiz.style.display = "flex";
    showStep(0);
});



// показать шаг
function showStep(i) {
    steps.forEach(step => step.classList.remove("active"));
    if (steps[i]) steps[i].classList.add("active");
    currentStep = i;
}


function isValidName(value) {
    const regex = /^[А-Яа-яЁё\s-]+$/;
    return regex.test(value.trim()) && value.trim().length > 0;
}

function showError(input, message) {
    let error = input.parentElement.querySelector(".error-text");

    if (!error) {
        error = document.createElement("div");
        error.classList.add("error-text");
        input.parentElement.appendChild(error);
    }

    error.textContent = message;
    input.style.border = "1px solid red";
}

function clearError(input) {
    const error = input.parentElement.querySelector(".error-text");
    if (error) error.textContent = "";

    input.style.border = "";
}



function nextStep() {

    if (currentStep === 0) {

        const name = document.getElementById("name");
        const surname = document.getElementById("surname");

        let valid = true;

        if (!isValidName(name.value)) {
            showError(name, "Некорректно введены данные");
            valid = false;
        } else {
            clearError(name);
        }

        if (!isValidName(surname.value)) {
            showError(surname, "Некорректно введены данные");
            valid = false;
        } else {
            clearError(surname);
        }

        if (!valid) return;
    }

    if (currentStep === 2 && hasPartner) {

        const pName = document.getElementById("partnerName");
        const pSurname = document.getElementById("partnerSurname");

        let valid = true;

        if (!isValidName(pName.value)) {
            showError(pName, "Некорректно введены данные");
            valid = false;
        } else {
            clearError(pName);
        }

        if (!isValidName(pSurname.value)) {
            showError(pSurname, "Некорректно введены данные");
            valid = false;
        } else {
            clearError(pSurname);
        }

        if (!valid) return;
    }

    if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
    }
}


function choosePartner(value) {
    hasPartner = value;

    if (value) {
        showStep(2); 
    } else {
        showStep(3); 
    }
}


function finish(value) {
    sleepValue = value;
    showStep(4);
}

function closeQuiz() {
    quiz.style.display = "none";

   
    showStep(0);
}


document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
        clearError(input);
    });
});
async function sendForm() {

    const TOKEN = "ВСТА8774634069:AAFB05GvTfJxX-DtaKJOpscmxsAb3nSFv0U";
    const CHAT_ID = "679280367";

    const data = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        withPartner: hasPartner,
        partnerName: document.getElementById("partnerName")?.value || "",
        partnerSurname: document.getElementById("partnerSurname")?.value || "",
        sleep: sleepValue
    };

    const message = `
 Новая анкета:

Имя: ${data.name}
Фамилия: ${data.surname}

С парой: ${data.withPartner ? "Да" : "Нет"}

Партнёр: ${data.partnerName} ${data.partnerSurname}

Ночёвка: ${data.sleep}
`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        const result = await res.json();

        if (result.ok) {
            quiz.innerHTML = `
                <div class="step active">
                    <h2>Спасибо! Анкета отправлена </h2>
                    <button onclick="closeQuiz()">Вернуться</button>
                </div>
            `;
        } else {
            alert("Ошибка отправки");
        }

    } catch (err) {
        console.log(err);
        alert("Ошибка соединения");
    }
}