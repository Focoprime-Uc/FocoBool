// ---------------------------
// IMPORTS
// ---------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, reload } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ---------------- FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyBKX2vhPtCg2viA1iBlpmW4VW6K1y3tXzA",
    authDomain: "vilankulos-5dfb1.firebaseapp.com",
    projectId: "vilankulos-5dfb1",
    storageBucket: "vilankulos-5dfb1.firebasestorage.app",
    messagingSenderId: "594610644591",
    appId: "1:594610644591:web:afd23c7d677dead9de8f9a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------------------
// LOGIN
// ---------------------------
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!email || !password){
        showFormAlert("Preencha email e senha.");
        return;
    }
    if(password.length < 6){
        showFormAlert("Senha mínima 6 caracteres.");
        return;
    }

    const btn = document.getElementById("loginBtn");
    btn.disabled = true;
    btn.innerHTML = `<div class="spinner"></div> Entrando...`;

    try{
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href="../index.html";
    } catch(e){
        btn.disabled = false;
        btn.innerHTML = "Iniciar Sessão";
        alert(e.message);
    }
});

// ---------------------------
// CRIAR CONTA
// ---------------------------
document.getElementById("createAccountBtn").addEventListener("click", async () => {
    const name = document.getElementById("newName").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value.trim();

    if(!name || !email || !password){
        showFormAlert("Preencha nome, email e senha.");
        return;
    }
    if(password.length < 6){
        showFormAlert("Senha mínima 6 caracteres.");
        return;
    }

    const btn = document.getElementById("createAccountBtn");
    btn.disabled = true;
    btn.innerHTML = `<div class="spinner"></div> Criando conta...`;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // --- FOTO BASE64 ---
        let photoBase64 = null;
        if(window.finalPhoto){
            photoBase64 = await fileToBase64(window.finalPhoto);
        }
        
        // Atualiza Auth com displayName e photoURL
        await updateProfile(user, {
            displayName: name
        });

        await reload(user);

        // Salva no Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            photo: photoBase64 || null,  // aqui garantimos Base64 ou null
            bairro: bairro || "",
            gender: gender || "",
            phone: phone || "",
            createdAt: serverTimestamp()
        });

        window.location.href="../index.html";

    } catch(e){
        btn.disabled = false;
        btn.innerHTML = "Criar Conta";
        alert(e.message);
    }
});

// ---------------------------
// UTILS
// ---------------------------

// Alerta do formulário
function showFormAlert(message){
    const alertBox = document.getElementById("formAlert");
    const alertText = document.getElementById("formAlertText");
    alertText.textContent = message;
    alertBox.classList.add("show");
    setTimeout(()=>{ alertBox.classList.remove("show"); },3000);
}

// Converte file em Base64
function fileToBase64(file){
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// ---------------------------
// FOTO UPLOAD
// ---------------------------
window.finalPhoto = null;

const input = document.getElementById("profilePhoto");
const preview = document.getElementById("photoPreview");
const progressRing = document.getElementById("progressRing");
const icon = document.querySelector(".photo-upload i");
const alertBox = document.getElementById("imageAlert");

function showImageAlert(){
    alertBox.classList.add("show");
    setTimeout(()=>{ alertBox.classList.remove("show"); },3000);
}

input.addEventListener("change", async () => {
    const file = input.files[0];
    if(!file) return;

    window.finalPhoto = file;
    let finalFile = file;

    // Compressão se > 1MB
    if(file.size > 1024 * 1024){
        showImageAlert();
        finalFile = await compressImage(file);
        window.finalPhoto = finalFile;
    }

    // Preview com progresso
    progressRing.style.display = "block";
    let progress = 0;
    const reader = new FileReader();

    reader.onload = () => {
        const interval = setInterval(()=>{
            progress += 4;
            let deg = progress * 3.6;
            progressRing.style.background = `conic-gradient(#ff2c2c ${deg}deg, #e6e6e6 ${deg}deg)`;
            if(progress >= 100){
                clearInterval(interval);
                preview.src = reader.result;
                preview.style.display = "block";
                icon.style.display = "none";
                setTimeout(()=>{ progressRing.style.display = "none"; },300);
            }
        },30);
    };

    reader.readAsDataURL(finalFile);
});

// Compressão de imagem
async function compressImage(file){
    return new Promise((resolve)=>{
        const img = new Image();
        const reader = new FileReader();

        reader.onload = e => img.src = e.target.result;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const size = Math.min(img.width, img.height);
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            const maxSize = 600;
            canvas.width = maxSize;
            canvas.height = maxSize;

            ctx.drawImage(img, sx, sy, size, size, 0, 0, maxSize, maxSize);

            let quality = 0.9;
            function tryCompress(){
                canvas.toBlob(blob=>{
                    if(blob.size <= 400 * 1024 || quality <= 0.3){
                        resolve(blob);
                    }else{
                        quality -= 0.1;
                        tryCompress();
                    }
                }, "image/jpeg", quality);
            }
            tryCompress();
        };

        reader.readAsDataURL(file);
    });
}