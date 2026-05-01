// ========== CHECK IF USER IS LOGGED IN ==========
window.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        alert('Please login first');
        window.location.href = '../pages/login.html';
        return;
    }

    loadDashboard();
    initializeData();
});

// ========== INITIALIZE DATA ==========
function initializeData() {
    // Initialize tasks if empty
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify([
            { id: 1, name: 'Complete Assignment', priority: 'High', dueDate: '2026-05-10', completed: false },
            { id: 2, name: 'Study for Exam', priority: 'High', dueDate: '2026-05-15', completed: false }
        ]));
    }

    // Initialize health records if empty
    if (!localStorage.getItem('health')) {
        localStorage.setItem('health', JSON.stringify([
            { id: 1, bloodPressure: '120/80', symptoms: 'None', date: '2026-05-01' }
        ]));
    }

    // Initialize expenses if empty
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([
            { id: 1, amount: 50, category: 'Food', date: '2026-05-01' }
        ]));
    }

    // Initialize duties if empty
    if (!localStorage.getItem('duties')) {
        localStorage.setItem('duties', JSON.stringify([
            { id: 1, date: '2026-05-05', startTime: '08:00', endTime: '16:00', notes: 'Ward A' }
        ]));
    }
}

// ========== LOAD DASHBOARD ==========
function loadDashboard() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role;

    showDashboard(); // Load overview by default
}

// ========== NAVIGATE SECTIONS ==========
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard').classList.remove('hidden');
    loadOverview();
    setActive('dashboard-link');
}

function showHealth() {
    hideAllSections();
    document.getElementById('health').classList.remove('hidden');
    loadHealth();
    setActive('health-link');
}

function showTasks() {
    hideAllSections();
    document.getElementById('tasks').classList.remove('hidden');
    loadTasks();
    setActive('tasks-link');
}

function showExpenses() {
    hideAllSections();
    document.getElementById('expenses').classList.remove('hidden');
    loadExpenses();
    setActive('expenses-link');
}

function showDuty() {
    hideAllSections();
    document.getElementById('duty').classList.remove('hidden');
    loadDuty();
    setActive('duty-link');
}

function showProfile() {
    hideAllSections();
    document.getElementById('profile').classList.remove('hidden');
    loadProfile();
    setActive('profile-link');
}

function hideAllSections() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('health').classList.add('hidden');
    document.getElementById('tasks').classList.add('hidden');
    document.getElementById('expenses').classList.add('hidden');
    document.getElementById('duty').classList.add('hidden');
    document.getElementById('profile').classList.add('hidden');
}

function setActive(elementId) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(elementId).classList.add('active');
}

// ========== OVERVIEW / DASHBOARD ==========
function loadOverview() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const health = JSON.parse(localStorage.getItem('health')) || [];
    const duties = JSON.parse(localStorage.getItem('duties')) || [];

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const taskCount = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    document.getElementById('overviewContent').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="widget" style="background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%); color: white;">
                <h4>📋 Tasks</h4>
                <p style="font-size: 2rem; font-weight: bold;">${taskCount}</p>
                <p style="opacity: 0.9;">Completed: ${completedTasks}</p>
            </div>
            <div class="widget" style="background: linear-gradient(135deg, #27AE60 0%, #1E8449 100%); color: white;">
                <h4>💰 Expenses</h4>
                <p style="font-size: 2rem; font-weight: bold;">$${totalExpenses}</p>
                <p style="opacity: 0.9;">This month</p>
            </div>
            <div class="widget" style="background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%); color: white;">
                <h4>❤️ Health</h4>
                <p style="font-size: 2rem; font-weight: bold;">Good</p>
                <p style="opacity: 0.9;">Status</p>
            </div>
            <div class="widget" style="background: linear-gradient(135deg, #F39C12 0%, #D68910 100%); color: white;">
                <h4>📅 Duties</h4>
                <p style="font-size: 2rem; font-weight: bold;">${duties.length}</p>
                <p style="opacity: 0.9;">Scheduled</p>
            </div>
        </div>
    `;
}

// ========== TASKS ==========
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let html = `
        <div class="form-group">
            <input type="text" id="taskInput" placeholder="Add new task...">
            <button onclick="addTask()" class="btn-primary">Add Task</button>
        </div>
        <div>
    `;

    tasks.forEach(task => {
        const checked = task.completed ? 'checked' : '';
        html += `
            <div style="padding: 1rem; background: #f5f5f5; margin-bottom: 0.5rem; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <input type="checkbox" ${checked} onchange="toggleTask(${task.id})">
                    <span style="margin-left: 0.5rem;">${task.name}</span>
                    <span style="font-size: 0.8rem; color: #999; margin-left: 1rem;">Priority: ${task.priority}</span>
                    <span style="font-size: 0.8rem; color: #999; margin-left: 0.5rem;">Due: ${task.dueDate}</span>
                </div>
                <button onclick="deleteTask(${task.id})" style="background: #E74C3C; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Delete</button>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('tasksContent').innerHTML = html;
}

function addTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    if (!taskInput) {
        alert('Please enter a task');
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTask = {
        id: Date.now(),
        name: taskInput,
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('taskInput').value = '';
    loadTasks();
}

function toggleTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filtered));
    loadTasks();
}

// ========== HEALTH ==========
function loadHealth() {
    const health = JSON.parse(localStorage.getItem('health')) || [];
    let html = `
        <div class="form-group">
            <label>Blood Pressure</label>
            <input type="text" id="healthBP" placeholder="e.g., 120/80">
        </div>
        <div class="form-group">
            <label>Symptoms</label>
            <input type="text" id="healthSymptoms" placeholder="e.g., None, Headache">
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea id="healthNotes" placeholder="Add health notes..." style="width: 100%; padding: 0.8rem; border: 1px solid #E0E6ED; border-radius: 5px;"></textarea>
        </div>
        <button onclick="addHealth()" class="btn-primary">Save Health Record</button>
        
        <h3 style="margin-top: 2rem;">Recent Records</h3>
        <div>
    `;

    health.slice(-5).reverse().forEach(record => {
        html += `
            <div style="padding: 1rem; background: #f5f5f5; margin-bottom: 0.5rem; border-radius: 5px;">
                <p><strong>BP:</strong> ${record.bloodPressure}</p>
                <p><strong>Symptoms:</strong> ${record.symptoms}</p>
                <p><strong>Date:</strong> ${record.date}</p>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('healthContent').innerHTML = html;
}

function addHealth() {
    const bp = document.getElementById('healthBP').value.trim();
    const symptoms = document.getElementById('healthSymptoms').value.trim();
    const notes = document.getElementById('healthNotes').value.trim();

    if (!bp) {
        alert('Please enter blood pressure');
        return;
    }

    const health = JSON.parse(localStorage.getItem('health')) || [];
    const newRecord = {
        id: Date.now(),
        bloodPressure: bp,
        symptoms: symptoms || 'None',
        notes: notes,
        date: new Date().toISOString().split('T')[0]
    };

    health.push(newRecord);
    localStorage.setItem('health', JSON.stringify(health));
    loadHealth();
}

// ========== EXPENSES ==========
function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const budget = 500; // Example budget
    const remaining = budget - totalExpenses;

    let html = `
        <div style="padding: 1rem; background: #f5f5f5; border-radius: 5px; margin-bottom: 1rem;">
            <p><strong>Budget:</strong> $${budget}</p>
            <p><strong>Spent:</strong> $${totalExpenses}</p>
            <p><strong>Remaining:</strong> $${remaining} ${remaining < 0 ? '❌' : '✅'}</p>
        </div>

        <div class="form-group">
            <label>Amount</label>
            <input type="number" id="expenseAmount" placeholder="0.00">
        </div>
        <div class="form-group">
            <label>Category</label>
            <select id="expenseCategory">
                <option>Food</option>
                <option>Transport</option>
                <option>Medicine</option>
                <option>Books</option>
                <option>Other</option>
            </select>
        </div>
        <button onclick="addExpense()" class="btn-primary">Add Expense</button>

        <h3 style="margin-top: 2rem;">Recent Expenses</h3>
        <div>
    `;

    expenses.slice(-10).reverse().forEach(expense => {
        html += `
            <div style="padding: 1rem; background: #f5f5f5; margin-bottom: 0.5rem; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p><strong>$${expense.amount}</strong> - ${expense.category}</p>
                    <p style="font-size: 0.8rem; color: #999;">${expense.date}</p>
                </div>
                <button onclick="deleteExpense(${expense.id})" style="background: #E74C3C; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Delete</button>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('expensesContent').innerHTML = html;
}

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const newExpense = {
        id: Date.now(),
        amount: amount,
        category: category,
        date: new Date().toISOString().split('T')[0]
    };

    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    document.getElementById('expenseAmount').value = '';
    loadExpenses();
}

function deleteExpense(id) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const filtered = expenses.filter(e => e.id !== id);
    localStorage.setItem('expenses', JSON.stringify(filtered));
    loadExpenses();
}

// ========== DUTY ==========
function loadDuty() {
    const duties = JSON.parse(localStorage.getItem('duties')) || [];
    let html = `
        <div class="form-group">
            <label>Shift Date</label>
            <input type="date" id="dutyDate">
        </div>
        <div class="form-group">
            <label>Start Time</label>
            <input type="time" id="dutyStart">
        </div>
        <div class="form-group">
            <label>End Time</label>
            <input type="time" id="dutyEnd">
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea id="dutyNotes" placeholder="Ward A, ICU, etc..." style="width: 100%; padding: 0.8rem; border: 1px solid #E0E6ED; border-radius: 5px;"></textarea>
        </div>
        <button onclick="addDuty()" class="btn-primary">Add Duty</button>

        <h3 style="margin-top: 2rem;">Scheduled Duties</h3>
        <div>
    `;

    duties.forEach(duty => {
        html += `
            <div style="padding: 1rem; background: #f5f5f5; margin-bottom: 0.5rem; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p><strong>${duty.date}</strong></p>
                    <p>${duty.startTime} - ${duty.endTime}</p>
                    <p style="font-size: 0.9rem; color: #666;">${duty.notes}</p>
                </div>
                <button onclick="deleteDuty(${duty.id})" style="background: #E74C3C; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Delete</button>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('dutyContent').innerHTML = html;
}

function addDuty() {
    const date = document.getElementById('dutyDate').value;
    const startTime = document.getElementById('dutyStart').value;
    const endTime = document.getElementById('dutyEnd').value;
    const notes = document.getElementById('dutyNotes').value.trim();

    if (!date || !startTime || !endTime) {
        alert('Please fill in all fields');
        return;
    }

    const duties = JSON.parse(localStorage.getItem('duties')) || [];
    const newDuty = {
        id: Date.now(),
        date: date,
        startTime: startTime,
        endTime: endTime,
        notes: notes || 'No notes'
    };

    duties.push(newDuty);
    localStorage.setItem('duties', JSON.stringify(duties));
    document.getElementById('dutyDate').value = '';
    document.getElementById('dutyStart').value = '';
    document.getElementById('dutyEnd').value = '';
    document.getElementById('dutyNotes').value = '';
    loadDuty();
}

function deleteDuty(id) {
    const duties = JSON.parse(localStorage.getItem('duties')) || [];
    const filtered = duties.filter(d => d.id !== id);
    localStorage.setItem('duties', JSON.stringify(filtered));
    loadDuty();
}

// ========== PROFILE ==========
function loadProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('profileContent').innerHTML = `
        <div style="padding: 1rem;">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Member Since:</strong> ${new Date(user.loginTime).toLocaleDateString()}</p>
        </div>
    `;
}
