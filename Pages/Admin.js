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

let selectedCategory = '';
let selectedQuestionType = 'single';
let correctAnswers = new Set();
let currentFilter = 'all';

// ✅ Add Question to Firestore
async function addQuestion() {
  if (!selectedCategory) return alert('Please select a category first!');

  const questionText = document.getElementById('questionText').value.trim();
  const optionA = document.getElementById('optionA').value.trim();
  const optionB = document.getElementById('optionB').value.trim();
  const optionC = document.getElementById('optionC').value.trim();
  const optionD = document.getElementById('optionD').value.trim();

  if (!questionText || !optionA || !optionB) return alert('Please fill in at least question + options A & B!');
  if (selectedQuestionType !== 'two' && (!optionC || !optionD)) return alert('Please fill in all four options!');
  if (correctAnswers.size === 0) return alert('Please select at least one correct answer!');

  const questionData = {
    category: selectedCategory,
    type: selectedQuestionType,
    question: questionText,
    options: { A: optionA, B: optionB, C: optionC, D: optionD },
    correctAnswers: Array.from(correctAnswers),
    createdAt: new Date()
  };

  await addDoc(collection(db, "questions"), questionData);
  resetForm();
  loadQuestions();
}

// ✅ Load Questions from Firestore
async function loadQuestions() {
  const snapshot = await getDocs(collection(db, "questions"));
  let questions = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

  if (currentFilter !== 'all') {
    questions = questions.filter(q => q.category === currentFilter);
  }

  renderQuestionsList(questions);
}

// ✅ Render Questions in UI
function renderQuestionsList(questions) {
  const questionsList = document.getElementById('questionsList');
  questionsList.innerHTML = '';

  if (questions.length === 0) {
    questionsList.innerHTML = `<div class="text-center text-gray-500 py-8">📋 No questions yet</div>`;
    return;
  }

  questions.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
  questions.forEach(q => addQuestionToList(q));
}

// ✅ Add Question to List UI
function addQuestionToList(question) {
  const questionsList = document.getElementById('questionsList');
  const questionDiv = document.createElement('div');
  questionDiv.className = 'bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500';
  questionDiv.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <span class="text-xs font-medium px-3 py-1 rounded-full bg-white text-purple-600 border border-purple-200">
        ${question.category}
      </span>
      <button onclick="deleteQuestion('${question.id}')" class="text-red-500">🗑️ Delete</button>
    </div>
    <p class="text-sm font-medium text-gray-800 mb-2">${question.question}</p>
    <div class="flex justify-between text-xs text-gray-600">
      <span>${question.type}</span>
      <span class="font-medium text-green-600">✓ ${question.correctAnswers.join(', ')}</span>
    </div>
  `;
  questionsList.appendChild(questionDiv);
}

// ✅ Delete from Firestore
window.deleteQuestion = async function(id) {
  await deleteDoc(doc(db, "questions", id));
  loadQuestions();
};

// ✅ Reset Form
function resetForm() {
  document.getElementById('questionText').value = '';
  document.getElementById('optionA').value = '';
  document.getElementById('optionB').value = '';
  document.getElementById('optionC').value = '';
  document.getElementById('optionD').value = '';
  correctAnswers.clear();
  document.querySelectorAll('.option-card').forEach(card => card.classList.remove('correct'));
}

// ✅ Initial Load
loadQuestions();

// Hook your UI button
document.getElementById('addQuestionBtn').addEventListener('click', addQuestion);