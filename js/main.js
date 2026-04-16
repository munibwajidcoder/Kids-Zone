document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    if (mobileMenuBtn && sidebar && overlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('block');
        });
    }

    if (closeMenuBtn && sidebar && overlay) {
        closeMenuBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('block');
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('block');
        });
    }

    // --- Number Speaking Functionality (Sequential) ---
    const playAllBtn = document.getElementById('play-11-50');
    let isSpeakingSequence = false;
    let availableVoices = [];
    let fastVoice = null;
    let sequenceVoice = null;
    let lastSpeakTime = 0;

    function loadVoices() {
        availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0) return;

        // --- Restoring Your Preferred Voice ---
        // We prioritize the clear Google/Samantha voices you liked, 
        // but keep the speed-tuning active.
        fastVoice = availableVoices.find(v => (v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Female')) && v.lang.startsWith('en'))
                  || availableVoices.find(v => v.lang.startsWith('en'));

        sequenceVoice = fastVoice;

        // Force a "Keep-Alive" speak to wake up the engine immediately
        primeEngine();
    }

    function primeEngine() {
        const prime = new SpeechSynthesisUtterance('');
        prime.volume = 0;
        prime.rate = 10;
        window.speechSynthesis.speak(prime);
    }

    // Load voices and keep checking if empty (for Chrome/Windows lag)
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
    // Interval to ensure voices are loaded and kept alive
    setInterval(() => {
        if (availableVoices.length === 0) loadVoices();
        // Periodically prime every 15s to keep the speech service from sleeping
        if (Date.now() - lastSpeakTime > 15000) primeEngine();
    }, 5000);

    function highlightNumber(num) {
        document.querySelectorAll('.small-num-circle').forEach(el => el.classList.remove('playing-now'));
        const current = document.querySelector(`.small-num-circle[data-number="${num}"]`);
        if (current) {
            current.classList.add('playing-now');
            current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function speakTextPromise(text, rate = 1.0) {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = 1.1; // Smoother, more natural pitch
            if (sequenceVoice) utterance.voice = sequenceVoice;
            utterance.onend = () => setTimeout(resolve, 100);
            utterance.onerror = () => resolve(); 
            window.speechSynthesis.speak(utterance);
        });
    }

    let currentActiveSequence = null;

    async function playNumberSequence(start, end) {
        const sequenceId = `${start}-${end}`;
        if (isSpeakingSequence && currentActiveSequence === sequenceId) {
            window.speechSynthesis.cancel();
            isSpeakingSequence = false;
            currentActiveSequence = null;
            document.querySelectorAll('.small-num-circle').forEach(el => el.classList.remove('playing-now'));
            return;
        }
        window.speechSynthesis.cancel();
        isSpeakingSequence = true;
        currentActiveSequence = sequenceId;
        await new Promise(r => setTimeout(r, 200));
        for (let i = start; i <= end; i++) {
            if (!isSpeakingSequence || currentActiveSequence !== sequenceId) break;
            highlightNumber(i);
            await speakTextPromise(i.toString(), 1.0); // Faster rate
        }
        if (currentActiveSequence === sequenceId) {
            isSpeakingSequence = false;
            currentActiveSequence = null;
            document.querySelectorAll('.small-num-circle').forEach(el => el.classList.remove('playing-now'));
        }
    }

    // --- ZERO LATENCY SPEAKING ---
    function speakImmediate(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0; // Faster
        utterance.pitch = 1.1; // Natural tone
        
        // STICK TO FAST VOICE (Local Only)
        if (fastVoice) utterance.voice = fastVoice;

        lastSpeakTime = Date.now();

        // On some browsers, cancel() stalls. We only cancel if we've been speaking for > 100ms.
        window.speechSynthesis.cancel();
        
        // Execute speak immediately
        window.speechSynthesis.speak(utterance);
    }

    // Event Listeners
    if (playAllBtn) {
        playAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            playNumberSequence(11, 50);
        });
    }

    const playAllBtn2 = document.getElementById('play-51-100');
    if (playAllBtn2) {
        playAllBtn2.addEventListener('click', (e) => {
            e.preventDefault();
            playNumberSequence(51, 100);
        });
    }

    document.querySelectorAll('.small-num-circle[data-number]').forEach(circle => {
        circle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isSpeakingSequence) {
                const num = circle.getAttribute('data-number');
                if (num) {
                    speakImmediate(num);
                    circle.style.transform = 'scale(0.9)';
                    setTimeout(() => { circle.style.transform = ''; }, 100);
                }
            } else {
                window.speechSynthesis.cancel();
                isSpeakingSequence = false;
                currentActiveSequence = null;
                document.querySelectorAll('.small-num-circle').forEach(el => el.classList.remove('playing-now'));
            }
        });
    });

    // --- Individual Click Logic for num-cards (1 to 10) ---
    const numberCards = document.querySelectorAll('.num-card[data-number]');
    numberCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const num = card.getAttribute('data-number');
            if (num) {
                // Instant Visual feedback
                numberCards.forEach(c => c.classList.remove('card-playing'));
                card.classList.add('card-playing');
                
                // Zero-Latency Speak
                speakImmediate(num);
                
                setTimeout(() => {
                    card.classList.remove('card-playing');
                }, 800);
            }
        });
    });

    // --- ABC Section Interactive Voice ---
    const abcCards = document.querySelectorAll('.abc-card[data-letter]');
    const playABCBtn = document.getElementById('play-abc');
    let isSpeakingABC = false;

    async function playABCSequence() {
        if (isSpeakingABC) {
            window.speechSynthesis.cancel();
            isSpeakingABC = false;
            abcCards.forEach(c => c.classList.remove('card-playing'));
            return;
        }

        window.speechSynthesis.cancel();
        isSpeakingABC = true;
        
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        for (let i = 0; i < letters.length; i++) {
            if (!isSpeakingABC) break;
            
            const char = letters[i];
            const card = document.querySelector(`.abc-card[data-letter="${char}"]`);
            
            if (card) {
                // Visual Highlight
                abcCards.forEach(c => c.classList.remove('card-playing'));
                card.classList.add('card-playing');
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Speak slowly and clearly: "A for Apple", etc.
                const word = card.getAttribute('data-word');
                await speakTextPromise(`${char} for ${word}`, 0.8); 
            }
        }
        
        isSpeakingABC = false;
        abcCards.forEach(c => c.classList.remove('card-playing'));
    }

    if (playABCBtn) {
        playABCBtn.addEventListener('click', (e) => {
            e.preventDefault();
            playABCSequence();
        });
    }

    abcCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isSpeakingABC) {
                window.speechSynthesis.cancel();
                isSpeakingABC = false;
                abcCards.forEach(c => c.classList.remove('card-playing'));
                return;
            }
            
            const letter = card.getAttribute('data-letter');
            if (letter) {
                // Visual Highlight (Blue Light)
                abcCards.forEach(c => c.classList.remove('card-playing'));
                card.classList.add('card-playing');
                
                // Optimized Speak: Simple Letter
                speakImmediate(letter);
                
                // Clear highlight
                setTimeout(() => {
                    if (!isSpeakingABC) card.classList.remove('card-playing');
                }, 800);
            }
        });
    });

    // --- Tables Section Interactive Voice ---
    let isSpeakingTable = false;
    let currentTablePlaying = null;

    async function playTableSequence(tableNum) {
        const sequenceId = `table-${tableNum}`;
        if (isSpeakingTable && currentTablePlaying === sequenceId) {
            window.speechSynthesis.cancel();
            isSpeakingTable = false;
            currentTablePlaying = null;
            return;
        }

        window.speechSynthesis.cancel();
        isSpeakingTable = true;
        currentTablePlaying = sequenceId;

        // Reset any other sequences
        isSpeakingABC = false;
        abcCards.forEach(c => c.classList.remove('card-playing'));

        for (let i = 1; i <= 10; i++) {
            if (!isSpeakingTable || currentTablePlaying !== sequenceId) break;
            
            // Traditional "za" style: "2 1 za 2", "2 2 za 4"
            // To make it musical, we use a custom construction
            // Traditional "za" style: "2 1 za 2", "2 2 za 4"
            // Fast and snappy phrasing
            const text = `${tableNum} ${i} za ${tableNum * i}`;
            
            // Speak with a faster, energetic tone
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1; // Fast-paced
            utterance.pitch = 1.1; 
            if (sequenceVoice) utterance.voice = sequenceVoice;
            
            await new Promise((resolve) => {
                utterance.onend = () => setTimeout(resolve, 100); // Snappy rhythmic pause
                utterance.onerror = () => resolve();
                window.speechSynthesis.speak(utterance);
            });
        }

        if (currentTablePlaying === sequenceId) {
            isSpeakingTable = false;
            currentTablePlaying = null;
        }
    }

    [2, 3, 4, 5].forEach(num => {
        const btn = document.getElementById(`play-table-${num}`);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                playTableSequence(num);
            });
        }
    });

    // --- Rhymes Section Interactive Voice ---
    let isSpeakingRhyme = false;
    let currentRhymeId = null;

    const rhymeData = {
        'twinkle': [
            "Twinkle, twinkle, little star,",
            "How I wonder what you are!",
            "Up above the world so high,",
            "Like a diamond in the sky.",
            "Twinkle, twinkle, little star,",
            "How I wonder what you are!"
        ],
        'johnny': [
            "Johny, Johny,",
            "Yes, Papa?",
            "Eating sugar?",
            "No, Papa!",
            "Telling lies?",
            "No, Papa!",
            "Open your mouth,",
            "Ha! Ha! Ha!"
        ],
        'abc': [
            "A, B, C, D, E, F, G,",
            "H, I, J, K, L, M, N, O, P,",
            "Q, R, S, T, U, V,",
            "W, X, Y, and Z.",
            "Now I know my ABCs,",
            "Next time won't you sing with me."
        ]
    };

    async function playRhymeSequence(id) {
        if (isSpeakingRhyme && currentRhymeId === id) {
            window.speechSynthesis.cancel();
            isSpeakingRhyme = false;
            currentRhymeId = null;
            document.querySelectorAll('.rhyme-card').forEach(c => c.classList.remove('rhyme-playing'));
            return;
        }

        window.speechSynthesis.cancel();
        isSpeakingRhyme = true;
        currentRhymeId = id;

        // Reset other sequences
        isSpeakingABC = false;
        isSpeakingTable = false;
        abcCards.forEach(c => c.classList.remove('card-playing'));
        document.querySelectorAll('.rhyme-card').forEach(c => c.classList.remove('rhyme-playing'));

        const card = document.getElementById(`play-rhyme-${id}`)?.closest('.rhyme-card');
        if (card) card.classList.add('rhyme-playing');

        const lines = rhymeData[id];
        for (let i = 0; i < lines.length; i++) {
            if (!isSpeakingRhyme || currentRhymeId !== id) break;
            
            const utterance = new SpeechSynthesisUtterance(lines[i]);
            utterance.rate = 1.0;
            utterance.pitch = 1.35; // Fun musical pitch
            if (sequenceVoice) utterance.voice = sequenceVoice;

            await new Promise((resolve) => {
                utterance.onend = () => setTimeout(resolve, 400); // Musical pause between lines
                utterance.onerror = () => resolve();
                window.speechSynthesis.speak(utterance);
            });
        }

        if (currentRhymeId === id) {
            isSpeakingRhyme = false;
            currentRhymeId = null;
            if (card) card.classList.remove('rhyme-playing');
        }
    }

    ['twinkle', 'johnny', 'abc'].forEach(id => {
        const btn = document.getElementById(`play-rhyme-${id}`);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                playRhymeSequence(id);
            });
        }
    });

    // --- Home Page Image Cards Voice Interactions ---
    const dailyReflectionCard = document.getElementById('daily-reflection-card');
    const healthyHabitsCard = document.getElementById('healthy-habits-card');
    const growingStrongCard = document.getElementById('growing-strong-card');

    let currentCardPlaying = null;

    async function playCardVoice(cardId, text) {
        if (currentCardPlaying === cardId) {
            window.speechSynthesis.cancel();
            currentCardPlaying = null;
            return;
        }

        window.speechSynthesis.cancel();
        currentCardPlaying = cardId;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0; // Same speed as other sections
        utterance.pitch = 1.1; // Same natural tone as other sections
        if (sequenceVoice) utterance.voice = sequenceVoice;

        await new Promise((resolve) => {
            utterance.onend = () => { setTimeout(resolve, 100); };
            utterance.onerror = () => { resolve(); };
            window.speechSynthesis.speak(utterance);
        });

        if (currentCardPlaying === cardId) {
            currentCardPlaying = null;
        }
    }

    if (dailyReflectionCard) {
        dailyReflectionCard.addEventListener('click', (e) => {
            e.preventDefault();
            playCardVoice('daily-reflection-card', "Oh Allah, increase my knowledge. Ameen.");
        });
    }

    if (healthyHabitsCard) {
        healthyHabitsCard.addEventListener('click', (e) => {
            e.preventDefault();
            playCardVoice('healthy-habits-card', "Brush your teeth in the morning and at night for a healthy, sparkly smile!");
        });
    }

    if (growingStrongCard) {
        growingStrongCard.addEventListener('click', (e) => {
            e.preventDefault();
            playCardVoice('growing-strong-card', "Drink milk every day to make your bones strong and healthy!");
        });
    }

    // --- Unique Per-Page Entrance Animations ---
    function initEntranceAnimations() {
        // --- 1. Robust Page Detection (By content, not just URL) ---
        const isHome = document.querySelector('.activities-grid') || document.querySelector('.image-cards');
        const isABC = document.querySelector('.abc-grid');
        const is123 = document.querySelector('.small-numbers-grid') || document.querySelector('.counting-section');
        const isTables = document.querySelector('.tables-grid');
        const isRhymes = document.querySelector('.rhymes-grid');
        const isVegetables = document.querySelector('.vegetables-grid');
        const isAnimals = document.querySelector('.animals-grid');
        const isColors = document.querySelector('.colors-grid');
        const isDays = document.querySelector('.days-grid');
        const isMonths = document.querySelector('.months-grid');
        const isMath = document.querySelector('.addition-container') || document.querySelector('.subtraction-container');

        let animClass = "anim-zoom"; // Default premium zoom
        let selector = ".image-card, .activity-btn, .abc-card, .num-card, .small-num-circle, .table-card, .rhyme-card, .color-card, .animal-card, .veg-card, .day-card, .month-card, .math-board, .interaction-board, .sub-math-board, .sub-interaction-board, .dashed-card";

        if (isHome) {
            // HOME PAGE: Attractive high-impact reveal
            const logo = document.querySelector('.logo-area');
            if (logo) {
                logo.style.opacity = '0';
                setTimeout(() => logo.classList.add('anim-hero'), 100);
            }
            const title = document.querySelector('.page-title');
            if (title) title.classList.add('anim-hero');
            
            animClass = "anim-zoom";
            selector = ".image-card, .activity-btn";
        } else if (isABC) {
            animClass = "anim-slide-left";
            selector = ".abc-card";
        } else if (is123) {
            animClass = "anim-slide-right";
            selector = ".num-card, .small-num-circle";
        } else if (isTables) {
            animClass = "anim-flip";
            selector = ".table-card";
        } else if (isRhymes) {
            animClass = "anim-swing";
            selector = ".rhyme-card";
        } else if (isMath) {
            animClass = "anim-bounce-down";
            selector = ".math-board, .interaction-board, .sub-math-board, .sub-interaction-board";
        } else if (isVegetables || isAnimals || isColors) {
            animClass = "anim-zoom";
            selector = ".veg-card, .animal-card, .color-card, .dashed-card";
        } else if (isDays || isMonths) {
            animClass = "anim-flip";
            selector = ".day-card, .month-card, .dashed-card";
        }

        // --- 2. Dispatch Staggered Animations ---
        const items = document.querySelectorAll(selector);
        items.forEach((item, index) => {
            // Force reset and hide
            item.style.opacity = '0';
            item.classList.remove("anim-zoom", "anim-slide-left", "anim-slide-right", "anim-flip", "anim-swing", "anim-roll", "anim-bounce-down", "anim-hero");
            
            setTimeout(() => {
                item.classList.add(animClass);
                item.style.opacity = '1';
            }, index * 60);
        });

        // --- 3. Page Header ---
        const header = document.querySelector('.page-header');
        if (header && !isHome) {
            header.style.animation = "slideInDown 0.8s ease-out forwards";
        }

        // --- 4. Hyper-Robust Auto-Greeting ---
        if (isHome) {
            const welcomeText = "Hey kids, welcome to Kids Zone";
            let greetTriggered = false;

            const attemptWelcome = () => {
                if (greetTriggered) return;
                
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    primeEngine();
                    speakImmediate(welcomeText);
                    greetTriggered = true;
                    ['mousedown', 'touchstart', 'keydown', 'scroll', 'wheel', 'mousemove', 'click'].forEach(type => {
                        window.removeEventListener(type, attemptWelcome);
                    });
                }
            };

            setTimeout(attemptWelcome, 500);
            setTimeout(attemptWelcome, 1500);
            ['mousedown', 'touchstart', 'keydown', 'scroll', 'wheel', 'mousemove', 'click'].forEach(type => {
                window.addEventListener(type, attemptWelcome, { once: true, passive: true });
            });
            
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                const prevHandler = window.speechSynthesis.onvoiceschanged;
                window.speechSynthesis.onvoiceschanged = () => {
                    if (prevHandler) prevHandler();
                    attemptWelcome();
                };
            }
        }
    }

    // Trigger after layout settles
    setTimeout(initEntranceAnimations, 100);
});
