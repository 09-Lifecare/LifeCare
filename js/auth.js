// ========== DEMO ACCOUNTS - EDIT TO ADD MORE ==========
const demoAccounts = [
    { email: 'sarah@lifecare.com', password: 'password123', role: 'Nursing Student' },
    { email: 'john@lifecare.com', password: 'password123', role: 'Student' },
    { email: 'teacher@lifecare.com', password: 'password123', role: 'Teacher' }
];

// ========== CHECK IF USER IS LOGGED IN ==========
window.addEventListener('DOMContentLoaded', function() {
    updateUserDisplay();
});

function updateUserDisplay() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const userDisplay = document.getElementById('userDisplay');
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user && userDisplay) {
        userDisplay.textContent = `👤 ${user.name}`;
        if (loginLink) loginLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (userDisplay) userDisplay.textContent = '';
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// ========== LOGIN FUNCTION ==========
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    const user = demoAccounts.find(u => u.email === email && u.password === password);

    if (user) {
        const userData = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        alert('Login successful!');
        window.location.href = '../pages/dashboard.html';
    } else {
        alert('Invalid email or password. Try demo account:\nemail: sarah@lifecare.com\npassword: password123');
    }
}

// ========== SIGNUP FUNCTION ==========
function signup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const role = document.getElementById('signupRole').value;

    if (!name || !email || !password || !role) {
        alert('Please fill in all fields');
        return;
    }

    // Check if email already exists
    if (demoAccounts.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    // Add new account to demo accounts
    demoAccounts.push({ email: email, password: password, role: role });

    const userData = {
        id: Date.now(),
        name: name,
        email: email,
        role: role,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    alert('Account created and logged in successfully!');
    window.location.href = '../pages/dashboard.html';
}

// ========== LOGOUT FUNCTION ==========
function logout() {
    localStorage.removeItem('currentUser');
    alert('Logged out successfully');
    window.location.href = '../index.html';
}

// ========== TOGGLE BETWEEN LOGIN AND SIGNUP ==========
function toggleAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}
