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

    // Block Controls
    const blockControls = document.getElementById('block-controls');
    const blockEndControls = document.getElementById('block-end-controls');
    const btnStartBlock = document.getElementById('btn-start-block');
    const btnDelayBlock = document.getElementById('btn-delay-block');
    const btnSkipBlock = document.getElementById('btn-skip-block');
    const btnCompleteBlock = document.getElementById('btn-complete-block');
    const btnPartialBlock = document.getElementById('btn-partial-block');
    const btnFailedBlock = document.getElementById('btn-failed-block');
    
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
    const cravingBtn = document.getElementById('craving-btn');
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
                { start: 3, end: 4, title: 'MORNING RESET', type: 'rutina', focus: 'yo' },
                { start: 4, end: 6, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 6, end: 7, title: 'EXERCISE', type: 'salud', focus: 'yo' },
                { start: 7, end: 19, title: 'DEEP WORK', type: 'trabajo', focus: 'j' },
                { start: 19, end: 20, title: 'FINAL FOCUS', type: 'cierre', focus: 'j' },
                { start: 20, end: 27, title: 'SLEEP MODE', type: 'descanso', focus: 'off' }
            ]
        },
        karol: {
            role: 'ARCHITECT',
            focusOptions: [
                { id: 'bebe', label: 'BEBÉ' },
                { id: 'calidad', label: 'TRABAJO CALIDAD' },
                { id: 'aseo', label: 'ASEO' },
                { id: 'comida', label: 'COMIDA' }
            ],
            schedule: [
                { start: 6, end: 7, title: 'MORNING BABY + COCINAR', type: 'rutina', focus: 'bebe' },
                { start: 7, end: 9, title: 'ASEO & ARREGLARSE', type: 'personal', focus: 'aseo' },
                { start: 9, end: 12, title: 'TRABAJO DE CALIDAD', type: 'trabajo', focus: 'calidad' },
                { start: 12, end: 14, title: 'ALMUERZO & BEBÉ', type: 'familia', focus: 'bebe' },
                { start: 14, end: 18, title: 'TRABAJO DE CALIDAD', type: 'trabajo', focus: 'calidad' },
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
        activeMinutes: 0 // Track active minutes for leveling up
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
            const btn = document.getElementById('craving-btn');
            btn.textContent = tweaks.cravingBtnText;
            
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
        document.getElementById('craving-btn').textContent = 'QUIERO FUMAR';
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
        const key = `nexus_state_${userKey}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge carefully to not overwrite config
            appState = { ...appState, ...parsed };
            // Ensure proper structures
            if (!appState.blockState) appState.blockState = {};
            
            // Restore UI
            updatePriorityUI();
            updateCravingStats();
            restoreChecklists();
            restoreLog();
        } else {
            // New user state
            restoreLog(); // Init empty log
        }
    };

    const saveState = () => {
        if (!currentUser) return;
        localStorage.setItem(`nexus_state_${currentUser}`, JSON.stringify(appState));
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

    function getBlockForHour(hour) {
        if (!CONFIG.schedule.length) return null;
        // Handle 00-03 as 24-27 for easier calculation
        let checkHour = hour < 3 ? hour + 24 : hour;
        return CONFIG.schedule.find(b => checkHour >= b.start && checkHour < b.end);
    }

    function updateTime() {
        const now = new Date();
        let hour = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();
        
        // --- Clock & Date ---
        const hStr = String(hour).padStart(2, '0');
        const mStr = String(min).padStart(2, '0');
        const sStr = String(sec).padStart(2, '0');
        
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
            
            blockControls.classList.add('hidden');
            blockEndControls.classList.add('hidden');
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
            
            const currentBlock = getBlockForHour(hour);
            if (currentBlock) {
                currentTaskTitle.textContent = currentBlock.title;
                currentStateBadge.textContent = currentBlock.type.toUpperCase();
                currentBlockTime.textContent = `${String(currentBlock.start).padStart(2,'0')}:00 - ${String(currentBlock.end).padStart(2,'0')}:00`;
                
                let nextStart = currentBlock.end;
                if (nextStart >= 24) nextStart -= 24;
                nextBlockTime.textContent = `${String(nextStart).padStart(2,'0')}:00`;

                // Timer
                const nextHourDate = new Date(now);
                nextHourDate.setHours(hour + 1, 0, 0, 0);
                const diff = nextHourDate - now;
                const tm = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const ts = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
                mainTimer.textContent = `00:${tm}:${ts}`;

                // Progress
                const progress = (min / 60) * 100;
                blockProgress.style.width = `${progress}%`;
                
                // --- BLOCK TRACKING LOGIC ---
                // Initialize if new hour
                if (!appState.blockState[hour]) {
                    appState.blockState[hour] = { status: 'awaiting', delay: 0 };
                    saveState();
                }
                
                const bState = appState.blockState[hour];
                
                // Update UI based on status
        updateBlockControls(bState.status);
        
        // --- LEVEL SYSTEM CHECK ---
        // If status is 'active', increment progress
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
            }
        }

        // --- Hourly Log & Reset ---
        if (hour !== appState.lastLogHour) {
            // If hour changed, mark previous as completed if active?
            // Better: prompt for completion at end of hour.
            // For now, auto-log previous hour
            if (appState.lastLogHour !== -1) {
                const prevB = appState.blockState[appState.lastLogHour];
                const block = getBlockForHour(appState.lastLogHour);
                
                // If it was active but not marked completed, mark as Partial or Completed automatically?
                // Let's mark as completed for history log purposes if it was active
                let finalStatus = 'UNKNOWN';
                if (prevB) {
                    finalStatus = prevB.status === 'active' ? 'COMPLETED (AUTO)' : prevB.status.toUpperCase();
                    // Update state to completed if it was active
                    if (prevB.status === 'active') {
                        appState.blockState[appState.lastLogHour].status = 'completed';
                    }
                }
                
                const logData = {
                    hour: appState.lastLogHour,
                    block: block ? block.title : 'SLEEP/OTHER',
                    focus: appState.currentFocus,
                    status: finalStatus
                };
                saveHistoryLog(logData);
            }
            appState.lastLogHour = hour;
            saveState();
            renderTimeline(); 
        }
    }

    function updateBlockControls(status) {
        if (status === 'awaiting' || status === 'delayed') {
            blockControls.classList.remove('hidden');
            blockEndControls.classList.add('hidden');
        } else if (status === 'active') {
            blockControls.classList.add('hidden');
            blockEndControls.classList.remove('hidden');
        } else {
            // Completed, failed, skipped
            blockControls.classList.add('hidden');
            blockEndControls.classList.add('hidden');
        }
    }

    // --- Block Actions ---
    btnStartBlock.addEventListener('click', () => {
        const h = new Date().getHours();
        appState.blockState[h] = { ...appState.blockState[h], status: 'active', start: Date.now() };
        saveState();
        addLogEntry("BLOQUE INICIADO");
        updateTime();
    });

    btnDelayBlock.addEventListener('click', () => {
        const h = new Date().getHours();
        const currentDelay = appState.blockState[h].delay || 0;
        appState.blockState[h] = { ...appState.blockState[h], status: 'delayed', delay: currentDelay + 5 };
        // Penalize delay? Maybe partial strike? Let's say yes for discipline
        addStrike(); 
        saveState();
        addLogEntry("BLOQUE RETRASADO (+1 FALLO)");
        updateTime();
    });

    btnSkipBlock.addEventListener('click', () => {
        const h = new Date().getHours();
        appState.blockState[h] = { ...appState.blockState[h], status: 'skipped' };
        addStrike(); // Skipping is a strike
        saveState();
        addLogEntry("BLOQUE SALTADO (+1 FALLO)");
        updateTime();
    });

    // End Controls
    btnCompleteBlock.addEventListener('click', () => setBlockEndStatus('completed'));
    
    btnPartialBlock.addEventListener('click', () => {
        addStrike(); // Partial is not perfect
        setBlockEndStatus('partial');
    });
    
    btnFailedBlock.addEventListener('click', () => {
        addStrike(); // Failed is a strike
        setBlockEndStatus('failed');
    });

    function setBlockEndStatus(status) {
        const h = new Date().getHours();
        appState.blockState[h] = { ...appState.blockState[h], status: status };
        saveState();
        addLogEntry(`BLOQUE FINALIZADO: ${status.toUpperCase()}`);
        updateTime();
    }

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
        const currentHour = now.getHours();
        
        timelineContainer.innerHTML = '';

        // Render from 03:00 to 20:00
        for (let h = 3; h < 20; h++) {
            const block = getBlockForHour(h);
            if (!block) continue;

            const div = document.createElement('div');
            div.className = 'timeline-item';
            
            // Determine Visual State from blockState history
            const bState = appState.blockState[h];
            let visualClass = 'pending';
            
            if (h === currentHour) {
                visualClass = 'active';
            } else if (h < currentHour) {
                // Past blocks
                if (bState) {
                    if (bState.status === 'completed') visualClass = 'completed';
                    else if (bState.status === 'failed') visualClass = 'failed';
                    else if (bState.status === 'skipped') visualClass = 'skipped';
                    else visualClass = 'completed'; // Default to completed if just passed
                } else {
                    visualClass = 'completed';
                }
            } else {
                // Future
                visualClass = 'pending';
            }
            
            // Detailed states if active
            if (h === currentHour && bState) {
                if (bState.status === 'awaiting') visualClass = 'awaiting';
                if (bState.status === 'active') visualClass = 'active';
            }

            div.classList.add(visualClass);

            const displayHour = String(h).padStart(2, '0') + ':00';
            
            div.innerHTML = `
                <div class="timeline-time">${displayHour}</div>
                <div class="timeline-content">
                    <span class="t-title">${block.title}</span>
                    <span class="t-desc">${block.type.toUpperCase()}</span>
                </div>
            `;
            timelineContainer.appendChild(div);
        }
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

    // Anti-Craving Protocol
    let cravingTimer = null;
    
    cravingBtn.addEventListener('click', () => {
        appState.cravingStats.total++;
        updateCravingStats();
        saveState();
        
        cravingBtn.classList.add('hidden');
        cravingSteps.classList.remove('hidden');
        
        startCravingProtocol();
    });

    function startCravingProtocol() {
        // Use custom steps if available (Karol) or default (Kevin)
        const steps = appState.customCravingSteps 
            ? appState.customCravingSteps 
            : [
                { id: 'step-breath', text: '1. RESPIRA (10s)', time: 10000 },
                { id: 'step-water', text: '2. AGUA (20s)', time: 20000 },
                { id: 'step-minecraft', text: '3. MINECRAFT (10m)', time: 600000 }
            ];
            
        // Render steps dynamically
        cravingSteps.innerHTML = '';
        steps.forEach(step => {
            const div = document.createElement('div');
            div.className = 'step';
            div.id = step.id || 'step-' + Math.random().toString(36).substr(2, 5);
            div.textContent = step.text;
            cravingSteps.appendChild(div);
        });
        
        // Re-append actions
        cravingSteps.appendChild(cravingActions);
        
        let currentStep = 0;
        
        function runStep() {
            if (currentStep >= steps.length) {
                cravingActions.classList.remove('hidden');
                return;
            }
            
            const stepData = steps[currentStep];
            const el = cravingSteps.children[currentStep]; // Assuming order matches
            el.classList.add('active');
            
            setTimeout(() => {
                el.classList.remove('active');
                el.classList.add('done');
                currentStep++;
                runStep();
            }, stepData.time);
        }
        
        runStep();
    }

    btnDefeated.addEventListener('click', () => {
        appState.cravingStats.defeated++;
        updateCravingStats();
        resetCravingUI();
        saveState();
        addLogEntry('ANTOJO DERROTADO');
    });

    btnStill.addEventListener('click', () => {
        resetCravingUI(); // Or restart? User said "Still Craving -> restart".
        // Let's restart immediately
        cravingBtn.click();
    });

    function resetCravingUI() {
        cravingSteps.classList.add('hidden');
        cravingActions.classList.add('hidden');
        cravingBtn.classList.remove('hidden');
        
        document.querySelectorAll('.step').forEach(s => {
            s.classList.remove('active', 'done');
        });
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
});