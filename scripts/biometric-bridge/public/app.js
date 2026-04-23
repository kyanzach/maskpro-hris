const socket = io();

// UI Elements
const idleView = document.getElementById('idle-view');
const punchView = document.getElementById('punch-view');
const clockTime = document.getElementById('clock-time');
const clockDate = document.getElementById('clock-date');

const punchAvatar = document.getElementById('punch-avatar');
const punchName = document.getElementById('punch-name');
const punchTitle = document.getElementById('punch-title');
const punchTimestamp = document.getElementById('punch-timestamp');
const bibleVerse = document.getElementById('bible-verse');
const bibleRef = document.getElementById('bible-ref');

let returnToIdleTimeout;

// Motivation List
const verses = [
    { text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.", ref: "Colossians 3:23" },
    { text: "Commit to the Lord whatever you do, and he will establish your plans.", ref: "Proverbs 16:3" },
    { text: "Let all that you do be done in love.", ref: "1 Corinthians 16:14" },
    { text: "I can do all things through him who strengthens me.", ref: "Philippians 4:13" },
    { text: "And let us not grow weary of doing good, for in due season we will reap, if we do not give up.", ref: "Galatians 6:9" },
    { text: "In all toil there is profit, but mere talk tends only to poverty.", ref: "Proverbs 14:23" },
    { text: "The Lord is my strength and my shield; in him my heart trusts.", ref: "Psalm 28:7" }
];

// Clock Logic
function updateClock() {
    const now = new Date();
    clockTime.innerText = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    clockDate.innerText = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

// Socket Logic
socket.on('punch', (data) => {
    console.log('Received punch data:', data);

    // Clear any existing timeout
    if (returnToIdleTimeout) clearTimeout(returnToIdleTimeout);

    // Update UI
    const punchDate = new Date(data.timestamp);
    punchTimestamp.innerText = punchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (data.user) {
        punchName.innerText = data.user.full_name || 'Unknown Employee';
        punchTitle.innerText = data.user.job_title || 'MaskPro Staff';
        
        // Handle avatar
        if (data.user.profile_picture) {
            // Because profile_picture is stored as a relative path like /uploads/...
            // we must point it to the cloud HRIS server
            punchAvatar.src = `https://hris.maskpro.ph${data.user.profile_picture}`;
        } else {
            // Placeholder
            const fallbackInitial = data.user.full_name ? data.user.full_name.charAt(0) : 'U';
            punchAvatar.src = `https://ui-avatars.com/api/?name=${fallbackInitial}&background=6366f1&color=fff&size=200`;
        }
    }

    // Set Random Verse
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    bibleVerse.innerText = `"${randomVerse.text}"`;
    bibleRef.innerText = `- ${randomVerse.ref}`;

    // Switch Views
    idleView.classList.remove('active');
    punchView.classList.remove('active'); // reset animation
    
    // trigger reflow
    void punchView.offsetWidth; 
    
    punchView.classList.add('active');

    // Return to Idle after 7 seconds
    returnToIdleTimeout = setTimeout(() => {
        punchView.classList.remove('active');
        idleView.classList.add('active');
        punchAvatar.src = ''; // clear image to prevent flashing old image on next punch
    }, 7000);
});
