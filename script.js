/* ============================================================
   RCAM SMART LOBBY MONITOR
============================================================ */

'use strict';

/* ---------------------------
   1. DOM REFERENCES
---------------------------- */
const slides = Array.from(document.querySelectorAll('.slide'));
const companyModal = document.getElementById('companyModal');
const modalContent = companyModal?.querySelector('.modal-content');
const closeModalButton = document.getElementById('closeModal');
const modalTabs = Array.from(document.querySelectorAll('.modal-tab'));
const modalPanels = Array.from(document.querySelectorAll('.modal-panel'));
const floorTabs = Array.from(document.querySelectorAll('.floor-tab'));
const floorMaps = Array.from(document.querySelectorAll('.floor-map'));
const mapRooms = Array.from(document.querySelectorAll('.map-room'));
const mapDetails = document.getElementById('mapDetails');
const locationName = document.getElementById('locationName');
const locationDescription = document.getElementById('locationDescription');
const officeDirectionImage = document.getElementById('officeDirectionImage');
const officeImagePlaceholder = document.getElementById('officeImagePlaceholder');
const backToFloorPlan = document.getElementById('backToFloorPlan');
const floorTabsContainer = document.querySelector('#map .floor-tabs');

let currentSlide = 0;
let currentFloor = 'ground';
let inactivityTimer = null;
let lastFocusedElement = null;
let currentTab = 'about';

const NORMAL_INACTIVITY_LIMIT = 90000;
const MAP_INACTIVITY_LIMIT = 90000;
const SLIDE_INTERVAL = 5000;

/* ---------------------------
   2. OFFICE DIRECTORY
---------------------------- */
const locations = {

    /* ==========================
       GROUND FLOOR
    ========================== */

    "Chancery": {
        name: "CHANCERY (Under Renovation. Please see the Updated Location of the Office)",
        floor: "Ground Floor",
        description:
            "Administrative office of the Roman Catholic Archbishop of Manila, supporting the coordination and administration of archdiocesan affairs."
    },

    "OWSD": {
        name: "OFFICE FOR WORK SYSTEMS AND DEVELOPMENT",
        floor: "Ground Floor",
        description:
            "Office supporting the development and improvement of organizational work systems and processes."
    },

    "OSM": {
        name: "OFFICE FOR STRATEGIC MANAGEMENT",
        floor: "Ground Floor",
        description:
            "Office supporting strategic planning, organizational development, and management initiatives."
    },

    "Cafeteria": {
        name: "CANTEEN",
        floor: "Ground Floor",
        description:
            "Designated area where employees and visitors can have meals and refreshments."
    },

    "Engineering": {
        name: "ENGINEERING DEPARTMENT",
        floor: "Ground Floor",
        description:
            "Department responsible for engineering-related facilities, building maintenance, and technical support."
    },

    "Chapel": {
        name: "RCAM CHAPEL",
        floor: "Ground Floor",
        description: "RCAM Chapel."
    },

    "Common Restroom": {
        name: "COMMON RESTROOMS",
        floor: "Ground Floor",
        description:
            "Common restroom facilities available for employees and visitors."
    },

    "EWF": {
        name: "Employees' Welfare Fund",
        floor: "Ground Floor",
        description:
            "Ground Floor office area identified as EWF on the supplied floor plan."
    },

    "Temporary": {
        name: "TEMPORARY OFFICE SPACE",
        floor: "Ground Floor",
        description: "Temporary office space on the Ground Floor."
    },


    /* ==========================
       SECOND FLOOR
    ========================== */

    "Audit": {
        name: "AUDITING DEPARTMENT",
        floor: "Second Floor",
        description:
            "Department supporting auditing activities and the review of financial and administrative processes."
    },

    "ALC": {
        name: "COMMISSION ON DIVINE WORSHIP",
        floor: "Second Floor",
        description:
            "Commission concerned with liturgical matters and the promotion of proper worship practices within the Archdiocese."
    },

    "IT": {
        name: "INFORMATION TECHNOLOGY DEPARTMENT",
        floor: "Second Floor",
        description:
            "Department providing technical assistance and supporting computer systems, digital services, and IT infrastructure."
    },

    "PAD": {
        name: "PROPERTIES ADMINISTRATION DEPARTMENT",
        floor: "Second Floor",
        description:
            "Department supporting the administration, management, and maintenance of archdiocesan properties."
    },

    "TAD": {
        name: "TREASURY AND ACCOUNTING DEPARTMENT",
        floor: "Second Floor",
        description:
            "Department handling treasury-related responsibilities, accounting records, and financial administration."
    },

    "Conference Rooms": {
        name: "ARCHBISHOP GABRIEL REYES CONFERENCE ROOM",
        floor: "Second Floor",
        description:
            "Conference facility designated for meetings, discussions, and official gatherings."
    },

    "Legal": {
        name: "LEGAL DEPARTMENT",
        floor: "Second Floor",
        description:
            "Department providing legal assistance and support concerning organizational and administrative matters."
    },

    "Cultural": {
        name: "CULTURAL HERITAGE",
        floor: "Second Floor",
        description:
            "Coordinates archdiocesan heritage initiatives, consults on sacred art and church patrimony, and leads public outreach such as art competitions and exhibitions."
    },

    "OPNE": {
        name: "Office for the Promotion of the New Evangelization",
        floor: "Second Floor",
        description:
            "Assists the Archbishop and the Archdiocese of Manila with pastoral research, church animation, and evangelization events."
    },

    "second-restroom": {
        name: "COMMON RESTROOMS",
        floor: "Second Floor",
        description:
            "Common restroom facilities available for employees and visitors."
    },


    /* ==========================
       THIRD FLOOR
    ========================== */

    "MC": {
        name: "OFFICE OF THE VICAR GENERAL AND MODERATOR CURIAE",
        floor: "Third Floor",
        description:
            "Office assisting in the governance and administration of the Archdiocese and the coordination of curial affairs."
    },

    "HR": {
        name: "HUMAN RESOURCE DEVELOPMENT DEPARTMENT",
        floor: "Third Floor",
        description:
            "Department supporting personnel administration, employee development, and human resource-related services."
    },

    "Museum": {
        name: "MUSEO NG ARKIDIYOSESIS NG MAYNILA",
        floor: "Third Floor",
        description:
            "Museum preserving and presenting the religious, cultural, and historical heritage of the Archdiocese of Manila."
    },

    "Archives": {
        name: "MANILA ARCHDIOCESAN ARCHIVES",
        floor: "Third Floor",
        description:
            "Facility preserving historical documents, records, and archival materials relating to the Archdiocese of Manila."
    },

    "Tribunal": {
        name: "METROPOLITAN TRIBUNAL",
        floor: "Third Floor",
        description:
            "Ecclesiastical judicial office handling matters according to the laws and procedures of the Catholic Church."
    },

    "AOC": {
        name: "ARCHDIOCESAN OFFICE OF COMMUNICATIONS",
        floor: "Third Floor",
        description:
            "Office supporting communications, information dissemination, and media-related activities of the Archdiocese."
    },

    "MC Conference": {
        name: "MC CONFERENCE ROOM",
        floor: "Third Floor",
        description:
            "Conference room serving the Metropolitan Curia."
    },

    "third-restroom": {
        name: "COMMON RESTROOMS",
        floor: "Third Floor",
        description:
            "Common restroom facilities available for employees and visitors."
    },


    /* ==========================
       FOURTH FLOOR
    ========================== */

    "Bishop": {
        name: "BISHOP DOMINGO DE SALAZAR, OP HALL",
        floor: "Fourth Floor",
        description: "Hall."
    },

    "Cardi": {
        name: "CARDINAL RUFINO SANTOS HALL (BOARDROOM 1)",
        floor: "Fourth Floor",
        description: "Boardroom."
    },

    "Arch": {
        name: "ARCHBISHOP MICHAEL O'DOHERTY HALL (BOARDROOM 2)",
        floor: "Fourth Floor",
        description: "Boardroom 2."
    },

    "Stairs": {
        name: "STAIRS",
        floor: "Multiple Floors",
        description:
            "Stairways providing access between the different floors of the building."
    },

    "Elevator": {
        name: "ELEVATOR",
        floor: "Multiple Floors",
        description:
            "Elevator providing convenient vertical access between the different floors."
    },

    "Fourth Lobby": {
        name: "FOURTH FLOOR LOBBY",
        floor: "Fourth Floor",
        description:
            "Common lobby and circulation area on the Fourth Floor."
    },

    "fourth-restroom": {
        name: "COMMON RESTROOMS",
        floor: "Fourth Floor",
        description:
            "Common restroom facilities available for employees and visitors."
    }

};

/* ---------------------------
   3. OFFICE DIRECTION IMAGE FILES
   Paths are checked against the supplied project assets.
---------------------------- */
const officeDirectionImages = {
    ground: {
        'Chancery': 'Chancery.webp',
        'OWSD': 'OWSD.webp',
        'OSM': 'OSM.webp',
        'Cafeteria': 'Cafeteria.webp',
        'Engineering': 'Engineering.webp',
        'Chapel': 'Chapel.webp',
        'Common Restroom': 'ground-restroom.webp',
        'EWF': 'EWF.webp',
        'Temporary': 'Temporary.webp',
        'Stairs': 'Stairs.webp',
        'Elevator': 'Elevator.webp'
    },
    second: {
        'Audit': 'Audit.webp',
        'ALC': 'ALC.webp',
        'IT': 'IT.webp',
        'PAD': 'PAD.webp',
        'TAD': 'TAD.webp',
        'Conference Rooms': 'Conference.webp',
        'Legal': 'Legal.webp',
        'Cultural': 'Cultural.webp',
        'OPNE': 'OPNE.webp',
        'Stairs': 'second-stairs.webp',
        'Elevator': 'second-elevator.webp',
        'second-restroom': 'second-restroom.webp'
    },
    third: {
        'MC': 'MC Office.webp',
        'MC Conference': 'MC Conference.webp',
        'HR': 'HRDD.webp',
        'Museum': 'Museo.webp',
        'Archives': 'Archives.webp',
        'Tribunal': 'Tribunal.webp',
        'AOC': 'AOC.webp',
        'Stairs': 'third-stairs.webp',
        'Elevator': 'third-elevator.webp',
        'third-restroom': 'third-restroom.webp'
    },
    fourth: {
        'Bishop': 'Salazar-OP.webp',
        'Cardi': 'Rufino.webp',
        'Arch': 'doherty.webp',
        'Fourth Lobby': 'fourth-lobby.webp',
        'fourth-restroom': 'fourth-restroom.webp'
    }
};

/* ---------------------------
   4. DATE AND TIME
---------------------------- */
function updateDateTime() {
    const now = new Date();
    const clock = document.getElementById('clock');
    const date = document.getElementById('date');

    if (clock) {
        clock.textContent = now.toLocaleTimeString('en-PH', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    }
    if (date) {
        date.textContent = now.toLocaleDateString('en-PH', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}
updateDateTime();
window.setInterval(updateDateTime, 1000);

/* ---------------------------
   5. SLIDESHOW
---------------------------- */
function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
        slide.setAttribute('aria-hidden', String(i !== currentSlide));
    });
}

function advanceSlideshow() {
    // Do not distract visitors while they are reading or navigating.
    if (companyModal?.classList.contains('show')) return;
    if (document.hidden || slides.length < 2) return;
    showSlide(currentSlide + 1);
}
showSlide(0);
window.setInterval(advanceSlideshow, SLIDE_INTERVAL);

/* ---------------------------
   6. MODAL OPEN / CLOSE
---------------------------- */
function openCompanyModal() {
    if (!companyModal) return;
    lastFocusedElement = document.activeElement;
    companyModal.classList.add('show');
    companyModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    resetInactivityTimer();
    window.setTimeout(() => closeModalButton?.focus({ preventScroll: true }), 80);
}

function hideCompanyModal() {
    if (!companyModal) return;
    companyModal.classList.remove('show');
    companyModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    window.clearTimeout(inactivityTimer);
    resetIndoorMap();
    switchModalTab('about', false);
    if (lastFocusedElement?.isConnected) lastFocusedElement.focus({ preventScroll: true });
}

function getInactivityLimit() {
    return currentTab === 'map' ? MAP_INACTIVITY_LIMIT : NORMAL_INACTIVITY_LIMIT;
}

function resetInactivityTimer() {
    window.clearTimeout(inactivityTimer);
    if (!companyModal?.classList.contains('show')) return;
    inactivityTimer = window.setTimeout(hideCompanyModal, getInactivityLimit());
}

// Only the welcome screen opens the information modal. Interactions inside it
// never bubble into an accidental reopen.
document.addEventListener('click', event => {
    if (!companyModal || companyModal.contains(event.target)) return;
    if (event.target.closest('button, a, input, select, textarea')) return;
    openCompanyModal();
});

closeModalButton?.addEventListener('click', event => {
    event.stopPropagation();
    hideCompanyModal();
});

companyModal?.addEventListener('click', event => {
    if (event.target === companyModal) hideCompanyModal();
});

// Use pointer activity once, avoiding duplicate timer resets from click + touch.
companyModal?.addEventListener('pointerdown', resetInactivityTimer, { passive: true });
companyModal?.addEventListener('keydown', resetInactivityTimer);

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && companyModal?.classList.contains('show')) {
        hideCompanyModal();
        return;
    }

    // Keep keyboard focus inside the open dialog.
    if (event.key === 'Tab' && companyModal?.classList.contains('show')) {
        const focusable = Array.from(companyModal.querySelectorAll(
            'button:not([disabled]):not([hidden]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
        }
    }
});

/* ---------------------------
   7. MODAL TABS
---------------------------- */
function switchModalTab(target, resetMap = true) {
    if (!target || !document.getElementById(target)) return;
    currentTab = target;

    modalTabs.forEach(tab => {
        const active = tab.dataset.tab === target;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    modalPanels.forEach(panel => {
        const active = panel.id === target;
        panel.hidden = !active;
        panel.classList.toggle('active', active);
    });

    modalContent?.classList.toggle('indoor-map-mode', target === 'map');
    if (target === 'map' && resetMap) {
        resetIndoorMap();
        requestAnimationFrame(scrollMapPanelIntoView);
    }
    resetInactivityTimer();
}

modalTabs.forEach(tab => tab.addEventListener('click', event => {
    event.stopPropagation();
    switchModalTab(tab.dataset.tab);
}));

/* ---------------------------
   8. INDOOR MAP HELPERS
---------------------------- */
function clearRoomSelection() {
    mapRooms.forEach(room => {
        room.classList.remove('active', 'search-match');
        room.setAttribute('aria-pressed', 'false');
    });
}

function hideOfficeDirection() {
    if (officeDirectionImage) {
        officeDirectionImage.hidden = true;
        officeDirectionImage.removeAttribute('src');
        officeDirectionImage.onload = null;
        officeDirectionImage.onerror = null;
    }
    if (officeImagePlaceholder) officeImagePlaceholder.hidden = true;
    if (backToFloorPlan) backToFloorPlan.hidden = true;
}

function scrollMapPanelIntoView() {
    const mapPanel = document.getElementById('map');
    if (!modalContent || !mapPanel) return;
    const modalRect = modalContent.getBoundingClientRect();
    const panelRect = mapPanel.getBoundingClientRect();
    const target = modalContent.scrollTop + panelRect.top - modalRect.top - 12;
    modalContent.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
}

function scrollToMapDetails() {
    if (!modalContent || !mapDetails || mapDetails.hidden) return;
    const modalRect = modalContent.getBoundingClientRect();
    const detailsRect = mapDetails.getBoundingClientRect();
    const target = modalContent.scrollTop + detailsRect.top - modalRect.top - 12;
    modalContent.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
}

function switchFloor(selectedFloor) {
    const selectedPanel = document.getElementById(selectedFloor);
    if (!selectedPanel) return;

    currentFloor = selectedFloor;
    if (mapDetails) mapDetails.hidden = true;
    if (floorTabsContainer) floorTabsContainer.hidden = false;

    floorTabs.forEach(tab => {
        const active = tab.dataset.floor === selectedFloor;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', String(active));
    });

    floorMaps.forEach(panel => {
        const active = panel.id === selectedFloor;
        panel.hidden = !active;
        panel.classList.toggle('active', active);
    });

    clearRoomSelection();
    hideOfficeDirection();
    if (locationName) locationName.textContent = 'SELECT A LOCATION';
    if (locationDescription) locationDescription.textContent =
        'Choose an office or facility from the selected floor.';
    requestAnimationFrame(scrollMapPanelIntoView);
    resetInactivityTimer();
}

function showMapImageError(message) {
    if (officeDirectionImage) officeDirectionImage.hidden = true;
    if (officeImagePlaceholder) {
        officeImagePlaceholder.textContent = message;
        officeImagePlaceholder.hidden = false;
    }
}

function selectMapRoom(room) {
    if (!room) return;
    const locationKey = room.dataset.location;
    const info = locations[locationKey];
    const imageFilename = officeDirectionImages[currentFloor]?.[locationKey];

    clearRoomSelection();
    room.classList.add('active');
    room.setAttribute('aria-pressed', 'true');

    if (mapDetails) mapDetails.hidden = false;
    if (floorTabsContainer) floorTabsContainer.hidden = true;
    const activeFloorPanel = document.getElementById(currentFloor);
    if (activeFloorPanel) activeFloorPanel.hidden = true;

    if (!info) {
        if (locationName) locationName.textContent = 'LOCATION INFORMATION UNAVAILABLE';
        if (locationDescription) locationDescription.textContent =
            'Please ask the lobby personnel for assistance.';
        showMapImageError('Directions for this location are not available yet. Please ask the lobby personnel for assistance.');
        if (backToFloorPlan) backToFloorPlan.hidden = false;
        requestAnimationFrame(scrollToMapDetails);
        resetInactivityTimer();
        return;
    }

    if (locationName) locationName.textContent = info.name;
    if (locationDescription) locationDescription.textContent = `${info.floor} | ${info.description}`;

    if (backToFloorPlan) backToFloorPlan.hidden = false;
    if (officeImagePlaceholder) {
        officeImagePlaceholder.textContent = 'The direction image for this location is not available yet. Please ask the lobby personnel for assistance.';
        officeImagePlaceholder.hidden = Boolean(imageFilename);
    }

    if (!imageFilename || !officeDirectionImage) {
        showMapImageError('A direction image has not been assigned to this location yet. Please ask the lobby personnel for assistance.');
    } else {
        const imagePath = `Images/general/Floor/${currentFloor}/${encodeURIComponent(imageFilename).replace(/%20/g, '%20')}`;
        officeDirectionImage.onload = () => {
            officeDirectionImage.hidden = false;
            if (officeImagePlaceholder) officeImagePlaceholder.hidden = true;
            requestAnimationFrame(scrollToMapDetails);
        };
        officeDirectionImage.onerror = () => showMapImageError(
            'The direction image could not be loaded. Please ask the lobby personnel for assistance.'
        );
        officeDirectionImage.hidden = true;
        officeDirectionImage.src = imagePath;
    }

    // Details are at the top of the map panel, so guests see them immediately.
    requestAnimationFrame(scrollToMapDetails);
    resetInactivityTimer();
}

floorTabs.forEach(tab => tab.addEventListener('click', event => {
    event.stopPropagation();
    switchFloor(tab.dataset.floor);
}));

mapRooms.forEach(room => room.addEventListener('click', event => {
    event.stopPropagation();
    selectMapRoom(room);
}));

backToFloorPlan?.addEventListener('click', event => {
    event.stopPropagation();
    switchFloor(currentFloor);
});

function resetIndoorMap() {
    clearRoomSelection();
    hideOfficeDirection();
    if (mapDetails) mapDetails.hidden = true;
    if (floorTabsContainer) floorTabsContainer.hidden = false;
    if (locationName) locationName.textContent = 'SELECT A LOCATION';
    if (locationDescription) locationDescription.textContent =
        'Choose an office or facility from the selected floor.';
    // Reset to Ground Floor whenever visitors enter the map again.
    currentFloor = 'ground';
    floorTabs.forEach(tab => {
        const active = tab.dataset.floor === 'ground';
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', String(active));
    });
    floorMaps.forEach(panel => {
        const active = panel.id === 'ground';
        panel.hidden = !active;
        panel.classList.toggle('active', active);
    });
}

/* ---------------------------
   9. IMAGE FALLBACKS
---------------------------- */
document.querySelectorAll('.general-floor-plan').forEach(image => {
    image.addEventListener('error', () => {
        image.hidden = true;
        const fallback = image.nextElementSibling;
        if (fallback) fallback.hidden = false;
    });
});

/* ---------------------------
   10. NEWS TICKER
---------------------------- */
const newsMessages = [
    'WELCOME TO THE ROMAN CATHOLIC ARCHBISHOP OF MANILA',
    'STAY UPDATED WITH THE LATEST RCAM ANNOUNCEMENTS',
    'ALWAYS LIVE A LIFE LIKE JESUS OUR CHRIST',
    'FAITH • SERVICE • COMMUNITY',
    'THANK YOU FOR VISITING RCAM'
];

const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack && newsMessages.length) {
    tickerTrack.replaceChildren();
    for (let copy = 0; copy < 2; copy += 1) {
        const content = document.createElement('div');
        content.className = 'ticker-content';
        if (copy === 1) content.setAttribute('aria-hidden', 'true');
        newsMessages.forEach((message, index) => {
            const item = document.createElement('span');
            item.textContent = message;
            content.appendChild(item);
            const separator = document.createElement('span');
            separator.className = 'ticker-separator';
            separator.textContent = index % 2 === 0 ? '✚' : '✦';
            content.appendChild(separator);
        });
        tickerTrack.appendChild(content);
    }
}

/* ---------------------------
   11. KIOSK SAFETY / INITIAL STATE
---------------------------- */
companyModal?.setAttribute('aria-hidden', 'true');
modalTabs.forEach(tab => {
    const active = tab.dataset.tab === 'about';
    tab.setAttribute('aria-selected', String(active));
    tab.setAttribute('tabindex', active ? '0' : '-1');
});
floorTabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.floor === 'ground')));
mapRooms.forEach(room => room.setAttribute('aria-pressed', 'false'));
resetIndoorMap();

// Pause all automatic visual movement when the page is in the background.
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && companyModal?.classList.contains('show')) resetInactivityTimer();
});


/* ---------------------------
   12. HOMEPAGE VIDEO PLAYLIST
   Add or rename MP4 files in the Videos folder and update this list.
---------------------------- */
const homepageVideo = document.getElementById('homepageVideo');
const homepageVideoSource = document.getElementById('homepageVideoSource');
const homepageVideoTitle = document.getElementById('homepageVideoTitle');
const videoMuteToggle = document.getElementById('videoMuteToggle');
const videoLoopToggle = document.getElementById('videoLoopToggle');
const videoPlaylist = document.getElementById('videoPlaylist');

const homepageVideos = [
    { title: 'RCAM Introduction', src: 'Videos/LANDSCAPE.mp4' },
    { title: 'RCAM History', src: 'Videos/rcam-history.mp4' },
    { title: 'RCAM Services', src: 'Videos/rcam-services.mp4' }
];
let activeHomepageVideo = 0;
let homepagePlaylistLoop = true;

function updateVideoPlaylistSelection() {
    videoPlaylist?.querySelectorAll('[data-video-index]').forEach(button => {
        const active = Number(button.dataset.videoIndex) === activeHomepageVideo;
        button.classList.toggle('active', active);
        button.setAttribute('aria-current', active ? 'true' : 'false');
    });
}

function playHomepageVideo(index, shouldAutoplay = true) {
    if (!homepageVideo || !homepageVideoSource || !homepageVideos.length) return;
    activeHomepageVideo = (index + homepageVideos.length) % homepageVideos.length;
    const selected = homepageVideos[activeHomepageVideo];
    homepageVideo.pause();
    homepageVideoSource.src = selected.src;
    homepageVideo.load();
    if (homepageVideoTitle) homepageVideoTitle.textContent = selected.title;
    updateVideoPlaylistSelection();
    if (shouldAutoplay) {
        // Browsers permit reliable autoplay when the video is muted.
        homepageVideo.muted = true;
        if (videoMuteToggle) {
            videoMuteToggle.textContent = 'Unmute';
            videoMuteToggle.setAttribute('aria-pressed', 'true');
        }
        const playAttempt = homepageVideo.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => {
                // Native controls remain available if kiosk/browser policy blocks autoplay.
            });
        }
    }
}

if (homepageVideo && homepageVideos.length) {
    playHomepageVideo(0, true);

    // Automatically advance to the next item; the playlist wraps back to the start.
    homepageVideo.addEventListener('ended', () => {
        if (activeHomepageVideo === homepageVideos.length - 1 && !homepagePlaylistLoop) return;
        playHomepageVideo(activeHomepageVideo + 1, true);
    });

    // Playlist buttons let visitors choose a video at any time.
    videoPlaylist?.addEventListener('click', event => {
        const button = event.target.closest('[data-video-index]');
        if (!button) return;
        const index = Number(button.dataset.videoIndex);
        if (Number.isInteger(index) && index >= 0 && index < homepageVideos.length) {
            playHomepageVideo(index, true);
        }
    });

    // The playlist repeats indefinitely (loop behavior across multiple videos).
    // Individual clips advance on 'ended' rather than looping the same clip forever.
    videoMuteToggle?.addEventListener('click', () => {
        homepageVideo.muted = !homepageVideo.muted;
        videoMuteToggle.textContent = homepageVideo.muted ? 'Unmute' : 'Mute';
        videoMuteToggle.setAttribute('aria-pressed', String(homepageVideo.muted));
    });

    // Pause playback when the kiosk page is hidden; resume muted when it becomes visible.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            homepageVideo.pause();
        } else if (!companyModal?.classList.contains('show')) {
            const playAttempt = homepageVideo.play();
            if (playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(() => {});
        }
    });
}