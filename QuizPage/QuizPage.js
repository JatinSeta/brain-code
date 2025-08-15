    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAA1XWqlQ0s_B2eEZAPSGR3heqag7e75ao",
      authDomain: "hosting-53303.firebaseapp.com",
      projectId: "hosting-53303",
      storageBucket: "hosting-53303.firebasestorage.app",
      messagingSenderId: "700756656592",
      appId: "1:700756656592:web:dce1541a8eaa8d301039d5",
      measurementId: "G-T247CL747W"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const questionEl = document.getElementById("question-text");
    const optionsEl = document.getElementById("options-container");
    const feedbackEl = document.getElementById("feedback");
    const nextBtn = document.getElementById("next-btn");
    const scoreBoxEl = document.getElementById("score");

    let questions = [];
    let index = 0;
    let score = 0;
    let answered = false;

    const category = "javascript"; // hardcoded category for demo

    async function loadQuestions() {
      try {
        const q = query(collection(db, "questions"), where("category", "==", category));
        const snap = await getDocs(q);
        questions = snap.docs.map(doc => doc.data());

        if (questions.length === 0) {
          questionEl.textContent = `❌ No questions found for "${category}"`;
          return;
        }
        showQuestion();
      } catch (err) {
        console.error("Firestore error:", err);
        questionEl.textContent = "⚠️ Error loading questions.";
      }
    }

    function showQuestion() {
      answered = false;
      feedbackEl.textContent = "";
      feedbackEl.className = "";
      nextBtn.style.display = "none";

      const q = questions[index];
      questionEl.textContent = q.question;
      optionsEl.innerHTML = "";

      const order = ['A', 'B', 'C', 'D'];
      order.forEach(key => {
        if (q.options && q.options[key]) {
          const btn = document.createElement("button");
          btn.className = "option-btn";
          btn.textContent = `${key}: ${q.options[key]}`;
          btn.onclick = () => handleAnswer(key, q.correctAnswer, btn);
          btn.setAttribute("aria-label", `Option ${key}: ${q.options[key]}`);
          optionsEl.appendChild(btn);
        }
      });
    }

    function handleAnswer(selected, correct, btn) {
      if (answered) return;
      answered = true;

      optionsEl.querySelectorAll("button").forEach(b => b.disabled = true);

      if (selected === correct) {
        btn.classList.add("correct");
        feedbackEl.textContent = "✅ Correct!";
        feedbackEl.classList.add("correct");
        score++;
      } else {
        btn.classList.add("wrong");
        feedbackEl.textContent = `❌ Correct answer: ${correct}`;
        feedbackEl.classList.add("wrong");

        optionsEl.querySelectorAll("button").forEach(b => {
          if (b.textContent.startsWith(`${correct}:`)) {
            b.classList.add("correct");
          }
        });
      }

      nextBtn.style.display = "inline-block";
    }

    nextBtn.addEventListener("click", () => {
      index++;
      if (index >= questions.length) {
        questionEl.textContent = "🎉 Quiz Completed!";
        optionsEl.innerHTML = "";
        feedbackEl.textContent = "";
        nextBtn.style.display = "none";

        scoreBoxEl.style.display = "block";
        scoreBoxEl.textContent = `🏆 Final Score: ${score} / ${questions.length}`;
      } else {
        showQuestion();
      }
    });

    loadQuestions();