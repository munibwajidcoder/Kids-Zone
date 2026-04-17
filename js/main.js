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

        // --- High-Quality Kid-Friendly Voice Selection ---
        // We prioritize "Natural" (Edge), "Google" (Chrome), "Aria", or "Samantha" for a soft, polite experience.
        fastVoice = availableVoices.find(v => (v.name.includes('Natural') || v.name.includes('Aria') || v.name.includes('Google')) && v.lang.startsWith('en'))
                  || availableVoices.find(v => (v.name.includes('Samantha') || v.name.includes('Female')) && v.lang.startsWith('en'))
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

    // --- High-Quality Rhyme Audio System (Local Folder) ---
    const RHYME_AUDIO = {
        twinkle: 'audio/01 Twinkle Twinkle Little Star.m4a',
        johnny: 'audio/Johny Johny Yes Papa.mp3',
        abc: 'audio/abc-alphabet-song-274033.mp3'
    };

    let currentAudio = null;

    async function playRhyme(id) {
        const card = document.getElementById(`play-rhyme-${id}`)?.closest('.rhyme-card');
        
        if (currentAudio && currentAudio.getAttribute('data-id') === id) {
            currentAudio.pause();
            currentAudio = null;
            document.querySelectorAll('.rhyme-card').forEach(c => c.classList.remove('rhyme-playing'));
            return;
        }

        // Global Stop
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        window.speechSynthesis.cancel();
        isSpeakingRhyme = false;
        
        document.querySelectorAll('.rhyme-card').forEach(c => c.classList.remove('rhyme-playing'));

        if (card) card.classList.add('rhyme-playing');

        // Create audio object directly from GitHub URL
        const audio = new Audio(RHYME_AUDIO[id]);
        audio.setAttribute('data-id', id);
        currentAudio = audio;

        audio.play().catch(err => {
            console.error("Audio playback failed:", err);
            if (card) card.classList.remove('rhyme-playing');
        });

        audio.onended = () => {
            if (currentAudio === audio) {
                currentAudio = null;
                if (card) card.classList.remove('rhyme-playing');
            }
        };
    }

    ['twinkle', 'johnny', 'abc'].forEach(id => {
        const btn = document.getElementById(`play-rhyme-${id}`);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                playRhyme(id);
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

    // --- Colors Section Interactive Voice ---
    const colorCards = document.querySelectorAll('.color-card[data-color]');
    colorCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const color = card.getAttribute('data-color');
            if (color) {
                // Visual Highlight
                colorCards.forEach(c => c.classList.remove('card-playing'));
                card.classList.add('card-playing');

                // Zero-Latency Speak
                speakImmediate(color);

                // Clear highlight
                setTimeout(() => {
                    card.classList.remove('card-playing');
                }, 800);
            }
        });
    });

    // --- Animals Section Interactive Voice (Dual Action) ---
    const animalCards = document.querySelectorAll('.animal-card[data-animal]');

    // --- Animal Sound Audio System (Local Folder) ---
    const ANIMAL_AUDIO = {
        'Cat':      'audio/stu9-cute-cat-352656.mp3',
        'Dog':      'audio/dragon-studio-dog-bark-effect-382711.mp3',
        'Cow':      'audio/dragon-studio-cow-moo-1-472361.mp3',
        'Lion':     'audio/dragon-studio-lion-roar-sound-effect-324751.mp3',
        'Elephant': 'audio/dragon-studio-elephant-trumpeting-494313.mp3'
    };

    let currentAnimalAudio = null;

    function playAnimalSound(animal, card) {
        // Toggle off if same animal sound is already playing
        if (currentAnimalAudio && currentAnimalAudio.getAttribute('data-animal') === animal) {
            currentAnimalAudio.pause();
            currentAnimalAudio = null;
            animalCards.forEach(c => c.classList.remove('card-playing'));
            return;
        }

        // Stop any currently playing animal audio
        if (currentAnimalAudio) {
            currentAnimalAudio.pause();
            currentAnimalAudio.currentTime = 0;
        }

        animalCards.forEach(c => c.classList.remove('card-playing'));
        if (card) card.classList.add('card-playing');

        // Create audio object directly from GitHub URL (same as Rhymes section)
        const audio = new Audio(ANIMAL_AUDIO[animal]);
        audio.setAttribute('data-animal', animal);
        currentAnimalAudio = audio;

        audio.play().catch(err => {
            console.error('Animal audio playback failed:', err);
            if (card) card.classList.remove('card-playing');
        });

        audio.onended = () => {
            if (currentAnimalAudio === audio) {
                currentAnimalAudio = null;
                if (card) card.classList.remove('card-playing');
            }
        };
    }

    animalCards.forEach(card => {
        // 1. CONTAINER CLICK → AI voice speaks the animal NAME (unchanged)
        card.addEventListener('click', (e) => {
            const animal = card.getAttribute('data-animal');
            if (animal) {
                // Visual Highlight
                animalCards.forEach(c => c.classList.remove('card-playing'));
                card.classList.add('card-playing');

                // AI Voice — speak the animal name
                speakImmediate(animal);

                // Clear highlight
                setTimeout(() => {
                    card.classList.remove('card-playing');
                }, 900);
            }
        });

        // 2. SPEAKER ICON CLICK → play real GitHub animal sound audio
        const speakerIcon = card.querySelector('.animal-speaker-icon');
        if (speakerIcon) {
            speakerIcon.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent container click from also firing

                const animal = card.getAttribute('data-animal');
                if (animal) {
                    playAnimalSound(animal, card);
                }
            });
        }
    });

    // --- Vegetables Section Interactive Voice ---
    const vegCards = document.querySelectorAll('.veg-card[data-veg]');
    vegCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const veg = card.getAttribute('data-veg');
            if (veg) {
                // Visual Highlight
                vegCards.forEach(c => c.classList.remove('card-playing'));
                card.classList.add('card-playing');

                // AI Voice — speak the vegetable name using TTS
                speakImmediate(veg);

                // Clear highlight
                setTimeout(() => {
                    card.classList.remove('card-playing');
                }, 900);
            }
        });
    });

    // --- Days Section Interactive Voice ---
    const dayCards = document.querySelectorAll('.day-card[data-day]');
    dayCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const day = card.getAttribute('data-day');
            if (day) {
                // Visual Highlight
                dayCards.forEach(c => c.classList.remove('card-playing'));
                card.classList.add('card-playing');

                // AI Voice — speak the day name using TTS
                speakImmediate(day);

                // Clear highlight
                setTimeout(() => {
                    card.classList.remove('card-playing');
                }, 900);
            }
        });
    });

    // --- Months Section Interactive Voice ---
    const monthCards = document.querySelectorAll('.month-card[data-month]');
    monthCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const month = card.getAttribute('data-month');
            if (month) {
                // Visual Highlight
                monthCards.forEach(c => c.classList.remove('card-playing'));
                card.classList.add('card-playing');

                // AI Voice — speak the month name using TTS
                speakImmediate(month);

                // Clear highlight
                setTimeout(() => {
                    card.classList.remove('card-playing');
                }, 900);
            }
        });
    });

    // --- Unique Per-Page Entrance Animations ---
    function initEntranceAnimations() {
        // --- 1. Robust Page Detection (By content, not just URL) ---
        const isHome = document.querySelector('.activities-grid') || document.querySelector('.image-cards') || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
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
        // Specifically optimized for Chrome and Edge to ensure "Hey kids, welcome to Kids Zone" plays on load.
        // Chrome requires a "User Gesture" (click, key, etc.) before speaking.
        const isActuallyHome = document.querySelector('.activities-grid') && document.querySelector('.image-cards');
        
        if (isActuallyHome) {
            const welcomeText = "Hey kids, welcome to Kids Zone";
            let greetTriggered = false;

            const speakNow = () => {
                if (greetTriggered) return;
                
                const currentVoices = window.speechSynthesis.getVoices();
                if (currentVoices.length > 0) {
                    greetTriggered = true; 
                    
                    const utterance = new SpeechSynthesisUtterance(welcomeText);
                    utterance.rate = 1.0;
                    utterance.pitch = 1.1;
                    const preferredVoice = currentVoices.find(v => (v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Female')) && v.lang.startsWith('en')) || currentVoices.find(v => v.lang.startsWith('en'));
                    if (preferredVoice) utterance.voice = preferredVoice;

                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(utterance);

                    // Stop listening to all initialization events
                    ['mousedown', 'touchstart', 'keydown', 'scroll', 'wheel', 'mousemove', 'click'].forEach(type => {
                        window.removeEventListener(type, speakNow);
                    });
                }
            };

            // Attach to every possible interaction to 'catch' the first gesture
            ['mousedown', 'touchstart', 'keydown', 'scroll', 'wheel', 'mousemove', 'click'].forEach(type => {
                window.addEventListener(type, speakNow, { once: true, passive: true });
            });

            // Re-trigger if voices load after the first interaction
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                const oldVoicesHandler = window.speechSynthesis.onvoiceschanged;
                window.speechSynthesis.onvoiceschanged = () => {
                    if (typeof oldVoicesHandler === 'function') oldVoicesHandler();
                    if (!greetTriggered) speakNow();
                };
            }

            // Chrome Prime Hook: We repeatedly attempt to initialize the engine until it speaks
            const warmingInterval = setInterval(() => {
                if (greetTriggered) {
                    clearInterval(warmingInterval);
                    return;
                }
                // Try to speak silently if browser allows priming
                if (window.speechSynthesis.getVoices().length > 0) {
                    const silentUtterance = new SpeechSynthesisUtterance("");
                    silentUtterance.volume = 0;
                    window.speechSynthesis.speak(silentUtterance);
                }
            }, 800);
        }
    }

    // Trigger after layout settles
    setTimeout(initEntranceAnimations, 100);

    // ==========================================================================
    // MATH MODULE: Addition & Subtraction Interactive Logic
    // ==========================================================================
    
    const APPLE_IMG_URL = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Red%20apple/3D/red_apple_3d.png";

    // --- 1. Addition Logic ---
    const addInput = document.getElementById('answer-input');
    const addCheckBtn = document.getElementById('check-btn');
    const addFeedback = document.getElementById('feedback-msg');
    const addNum1 = document.getElementById('num1');
    const addNum2 = document.getElementById('num2');
    const appleGroup1 = document.getElementById('apple-group-1');
    const appleGroup2 = document.getElementById('apple-group-2');

    let currentAddAnswer = 0;

    function initAddition() {
        if (!addNum1 || !addNum2) return;

        // Generate numbers such that sum <= 10
        const n1 = Math.floor(Math.random() * 6); // 0-5
        const n2 = Math.floor(Math.random() * 5) + 1; // 1-5
        currentAddAnswer = n1 + n2;

        // Update Numbers
        addNum1.textContent = n1;
        addNum2.textContent = n2;

        // Update Apples
        if (appleGroup1) {
            appleGroup1.innerHTML = '';
            for (let i = 0; i < n1; i++) {
                const item = document.createElement('div');
                item.className = 'apple-item';
                item.innerHTML = `<img src="${APPLE_IMG_URL}" alt="Apple">`;
                appleGroup1.appendChild(item);
            }
        }
        if (appleGroup2) {
            appleGroup2.innerHTML = '';
            for (let i = 0; i < n2; i++) {
                const item = document.createElement('div');
                item.className = 'apple-item';
                item.innerHTML = `<img src="${APPLE_IMG_URL}" alt="Apple">`;
                appleGroup2.appendChild(item);
            }
        }

        // Reset UI
        if (addInput) addInput.value = '';
        if (addFeedback) {
            addFeedback.textContent = '';
            addFeedback.style.color = 'inherit';
        }
    }

    if (addCheckBtn) {
        addCheckBtn.addEventListener('click', () => {
            const userAnswer = parseInt(addInput.value);
            if (isNaN(userAnswer)) {
                addFeedback.textContent = "Please enter a number!";
                addFeedback.style.color = "#f59e0b";
                return;
            }

            if (userAnswer === currentAddAnswer) {
                addFeedback.textContent = "✨ Correct! Well done! ✨";
                addFeedback.style.color = "#10b981";
                speakImmediate("Correct! Well done!");
                
                // Shuffle to new problem after 2 seconds
                setTimeout(initAddition, 2000);
            } else {
                addFeedback.textContent = "Oops! Wrong answer! 🍎";
                addFeedback.style.color = "#ef4444";
                speakImmediate("Wrong answer.");
                addInput.value = ''; // Clear input on wrong answer
                addInput.focus();
            }
        });

        // Allow 'Enter' key
        addInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addCheckBtn.click();
        });
    }

    // --- 2. Subtraction Logic ---
    const subInput = document.getElementById('sub-answer-input');
    const subCheckBtn = document.getElementById('sub-check-btn');
    const subFeedback = document.getElementById('sub-feedback-msg');
    const subNum1 = document.getElementById('sub-num1');
    const subNum2 = document.getElementById('sub-num2');
    const subAppleGroup1 = document.getElementById('sub-apple-group-1');
    const subAppleGroup2 = document.getElementById('sub-apple-group-2');

    let currentSubAnswer = 0;

    function initSubtraction() {
        if (!subNum1 || !subNum2) return;

        // Ensure minuend >= subtrahend
        const minuend = Math.floor(Math.random() * 6) + 5; // 5-10
        const subtrahend = Math.floor(Math.random() * 5) + 1; // 1-5
        currentSubAnswer = minuend - subtrahend;

        // Update Numbers
        subNum1.textContent = minuend;
        subNum2.textContent = subtrahend;

        // Update Apples (Group 1: Minuend)
        if (subAppleGroup1) {
            subAppleGroup1.innerHTML = '';
            for (let i = 0; i < minuend; i++) {
                const item = document.createElement('div');
                item.className = 'apple-item';
                item.innerHTML = `<img src="${APPLE_IMG_URL}" alt="Apple">`;
                subAppleGroup1.appendChild(item);
            }
        }

        // Update Apples (Group 2: Subtrahend)
        if (subAppleGroup2) {
            subAppleGroup2.innerHTML = '';
            for (let i = 0; i < subtrahend; i++) {
                const item = document.createElement('div');
                item.className = 'apple-item';
                const img = document.createElement('img');
                img.src = APPLE_IMG_URL;
                img.alt = "Apple";
                // Returned to normal apple color as requested
                item.appendChild(img);
                subAppleGroup2.appendChild(item);
            }
        }

        // Reset UI
        if (subInput) subInput.value = '';
        if (subFeedback) {
            subFeedback.textContent = '';
            subFeedback.style.color = 'inherit';
        }
    }

    if (subCheckBtn) {
        subCheckBtn.addEventListener('click', () => {
            const userAnswer = parseInt(subInput.value);
            if (isNaN(userAnswer)) {
                subFeedback.textContent = "Please enter a number!";
                subFeedback.style.color = "#f59e0b";
                return;
            }

            if (userAnswer === currentSubAnswer) {
                subFeedback.textContent = "✨ Correct! Well done! ✨";
                subFeedback.style.color = "#10b981";
                speakImmediate("Correct! Well done!");
                
                // Shuffle to new problem after 2 seconds
                setTimeout(initSubtraction, 2000);
            } else {
                subFeedback.textContent = "Oops! Wrong answer! 🍎";
                subFeedback.style.color = "#ef4444";
                speakImmediate("Wrong answer.");
                subInput.value = ''; // Clear input on wrong answer
                subInput.focus();
            }
        });

        // Allow 'Enter' key
        subInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') subCheckBtn.click();
        });
    }

    // --- Global Initialize ---
    initAddition();
    initSubtraction();
});
