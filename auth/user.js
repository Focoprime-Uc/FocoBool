import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Config Firebase (mesma do login)
const firebaseConfig = {
    apiKey: "AIzaSyBKX2vhPtCg2viA1iBlpmW4VW6K1y3tXzA",
    authDomain: "vilankulos-5dfb1.firebaseapp.com",
    projectId: "vilankulos-5dfb1",
    storageBucket: "vilankulos-5dfb1.firebasestorage.app",
    messagingSenderId: "594610644591",
    appId: "1:594610644591:web:afd23c7d677dead9de8f9a"
};

const app = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------------------
// VERIFICA LOGIN
// ---------------------------
onAuthStateChanged(auth, async (user) => {
    const userDiv = document.querySelector('.user');

    if(user){
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            const data = docSnap.data();

            // ELEMENTOS
            const nameEl = document.getElementById("settingsName");
            const emailEl = document.getElementById("settingsEmail");
            const phoneEl = document.getElementById("settingsPhone");
            const birthEl = document.getElementById("settingsBirth");
            const photoEl = document.getElementById("settingsPhoto");

            // DADOS
            if(nameEl) nameEl.textContent = data.name || "Sem nome";
            if(emailEl) emailEl.textContent = data.email || "Sem email";
            if(phoneEl) phoneEl.textContent = "Telefone: " + (data.phone || "Não definido");
            if(birthEl) birthEl.textContent = "Nascimento: " + data.birthDate || "Não definido";

            // FOTO
            if(photoEl){
                photoEl.src = data.photo && data.photo.trim() !== "" 
                  ? data.photo 
                  : "images/avatar.png";
            }

            // ✅ BADGE VERIFICADO
            if(data.verified === true){
                const badge = document.querySelector('.verified');
                if(badge) badge.style.display = "inline-block";
            }

            // ✅ REMOVE SKELETON
            removeSkeleton();
        }

    } else {
        window.location.href = "login/login.html";
    }
});

function removeSkeleton(){
  document.querySelectorAll('.skeleton').forEach(el=>{
    el.classList.remove('skeleton');
  });
}

// BOTÃO DE SAIR
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login/login.html";
});
