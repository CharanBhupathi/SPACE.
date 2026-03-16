// ===============================
// ZOOM PREVENTION
// ===============================
document.addEventListener('DOMContentLoaded', () => {

    // Prevent double‑tap zoom on mobile (only on empty page area)
    let lastTap = 0;
    document.addEventListener('touchend', (event) => {

        // Ignore UI elements and controls
        if (event.target.closest('button, a, input, textarea, #musicControl')) return;

        const now = Date.now();
        if (now - lastTap < 400) {
            event.preventDefault();
        }

        lastTap = now;

    }, false);


    // Prevent CTRL/CMD + scroll zoom
    document.addEventListener('wheel', (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
    }, { passive: false });


    // Prevent keyboard zoom only
    document.addEventListener('keydown', (event) => {

        if ((event.ctrlKey || event.metaKey) &&
            (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')) {
            event.preventDefault();
        }

    });


    // Disable right click
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

});


// ===============================
// MUSIC STATE STORAGE
// ===============================
let isPageLeaving = false;
const saveMusicState = () => {

    const music = document.getElementById('backgroundMusic');

    if (!music) return;

    sessionStorage.setItem('musicPlaying', (!music.paused).toString());
    sessionStorage.setItem('musicTime', music.currentTime.toString());

};


// Save state before leaving page
window.addEventListener('beforeunload', () => {
    isPageLeaving = true;
    saveMusicState();
});

window.addEventListener('pagehide', () => {
    isPageLeaving = true;
    saveMusicState();
});

// Save state when user clicks any navigation link
const navLinks = document.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        saveMusicState();
    });
});


// ===============================
// MUSIC INITIALIZATION
// ===============================
document.addEventListener('DOMContentLoaded', () => {

    const music = document.getElementById('backgroundMusic');
    const button = document.getElementById('musicControl');

    if (!music) return;


    // Basic audio setup
    music.volume = 0.3;
    // Stop HTML autoplay from restarting track
    music.preload = 'auto';


    // Restore state
    const wasPlaying = sessionStorage.getItem('musicPlaying');
    const savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');

    const restoreMusic = () => {

        if (savedTime > 0) {
            music.currentTime = savedTime;
        }

        // First visit → start music
        if (wasPlaying === null) {
            music.play().catch(()=>{});
            sessionStorage.setItem('musicPlaying','true');
            return;
        }

        // Resume playing if it was playing
        if (wasPlaying === 'true') {
            music.play().catch(()=>{});
        }

    };

    if (music.readyState >= 1) {
        restoreMusic();
    } else {
        music.addEventListener('loadedmetadata', restoreMusic, { once:true });
    }


    // ===============================
    // BUTTON TEXT UPDATE
    // ===============================
    const updateButton = () => {

        if (!button) return;

        button.textContent = music.paused ? 'Play' : 'Pause';

    };


    updateButton();


    music.addEventListener('play', () => {

        sessionStorage.setItem('musicPlaying', 'true');
        updateButton();

    });


    music.addEventListener('pause', () => {

        // If page is changing, don't treat it as a real pause
        if (isPageLeaving) {
            sessionStorage.setItem('musicPlaying', 'true');
            return;
        }

        sessionStorage.setItem('musicPlaying', 'false');
        saveMusicState();
        updateButton();

    });


    // ===============================
    // PLAY / PAUSE CONTROL
    // ===============================
    if (button) {

        const toggleMusic = (e) => {

            e.stopPropagation();

            if (music.paused) {

                music.play().catch(() => {});

            } else {

                music.pause();

            }

        };


        button.addEventListener('click', toggleMusic, { passive: false });
        button.addEventListener('touchstart', toggleMusic, { passive: false });

    }


    // ===============================
    // CONTINUOUS STATE SAVE
    // ===============================
    const continuousSave = () => {

        if (!music.paused) {
            sessionStorage.setItem('musicPlaying', 'true');
            sessionStorage.setItem('musicTime', music.currentTime.toString());
        }

        requestAnimationFrame(continuousSave);

    };


    requestAnimationFrame(continuousSave);


    // Save when tab hidden
    document.addEventListener('visibilitychange', saveMusicState);

});

// ===============================
// INDEX TYPING ANIMATION
// ===============================

window.addEventListener('DOMContentLoaded', () => {

    const textEl = document.getElementById('centerText');
    if(!textEl) return;

    const fullText = "Charan Bhupathi.";
    let index = 0;
    let typing = true;

    const animate = () => {

        if(typing){

            index++;
            textEl.textContent = fullText.slice(0,index);

            if(index === fullText.length){
                typing = false;
                setTimeout(animate,1200);
                return;
            }

        }else{

            index--;
            textEl.textContent = fullText.slice(0,index);

            if(index === 0){
                typing = true;
            }

        }

        setTimeout(animate,120);

    };

    animate();

});
