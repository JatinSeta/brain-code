// ✅ Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBtiBdHwYCV7vkHiuGZvHij7UxphP4g54E",
  authDomain: "questionpro-99817.firebaseapp.com",
  projectId: "questionpro-99817",
  storageBucket: "questionpro-99817.appspot.com",
  messagingSenderId: "70423030493",
  appId: "1:70423030493:web:ae543436fc71bdab180934",
  measurementId: "G-LL4TBWBTML"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Variables
let selectedCategory = '';
let selectedAnswer = '';
const form = document.getElementById('questionForm');
const questionInput = document.getElementById('question');
const optionInputs = { A: optionA, B: optionB, C: optionC, D: optionD };
const questionsContainer = document.getElementById('questionsContainer');
const filterSelect = document.getElementById('filterCategory');

// ✅ Time
setInterval(() => liveTime.textContent = new Date().toLocaleTimeString(), 1000);

// ✅ Category Selection
document.querySelectorAll('.category-option').forEach(opt => opt.addEventListener('click', function () {
    document.querySelectorAll('.category-badge').forEach(b => b.classList.remove('ring-4'));
    this.querySelector('.category-badge').classList.add('ring-4');
    selectedCategory = this.dataset.category;
}));

// ✅ Answer Selection
document.querySelectorAll('.correct-option').forEach(opt => opt.addEventListener('click', function () {
    document.querySelectorAll('.correct-option div').forEach(d => d.classList.remove('bg-green-500'));
    this.querySelector('div').classList.add('bg-green-500');
    selectedAnswer = this.dataset.answer;
}));

// ✅ Submit Question
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const question = questionInput.value.trim();
    const options = {
        A: optionInputs.A.value.trim(),
        B: optionInputs.B.value.trim(),
        C: optionInputs.C.value.trim(),
        D: optionInputs.D.value.trim()
    };

    if (!selectedCategory) {
        showNotification('🎯 Please select a category first!', 'warning');
        return;
    }
    if (!question) {
        showNotification('❓ Don\'t forget to add your question!', 'warning');
        return;
    }
    if (!options.A || !options.B || !options.C || !options.D) {
        showNotification('📝 All four options are required!', 'warning');
        return;
    }
    if (!selectedAnswer) {
        showNotification('✅ Please select the correct answer!', 'warning');
        return;
    }

    try {
        // Save to Firestore
        await addDoc(collection(db, "questions"), {
            category: selectedCategory,
            question: question,
            options: options,
            correctAnswer: selectedAnswer,
            createdAt: new Date()
        });

        resetForm();
        displayQuestions();

    } catch (error) {
        console.error("Error adding document: ", error);
    }
});


// ✅ Load Questions
async function loadQuestions() {
    const filter = filterSelect.value;
    const snapshot = await getDocs(collection(db, "questions"));
    let questions = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    if (filter) questions = questions.filter(q => q.category === filter);

    questionsContainer.innerHTML = questions.map(q => `
        <div class="glass-card p-4 rounded-xl">
            <div class="flex justify-between">
                <strong>${q.category}</strong>
                <button onclick="deleteQuestion('${q.id}')" class="text-red-400">🗑️</button>
            </div>
            <p>${q.question}</p>
            ${Object.entries(q.options).map(([k, v]) => `<p>${k}: ${v}</p>`).join('')}
            <p>✅ ${q.correctAnswer}</p>
        </div>
    `).join('');
}

// ✅ Delete Question
window.deleteQuestion = async id => {
    await deleteDoc(doc(db, "questions", id));
    loadQuestions();
}

// ✅ Filter
filterSelect.addEventListener('change', loadQuestions);

// ✅ Initial Load
loadQuestions();

 document.getElementById('filterCategory').addEventListener('change', function() {
            const selectedCategory = this.value;
            const questions = document.querySelectorAll('#questionsContainer > div');
            
            questions.forEach(question => {
                if (selectedCategory === '' || question.textContent.toLowerCase().includes(selectedCategory)) {
                    question.style.display = 'block';
                } else {
                    question.style.display = 'none';
                }
            });
        });
function showNotification(message, type) {
  const container = document.getElementById('notificationContainer');
  const div = document.createElement('div');

  div.className = `rounded px-4 py-2 font-medium mb-2 shadow-lg ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    'bg-yellow-400 text-black'
  }`;

  div.textContent = message;
  container.appendChild(div);

  setTimeout(() => div.remove(), 4000);
}
