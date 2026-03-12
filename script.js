document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const dateDisplay = document.getElementById('date-display');
    const clockDisplay = document.getElementById('clock-display');
    const mainTimer = document.getElementById('main-timer');
    const timelineContainer = document.getElementById('timeline-container');
    const currentTaskTitle = document.getElementById('current-task');
    const currentStateBadge = document.getElementById('current-state-badge');
    const currentBlockTime = document.getElementById('current-block-time');
    const nextBlockTime = document.getElementById('next-block-time');
    const blockProgress = document.getElementById('block-progress');
    const systemLog = document.getElementById('system-log');
    const blockStatusText = document.getElementById('block-status-text');

    // Overtime
    const overtimePanel = document.getElementById('overtime-panel');
    const otReason = document.getElementById('ot-reason');
    const btnConfirmOt = document.getElementById('btn-confirm-ot');
    const otBtns = document.querySelectorAll('.ot-btn');

    // Checklists
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Priority
    const priorityLevels = document.querySelectorAll('.pc-level');
    
    // Craving
    const cravingBtnSmoke = document.getElementById('craving-btn-smoke');
    const cravingBtnCaffeine = document.getElementById('craving-btn-caffeine');
    const cravingButtons = document.querySelector('.craving-buttons');
    const cravingSteps = document.getElementById('craving-steps');
    const cravingActions = document.getElementById('craving-actions');
    const btnDefeated = document.getElementById('craving-defeated');
    const btnStill = document.getElementById('craving-still');
    const statCravings = document.getElementById('stats-cravings');
    const statDefeated = document.getElementById('stats-defeated');

    // --- State & Config ---
    const USER_CONFIGS = {
        kevin: {
            role: 'COMMANDER',
            focusOptions: [
                { id: 'j', label: 'J' },
                { id: 'radar', label: 'RADAR' },
                { id: 'innova', label: 'INNOVA' },
                { id: 'yo', label: 'YO' }
            ],
            schedule: [
                // 3:00 - 4:00 MORNING RESET
                { start: 3.0, end: 3.5, title: 'MORNING RESET', type: 'rutina', focus: 'yo' },
                { start: 3.5, end: 4.0, title: 'MORNING RESET', type: 'rutina', focus: 'yo' },
                // 4:00 - 6:00 DEEP WORK
                { start: 4.0, end: 4.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 4.5, end: 5.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 5.0, end: 5.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 5.5, end: 6.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                // 6:00 - 7:00 EXERCISE
                { start: 6.0, end: 6.5, title: 'EXERCISE', type: 'salud', focus: 'yo' },
                { start: 6.5, end: 7.0, title: 'EXERCISE', type: 'salud', focus: 'yo' },
                // 7:00 - 19:00 DEEP WORK (12 hours -> 24 blocks)
                { start: 7.0, end: 7.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 7.5, end: 8.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 8.0, end: 8.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 8.5, end: 9.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 9.0, end: 9.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 9.5, end: 10.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 10.0, end: 10.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 10.5, end: 11.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 11.0, end: 11.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 11.5, end: 12.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 12.0, end: 12.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 12.5, end: 13.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 13.0, end: 13.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 13.5, end: 14.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 14.0, end: 14.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 14.5, end: 15.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 15.0, end: 15.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 15.5, end: 16.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 16.0, end: 16.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 16.5, end: 17.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 17.0, end: 17.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 17.5, end: 18.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 18.0, end: 18.5, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 18.5, end: 19.0, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                // 19:00 - 20:00 FINAL FOCUS
                { start: 19.0, end: 19.5, title: 'FINAL FOCUS', type: 'cierre', focus: 'j' },
                { start: 19.5, end: 20.0, title: 'FINAL FOCUS', type: 'cierre', focus: 'j' },
                // 20:00 - 27:00 SLEEP MODE
                { start: 20.0, end: 27.0, title: 'SLEEP MODE', type: 'descanso', focus: 'off' }
            ]
        },
        karol: {
            role: 'ARCHITECT',
            focusOptions: [
                { id: 'bebe', label: 'BEBÉ' },
                { id: 'calidad', label: 'TRABAJO' },
                { id: 'aseo', label: 'ASEO' },
                { id: 'comida', label: 'COMIDA' },
                { id: 'yo', label: 'TIEMPO MÍO' },
                { id: 'gatos', label: 'GATOS' }
            ],
            schedule: [
                { start: 6, end: 7, title: 'TIEMPO DE THIAGO', type: 'rutina', focus: 'bebe' },
                { start: 7, end: 8, title: 'TIEMPO DE ASEO', type: 'personal', focus: 'aseo' },
                { start: 8, end: 8.5, title: 'TIEMPO DE KAROL', type: 'personal', focus: 'yo' },
                { start: 8.5, end: 9, title: 'TIEMPO DE THIAGO', type: 'rutina', focus: 'bebe' },
                { start: 9, end: 10, title: 'TIEMPO DE TRABAJO', type: 'trabajo', focus: 'calidad' },
                { start: 10, end: 10.5, title: 'TIEMPO DE THIAGO', type: 'rutina', focus: 'bebe' },
                { start: 10.5, end: 11, title: 'TIEMPO DE ASEO', type: 'personal', focus: 'aseo' },
                { start: 11, end: 12, title: 'TIEMPO DE TRABAJO', type: 'trabajo', focus: 'calidad' },
                { start: 12, end: 12.5, title: 'TIEMPO DE THIAGO', type: 'rutina', focus: 'bebe' },
                { start: 12.5, end: 13.5, title: 'TIEMPO DE TRABAJO', type: 'trabajo', focus: 'calidad' },
                { start: 13.5, end: 14, title: 'TIEMPO DE KAROL', type: 'personal', focus: 'yo' },
                { start: 14, end: 14.5, title: 'TIEMPO DE THIAGO', type: 'rutina', focus: 'bebe' },
                { start: 14.5, end: 16, title: 'TIEMPO DE TRABAJO', type: 'trabajo', focus: 'calidad' },
                { start: 16, end: 16.5, title: 'TIEMPO DE THIAGO', type: 'rutina', focus: 'bebe' },
                { start: 16.5, end: 17, title: 'TIEMPO DE GATOS', type: 'personal', focus: 'gatos' },
                { start: 17, end: 18, title: 'TIEMPO DE TRABAJO', type: 'trabajo', focus: 'calidad' },
                { start: 18, end: 20, title: 'TIEMPO LIBRE / CENA', type: 'personal', focus: 'comida' },
                { start: 20, end: 27, title: 'DESCANSO', type: 'descanso', focus: 'off' }
            ],
            uiTweaks: {
                caffeineTitle: 'DULCE TRACKER',
                caffeineItems: [
                    { id: 'dulce-fruit', label: 'FRUTA (OK)' },
                    { id: 'dulce-salty', label: 'COMIDA SALADA (OK)' },
                    { id: 'dulce-water1', label: '1L AGUA' },
                    { id: 'dulce-water2', label: '2L AGUA' }
                ],
                cravingTitle: 'PROTOCOLO ANTI-SCROLL',
                cravingBtnText: 'QUIERO SCROLLEAR',
                cravingSteps: [
                    { id: 'step-tut1', text: '1. BUSCA UN TUTORIAL (2m)', time: 120000 },
                    { id: 'step-tut2', text: '2. MIRA EFECTOS CAPCUT (5m)', time: 300000 },
                    { id: 'step-tut3', text: '3. PRACTICA EDICIÓN (10m)', time: 600000 }
                ]
            }
        }
    };

    let currentUser = null;
    let CONFIG = { schedule: [] }; // Will be populated on login

    let appState = {
        currentFocus: 'j', 
        priorities: {}, // Will be dynamic
        cravingStats: { total: 0, defeated: 0 },
        checklist: {},
        historyLog: [],
        lastLogHour: -1,
        blockState: {},
        overtime: null,
        level: 1,
        strikes: 0,
        activeMinutes: 0, // Track active minutes for leveling up
        lastDate: null, // For daily reset logic
        dailyConfirmed: false // Requires at least one confirmation per day
    };
    
    // --- Login Logic ---
    window.selectUser = (userKey) => {
        const msg = document.getElementById('system-msg');
        msg.textContent = `AUTENTICANDO ${userKey.toUpperCase()}...`;
        msg.style.color = "#fff";
        
        setTimeout(() => {
            msg.textContent = "ACCESO CONCEDIDO";
            document.getElementById('login-screen').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('main-app').classList.remove('hidden');
                initializeUser(userKey);
            }, 800);
        }, 1000);
    };

    function initializeUser(userKey) {
        currentUser = userKey;
        const userConf = USER_CONFIGS[userKey];
        CONFIG.schedule = userConf.schedule;
        
        // UI Updates
        document.getElementById('display-role').textContent = userConf.role;
        // Update avatar in header based on user
        const avatarEl = document.getElementById('display-avatar');
        if (userKey === 'kevin') {
            avatarEl.style.backgroundImage = "url('https://i.postimg.cc/Mpb2NVZJ/images-(1).jpg')";
        } else {
            avatarEl.style.backgroundImage = "url('https://i.postimg.cc/j5GRtTGy/Captura-de-pantalla-2026-03-08-001654.jpg')";
        }
        avatarEl.style.backgroundSize = "cover";
        avatarEl.textContent = ""; // Clear text K
        
        // Setup Focus Buttons
        const focusList = document.getElementById('focus-list');
        focusList.innerHTML = '';
        userConf.focusOptions.forEach((opt, idx) => {
            const div = document.createElement('div');
            div.className = `focus-btn ${idx===0?'active':''}`;
            div.dataset.focus = opt.id;
            div.innerHTML = `
                <span class="focus-key">0${idx+1}</span>
                <span class="focus-label">${opt.label}</span>
            `;
            div.addEventListener('click', handleFocusClick);
            focusList.appendChild(div);
        });
        
        // Setup Priority List
        const priorityList = document.getElementById('priority-list');
        priorityList.innerHTML = '';
        appState.priorities = {}; // Reset priorities for new user
        
        userConf.focusOptions.forEach(opt => {
            appState.priorities[opt.id] = 1; // Default
            
            const item = document.createElement('div');
            item.className = 'p-control-item';
            item.dataset.focus = opt.id;
            item.innerHTML = `
                <span class="pc-name">${opt.label}</span>
                <div class="pc-level-selector">
                    <span class="pc-level" data-level="1">1</span>
                    <span class="pc-level" data-level="2">2</span>
                    <span class="pc-level" data-level="3">3</span>
                    <span class="pc-level" data-level="4">4</span>
                </div>
            `;
            // Add listeners
            item.querySelectorAll('.pc-level').forEach(lvl => {
                lvl.addEventListener('click', handlePriorityClick);
            });
            priorityList.appendChild(item);
        });

        // Apply UI Tweaks if any
        if (userConf.uiTweaks) {
            applyUiTweaks(userConf.uiTweaks);
        } else {
            resetUiTweaks();
        }

        // Set default focus
        appState.currentFocus = userConf.focusOptions[0].id;
        
        // Load specific state if exists
        loadState(userKey);
        
        // Start System
        updateTime();
        renderTimeline();
        
        // Start Notifications
        requestNotificationPermission();
        startMatrixReminders();
    }
    
    function updateLevelUI() {
        document.getElementById('user-level').textContent = appState.level || 1;
        document.getElementById('user-strikes').textContent = appState.strikes || 0;
    }

    function addStrike() {
        appState.strikes = (appState.strikes || 0) + 1;
        addLogEntry("⚠️ SISTEMA: FALLO REGISTRADO (+1 STRIKE)");
        
        if (appState.strikes >= 100) {
            appState.level = 1;
            appState.strikes = 0;
            addLogEntry("⚠️ SISTEMA CRÍTICO: NIVEL REINICIADO");
            alert("LÍMITE DE FALLOS ALCANZADO. NIVEL REINICIADO.");
        }
        
        updateLevelUI();
        saveState();
    }

    function checkLevelProgress() {
        // Called every minute if block is active
        appState.activeMinutes = (appState.activeMinutes || 0) + 1;
        
        if (appState.activeMinutes >= 30) {
            appState.level = (appState.level || 1) + 1;
            appState.activeMinutes = 0;
            addLogEntry("⭐ SISTEMA: NIVEL AUMENTADO (" + appState.level + ")");
            // Visual feedback?
        }
        updateLevelUI();
        saveState();
    }
    
    function applyUiTweaks(tweaks) {
        // Caffeine -> Dulce
        if (tweaks.caffeineTitle) {
            const caffPanel = document.querySelectorAll('.tracker-panel')[1];
            if (caffPanel) {
                caffPanel.querySelector('.mini-title').textContent = tweaks.caffeineTitle;
                const checklist = caffPanel.querySelector('.checklist');
                checklist.innerHTML = ''; // Clear existing
                tweaks.caffeineItems.forEach(item => {
                    const label = document.createElement('label');
                    label.className = 'check-item';
                    label.innerHTML = `
                        <input type="checkbox" id="${item.id}">
                        <span class="checkmark"></span>
                        <span class="check-text">${item.label}</span>
                    `;
                    checklist.appendChild(label);
                });
            }
        }
        
        // Craving -> Scroll
        if (tweaks.cravingTitle) {
            const cravingPanel = document.querySelector('.craving-panel');
            cravingPanel.querySelector('.panel-title').textContent = tweaks.cravingTitle;
            
            // For Karol/Custom, we assume single button mode for now or specific config
            if (cravingBtnSmoke) {
                cravingBtnSmoke.textContent = tweaks.cravingBtnText;
                cravingBtnSmoke.classList.remove('hidden');
            }
            if (cravingBtnCaffeine) {
                cravingBtnCaffeine.classList.add('hidden'); // Hide caffeine for custom mode by default
            }
            
            // Update steps dynamically when run
            appState.customCravingSteps = tweaks.cravingSteps;
        }
    }

    function resetUiTweaks() {
        // Reset to default (Kevin's view)
        const caffPanel = document.querySelectorAll('.tracker-panel')[1];
        if (caffPanel) {
            caffPanel.querySelector('.mini-title').textContent = 'CAFFEINE TRACKER';
            caffPanel.querySelector('.checklist').innerHTML = `
                <label class="check-item"><input type="checkbox" id="caff-morning"><span class="checkmark"></span><span class="check-text">MAÑANA (½)</span></label>
                <label class="check-item"><input type="checkbox" id="caff-workout"><span class="checkmark"></span><span class="check-text">POST ENTRENAMIENTO (½)</span></label>
                <label class="check-item"><input type="checkbox" id="caff-3pm"><span class="checkmark"></span><span class="check-text">3 PM (½)</span></label>
                <label class="check-item"><input type="checkbox" id="caff-6pm"><span class="checkmark"></span><span class="check-text">6 PM (½)</span></label>
            `;
        }
        
        const cravingPanel = document.querySelector('.craving-panel');
        cravingPanel.querySelector('.panel-title').textContent = 'PROTOCOLO ANTI-CRAVING';
        
        if (cravingBtnSmoke) {
            cravingBtnSmoke.textContent = 'QUIERO FUMAR';
            cravingBtnSmoke.classList.remove('hidden');
        }
        if (cravingBtnCaffeine) {
            cravingBtnCaffeine.textContent = 'QUIERO CAFEÍNA';
            cravingBtnCaffeine.classList.remove('hidden');
        }
        
        appState.customCravingSteps = null;
    }
    
    function handleFocusClick(e) {
        const btn = e.currentTarget;
        document.querySelectorAll('.focus-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        appState.currentFocus = btn.dataset.focus;
        saveState();
        addLogEntry(`CAMBIO DE ENFOQUE: ${btn.querySelector('.focus-label').textContent}`);
    }
    
    function handlePriorityClick(e) {
        const level = parseInt(e.target.dataset.level);
        const parent = e.target.closest('.p-control-item');
        const focus = parent.dataset.focus;
        
        appState.priorities[focus] = level;
        saveState();
        
        parent.querySelectorAll('.pc-level').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
    }

    // Load from LocalStorage
    const loadState = (userKey) => {
        const key = `nexus_state_v4_${userKey}`; // Updated to v4 for history reset
        const saved = localStorage.getItem(key);
        const today = new Date().toDateString();

        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge carefully to not overwrite config
            appState = { ...appState, ...parsed };
            // Ensure proper structures
            if (!appState.blockState) appState.blockState = {};
            
            // Check Daily Reset
            if (appState.lastDate !== today) {
                console.log("New Day Detected: Resetting Daily Progress");
                appState.lastDate = today;
                appState.dailyConfirmed = false;
                appState.blockState = {}; // Clear previous day's blocks
                appState.activeMinutes = 0;
                
                // appState.level = 1; // Optional: Reset level daily? User said "each day must update to level up".
                // We'll keep level but require confirmation to proceed.
                addLogEntry("SISTEMA: NUEVO DÍA DETECTADO. CONFIRMA ACTIVIDAD.");
            }

            // Restore UI
            updatePriorityUI();
            updateCravingStats();
            restoreChecklists();
            restoreLog();
        } else {
            // New user state (or reset)
            appState.lastDate = today;
            appState.dailyConfirmed = false;
            restoreLog(); // Init empty log
        }
        
        updateLevelUI();
    };

    const saveState = () => {
        if (!currentUser) return;
        localStorage.setItem(`nexus_state_v4_${currentUser}`, JSON.stringify(appState));
    };
    
    // --- Matrix Rain Effect ---
    function initMatrixRain() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('matrix-rain');
        container.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = "01010101 NEXUS SYSTEM KAROL KEVIN 01";
        const charArray = chars.split("");
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) drops[i] = 1;

        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#222"; // Very dark grey/white for monochrome look
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                // Randomly white for glint
                ctx.fillStyle = Math.random() > 0.95 ? "#fff" : "#333";
                
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(draw, 33);
    }
    
    // Init rain on load
    initMatrixRain();

    // --- Core Logic ---

    function getBlockForTime(decimalTime) {
        if (!CONFIG.schedule.length) return null;
        // Handle 00-03 as 24-27 for easier calculation
        let checkTime = decimalTime < 3 ? decimalTime + 24 : decimalTime;
        return CONFIG.schedule.find(b => checkTime >= b.start && checkTime < b.end);
    }

    function updateTime() {
        const now = new Date();
        let hour = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();
        
        // --- Clock & Date ---
        const hStr = String(hour).padStart(2, '0');
        const mStr = String(min).padStart(2, '0');
        
        clockDisplay.textContent = `${hStr}:${mStr}`;
        
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const dateStr = now.toLocaleDateString('en-CA', options).replace(/-/g, '.');
        dateDisplay.innerHTML = `${dateStr} <span class="mobile-clock-time" style="margin-left: 10px;">${hStr}:${mStr}</span>`;

        // --- Block Logic ---
        const isSleepMode = (hour >= 20 || hour < 3) && !appState.overtime?.active;

        if (isSleepMode) {
            document.body.classList.add('sleep-mode');
            currentTaskTitle.textContent = "DAY COMPLETE - SLEEP MODE";
            currentStateBadge.textContent = "OFFLINE";
            mainTimer.textContent = "ZZ:ZZ:ZZ";
            currentBlockTime.textContent = "20:00 - 03:00";
            nextBlockTime.textContent = "03:00 - 04:00";
            document.querySelector('.live-indicator').style.opacity = '0.3';
            
            document.getElementById('task-confirmation-controls').classList.add('hidden');
            blockStatusText.textContent = "SLEEPING";
            
            // Show Overtime Unlock if not active
            overtimePanel.classList.remove('hidden');

        } else if (appState.overtime?.active) {
            // --- OVERTIME MODE ---
            document.body.classList.remove('sleep-mode');
            overtimePanel.classList.add('hidden');
            
            const otEnd = new Date(appState.overtime.startTime);
            otEnd.setMinutes(otEnd.getMinutes() + appState.overtime.duration);
            
            if (now >= otEnd) {
                // Overtime finished
                appState.overtime.active = false;
                addLogEntry("OVERTIME FINALIZADO");
                saveState();
            } else {
                currentTaskTitle.textContent = "OVERTIME: " + appState.overtime.reason;
                currentStateBadge.textContent = "EXTRA WORK";
                blockStatusText.textContent = "OVERRIDE ACTIVE";
                
                const diff = otEnd - now;
                const tm = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const ts = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
                mainTimer.textContent = `00:${tm}:${ts}`;
                
                const totalDur = appState.overtime.duration * 60 * 1000;
                const progress = ((totalDur - diff) / totalDur) * 100;
                blockProgress.style.width = `${progress}%`;
            }
        } else {
            // --- NORMAL MODE ---
            document.body.classList.remove('sleep-mode');
            overtimePanel.classList.add('hidden');
            
            const decimalTime = hour + (min / 60);
            const currentBlock = getBlockForTime(decimalTime);
            
            if (currentBlock) {
                currentTaskTitle.textContent = currentBlock.title;
                currentStateBadge.textContent = currentBlock.type.toUpperCase();
                
                // Format times for display
                const formatTime = (t) => {
                    const h = Math.floor(t);
                    const m = Math.round((t - h) * 60);
                    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                };
                
                currentBlockTime.textContent = `${formatTime(currentBlock.start)} - ${formatTime(currentBlock.end)}`;
                
                let nextStart = currentBlock.end;
                if (nextStart >= 24) nextStart -= 24;
                nextBlockTime.textContent = formatTime(nextStart);

                // Timer
                const endTime = currentBlock.end < 3 ? currentBlock.end + 24 : currentBlock.end;
                const endDate = new Date(now);
                endDate.setHours(Math.floor(endTime), Math.round((endTime - Math.floor(endTime)) * 60), 0, 0);
                
                // If end date is tomorrow (crossing midnight for real)
                if (endTime >= 24 && now.getHours() < 3) {
                     // logic handled by >= 24 check basically
                } else if (endTime >= 24) {
                    // Current time is late (e.g. 23:00), end is 25 (01:00)
                    // No special adjustment needed for Date object if we add hours correctly? 
                    // Date setHours handles overflow (25 hours -> 1 am next day) automatically
                }
                
                const diff = endDate - now;
                // Avoid negative timer if slight sync issue
                if (diff < 0) {
                     mainTimer.textContent = "00:00:00";
                } else {
                    const th = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'); // Add hours
                    const tm = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                    const ts = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
                    mainTimer.textContent = `${th}:${tm}:${ts}`;
                }

                // Progress
                const blockDuration = (currentBlock.end - currentBlock.start) * 60; // minutes
                const elapsed = (decimalTime - currentBlock.start) * 60;
                const progress = (elapsed / blockDuration) * 100;
                blockProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
                
                // --- BLOCK TRACKING LOGIC ---
                const blockKey = String(currentBlock.start); // Use start time as key
                
                // Initialize if new block
                if (!appState.blockState[blockKey]) {
                    appState.blockState[blockKey] = { status: 'awaiting', delay: 0 };
                    saveState();
                    // Reset confirmation buttons visibility
                    document.getElementById('task-confirmation-controls').classList.remove('hidden');
                    const btn = document.getElementById('btn-confirm-task');
                    btn.textContent = "CONFIRMAR TAREA";
                    btn.classList.remove('hidden');
                }
                
                const bState = appState.blockState[blockKey];
                
                // Check Level Progress
                if (bState.status === 'active') {
                    if (sec === 0) { // Check once per minute
                        checkLevelProgress();
                    }
                }
                
                let statusLabel = "UNKNOWN";
                if (bState.status === 'awaiting') statusLabel = "ESPERANDO CONFIRMACIÓN";
                if (bState.status === 'active') statusLabel = "ACTIVO - EN PROGRESO";
                if (bState.status === 'delayed') statusLabel = "RETRASADO";
                if (bState.status === 'skipped') statusLabel = "SKIPPED";
                if (bState.status === 'completed') statusLabel = "COMPLETADO";
                
                blockStatusText.textContent = statusLabel;
                
                // Hide confirmation controls if confirmed
                if (bState.confirmed) {
                     document.getElementById('task-confirmation-controls').classList.add('hidden');
                } else {
                     document.getElementById('task-confirmation-controls').classList.remove('hidden');
                }
            }
        }

        // --- Hourly Log & Reset (Simplified for now) ---
        // Logic to log finished blocks... complicated with variable times. 
        // For now, rely on manual confirmation or just state updates.
        // We can track "lastLoggedBlock" instead of lastLogHour
    }

    // --- Block Actions (REMOVED) ---
    // Listeners for start/delay/skip/complete removed.

    // --- Task Confirmation Logic ---
    const btnConfirmTask = document.getElementById('btn-confirm-task');
    const btnProcrastinated = document.getElementById('btn-procrastinated');

    btnConfirmTask.addEventListener('click', () => {
        const now = new Date();
        const decimalTime = now.getHours() + (now.getMinutes() / 60);
        const currentBlock = getBlockForTime(decimalTime);
        
        if (!currentBlock) return;
        
        const blockKey = String(currentBlock.start);
        
        // Initialize block state if missing
        if (!appState.blockState[blockKey]) {
             appState.blockState[blockKey] = { status: 'awaiting' };
        }

        // Check if already confirmed for this block
        if (appState.blockState[blockKey].confirmed) {
            alert("Tarea ya confirmada para este bloque.");
            return;
        }

        // Daily Confirmation Logic
        if (!appState.dailyConfirmed) {
            appState.dailyConfirmed = true;
            addLogEntry("SISTEMA: PRIMERA CONFIRMACIÓN DEL DÍA. REGISTRO ACTIVO.");
        }

        // Increase level
        appState.level = (appState.level || 1) + 1;
        
        // Mark as confirmed for this block
        appState.blockState[blockKey] = { ...appState.blockState[blockKey], confirmed: true, status: 'active' };

        addLogEntry(`TAREA CONFIRMADA: NIVEL ${appState.level}`);
        updateLevelUI();
        saveState();
        
        // Visual feedback
        btnConfirmTask.textContent = "CONFIRMADO ✓";
        setTimeout(() => btnConfirmTask.textContent = "CONFIRMAR TAREA", 2000);
        
        // Force timeline update to show active state
        renderTimeline();
        // Force update UI immediately to hide buttons
        updateTime();
    });

    btnProcrastinated.addEventListener('click', () => {
        // Reset level
        appState.level = 1;
        addLogEntry("PROCRASTINACIÓN DETECTADA: NIVEL REINICIADO");
        updateLevelUI();
        saveState();
        alert("NIVEL REINICIADO A 1. ¡ENFÓCATE!");
    });

    // function setBlockEndStatus(status) { ... } // Removed

    // --- Overtime Logic ---
    let selectedOtMin = 0;
    otBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            otBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedOtMin = parseInt(btn.dataset.min);
        });
    });

    btnConfirmOt.addEventListener('click', () => {
        if (selectedOtMin === 0) {
            alert("Selecciona duración");
            return;
        }
        if (otReason.value.trim() === "") {
            alert("Ingresa una razón");
            return;
        }
        
        appState.overtime = {
            active: true,
            startTime: Date.now(),
            duration: selectedOtMin,
            reason: otReason.value
        };
        saveState();
        addLogEntry(`OVERTIME ACTIVADO: ${selectedOtMin} MIN - ${otReason.value}`);
        updateTime();
    });

    function renderTimeline() {
        const now = new Date();
        const decimalTime = now.getHours() + (now.getMinutes() / 60);
        
        timelineContainer.innerHTML = '';

        if (!CONFIG.schedule || CONFIG.schedule.length === 0) return;

        CONFIG.schedule.forEach(block => {
            // Skip Sleep Mode blocks in timeline if desired, or show them. 
            // Usually we show active day. 
            if (block.type === 'descanso' && block.start >= 20) return; // Hide night sleep

            const div = document.createElement('div');
            div.className = 'timeline-item';
            
            // Determine Visual State from blockState history
            const blockKey = String(block.start);
            const bState = appState.blockState[blockKey];
            let visualClass = 'pending';
            
            // Check if active
            const isActive = decimalTime >= block.start && decimalTime < block.end;
            const isPast = decimalTime >= block.end;
            
            if (isActive) {
                visualClass = 'active';
            } else if (isPast) {
                if (bState) {
                    if (bState.status === 'completed') visualClass = 'completed';
                    else if (bState.status === 'failed') visualClass = 'failed';
                    else if (bState.status === 'skipped') visualClass = 'skipped';
                    else if (bState.status === 'active') visualClass = 'completed'; // Assumed done
                    else visualClass = 'completed'; // Default
                } else {
                    visualClass = 'completed';
                }
            } else {
                visualClass = 'pending';
            }
            
            // Detailed active states
            if (isActive && bState) {
                if (bState.status === 'awaiting') visualClass = 'awaiting';
                if (bState.status === 'active') visualClass = 'active';
            }

            div.classList.add(visualClass);
            
            const formatTime = (t) => {
                const h = Math.floor(t);
                const m = Math.round((t - h) * 60);
                return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
            };

            const displayTime = formatTime(block.start);
            
            div.innerHTML = `
                <div class="timeline-time">${displayTime}</div>
                <div class="timeline-content">
                    <span class="t-title">${block.title}</span>
                    <span class="t-desc">${block.type.toUpperCase()}</span>
                </div>
            `;
            timelineContainer.appendChild(div);
        });
    }

    function restoreLog() {
        // Clear default
        systemLog.innerHTML = '';
        if (appState.historyLog && appState.historyLog.length > 0) {
            appState.historyLog.forEach(entry => {
                renderLogEntry(entry);
            });
        } else {
             // Initial if empty
             addLogEntry('SISTEMA INICIALIZADO', false);
        }
    }

    function saveHistoryLog(data) {
        const hStr = String(data.hour).padStart(2, '0') + ':00';
        addLogEntry(`${hStr} | ${data.block} | ${data.focus.toUpperCase()}`);
    }

    function addLogEntry(text, save = true) {
        const time = new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});
        const entryData = { time, text };
        
        if (save) {
            if (!appState.historyLog) appState.historyLog = [];
            appState.historyLog.unshift(entryData);
            if (appState.historyLog.length > 20) appState.historyLog.pop();
            saveState();
        }
        
        renderLogEntry(entryData);
    }

    function renderLogEntry(data) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="log-time">${data.time}</span>
            <span class="log-action">${data.text}</span>
            <span class="log-status">OK</span>
        `;
        systemLog.insertBefore(entry, systemLog.firstChild);
        // DOM limit
        if (systemLog.children.length > 20) systemLog.removeChild(systemLog.lastChild);
    }

    // --- Interactive Features ---

    // Priority Control
    // const focusBtns = document.querySelectorAll('.focus-btn'); // Removed static listener

    // focusBtns.forEach(btn => { ... }); // Logic moved to dynamic creation

    // Priority Levels logic
    // priorityLevels.forEach(lvl => { ... }); // Logic moved to dynamic creation

    function updatePriorityUI() {
        Object.keys(appState.priorities).forEach(key => {
            const val = appState.priorities[key];
            const item = document.querySelector(`.p-control-item[data-focus="${key}"]`);
            if (item) {
                item.querySelectorAll('.pc-level').forEach(l => {
                    l.classList.toggle('active', parseInt(l.dataset.level) === val);
                });
            }
        });
    }

    // Checklists
    function restoreChecklists() {
        checkboxes.forEach(cb => {
            if (appState.checklist[cb.id]) {
                cb.checked = true;
            }
            cb.addEventListener('change', () => {
                appState.checklist[cb.id] = cb.checked;
                saveState();
                if (cb.checked) {
                    // Minimal glow effect
                    const label = cb.parentElement.querySelector('.check-text').textContent;
                    addLogEntry(`CHECK: ${label}`);
                }
            });
        });
    }

    // --- Reset Logic ---
    const btnReset = document.getElementById('btn-hard-reset');
    if(btnReset) {
        btnReset.addEventListener('click', () => {
            if(confirm("ADVERTENCIA: ¿Reiniciar TODO el historial y progreso a 0?")) {
                localStorage.clear();
                location.reload();
            }
        });
    }

    // --- Craving Logic ---
    let cravingTimer = null;
    
    function handleCravingClick() {
        appState.cravingStats.total++;
        updateCravingStats();
        saveState();
        
        if (cravingButtons) cravingButtons.classList.add('hidden');
        if (cravingBtnSmoke) cravingBtnSmoke.classList.add('hidden'); // Safety
        
        cravingSteps.classList.remove('hidden');
        
        startCravingProtocol();
    }

    if (cravingBtnSmoke) cravingBtnSmoke.addEventListener('click', handleCravingClick);
    if (cravingBtnCaffeine) cravingBtnCaffeine.addEventListener('click', handleCravingClick);

    function startCravingProtocol() {
        // Updated Protocol per user request:
        // 1. Respiración profunda (10s)
        // 2. Beber agua (30s)
        // 3. Jugar (10 min -> 600s)
        
        const steps = [
            { id: 'step-breath', text: '1. RESPIRACIÓN PROFUNDA', duration: 10 },
            { id: 'step-water', text: '2. BEBER AGUA', duration: 30 },
            { id: 'step-play', text: '3. JUGAR', duration: 600 } // 10 mins
        ];
            
        // Render steps dynamically
        cravingSteps.innerHTML = '';
        steps.forEach(step => {
            const div = document.createElement('div');
            div.className = 'step';
            div.id = step.id;
            div.innerHTML = `${step.text} <span class="step-time">(${formatDuration(step.duration)})</span>`;
            cravingSteps.appendChild(div);
        });
        
        // Re-append actions
        cravingSteps.appendChild(cravingActions);
        
        let currentStepIndex = 0;
        
        function runStep() {
            if (currentStepIndex >= steps.length) {
                cravingActions.classList.remove('hidden');
                return;
            }
            
            const stepData = steps[currentStepIndex];
            const el = cravingSteps.children[currentStepIndex]; 
            const timeSpan = el.querySelector('.step-time');
            
            el.classList.add('active');
            
            let timeLeft = stepData.duration;
            
            // Initial display
            timeSpan.textContent = `(${formatDuration(timeLeft)})`;
            
            cravingTimer = setInterval(() => {
                timeLeft--;
                timeSpan.textContent = `(${formatDuration(timeLeft)})`;
                
                if (timeLeft <= 0) {
                    clearInterval(cravingTimer);
                    el.classList.remove('active');
                    el.classList.add('done');
                    timeSpan.textContent = "(COMPLETADO)";
                    currentStepIndex++;
                    runStep();
                }
            }, 1000);
        }
        
        runStep();
    }

    function formatDuration(seconds) {
        if (seconds < 60) return `${seconds}s`;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s > 0 ? s + 's' : ''}`;
    }

    btnDefeated.addEventListener('click', () => {
        appState.cravingStats.defeated++;
        updateCravingStats();
        resetCravingUI();
        saveState();
        addLogEntry('ANTOJO DERROTADO');
    });

    btnStill.addEventListener('click', () => {
        resetCravingUI(); 
        handleCravingClick();
    });

    function resetCravingUI() {
        if (cravingTimer) clearInterval(cravingTimer); // Clear any running timer
        
        cravingSteps.classList.add('hidden');
        cravingActions.classList.add('hidden');
        
        if (cravingButtons) cravingButtons.classList.remove('hidden');
        
        // Restore individual button visibility based on user
        if (currentUser === 'karol') {
            if (cravingBtnSmoke) cravingBtnSmoke.classList.remove('hidden');
            if (cravingBtnCaffeine) cravingBtnCaffeine.classList.add('hidden');
        } else {
            if (cravingBtnSmoke) cravingBtnSmoke.classList.remove('hidden');
            if (cravingBtnCaffeine) cravingBtnCaffeine.classList.remove('hidden');
        }
        
        // Remove dynamic children but keep structure valid for next run
        // Actually startCravingProtocol clears innerHTML so we just need to reset classes if we were reusing
        // But since we clear HTML, we are good.
    }

    function updateCravingStats() {
        statCravings.textContent = appState.cravingStats.total;
        statDefeated.textContent = appState.cravingStats.defeated;
    }

    // --- Init ---
    // loadState(); // Removed, now called in login
    // updateTime();
    // renderTimeline();
    
    setInterval(updateTime, 1000);
    setInterval(renderTimeline, 60000);

    // Initial Fade In
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = 1;
    }, 100);

    // --- Notification Logic ---
    function requestNotificationPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    addLogEntry("SISTEMA: ENLACE NEURAL ACTIVO");
                    new Notification("NEXUS SYSTEM", { 
                        body: "CONEXIÓN ESTABLECIDA",
                        icon: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png" // Matrix-like icon
                    });
                }
            });
        }
    }

    function startMatrixReminders() {
        // Clear existing interval if any to avoid duplicates
        if (window.matrixReminderInterval) clearInterval(window.matrixReminderInterval);
        
        // 5 minutes = 300,000 ms
        window.matrixReminderInterval = setInterval(() => {
            if (Notification.permission === "granted") {
                const n = new Notification("NEXUS SYSTEM", { 
                    body: "STILL ON MATRIX?",
                    icon: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
                    vibrate: [200, 100, 200]
                });
                
                // Close automatically after 5s
                setTimeout(() => n.close(), 5000);
            }
        }, 300000); 
        
        addLogEntry("SISTEMA: PROTOCOLO DE ALERTA (5MIN) INICIADO");
    }

});