// script.js

// --- 1. SELECTING OUR HTML ELEMENTS ---
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const wallpaperGrid = document.getElementById('wallpaper-grid-container');
const loadMoreBtn = document.querySelector('.load-more-btn');

// --- 2. PEXELS API SETUP ---
const apiKey = 'atojoYAOA4lGNSGHobmA0DcVM6gor10sTjpf2qeZyTNDUWyEf5JLMaTh'; 
const perPage = 16;
let currentPage = 1;
let currentSearchTerm = null;

// --- 3. DISPLAY FUNCTION ---
function displayWallpapers(photos) {
    photos.forEach(photo => {
        const wallpaperItem = document.createElement('div');
        wallpaperItem.classList.add('wallpaper-item');

        wallpaperItem.innerHTML = `
            <img src="${photo.src.large2x}" alt="${photo.alt}">
            <a href="${photo.src.original}" target="_blank" download class="download-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 15.586l-4.293-4.293a1 1 0 011.414-1.414L11 11.586V4a1 1 0 112 0v7.586l1.879-1.879a1 1 0 111.414 1.414L12 15.586zM19 18H5a1 1 0 110-2h14a1 1 0 110 2z"/></svg>
            </a>
        `;

        wallpaperGrid.appendChild(wallpaperItem);

        // Add the 'visible' class after a tiny delay to trigger the animation
        setTimeout(() => {
            wallpaperItem.classList.add('visible');
        }, 10); // A 10ms delay is enough
    });
}

// --- 4. FETCH FUNCTION (With Load More Logic) ---
async function fetchWallpapers(query, isAppending = false) {
    // This 'if' statement is the key part for the "Load More" button.
    // It only clears the grid if it's a NEW search.
    if (!isAppending) {
        wallpaperGrid.innerHTML = '';
        currentPage = 1;
    }

    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${currentPage}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayWallpapers(data.photos);

    } catch (error) {
        console.error('Error fetching wallpapers:', error);
        wallpaperGrid.innerHTML = `<p class="error-message">Oops! Something went wrong. Please try again.</p>`;
    }
}

// --- 5. EVENT LISTENER FOR THE SEARCH FORM ---
searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const searchTerm = searchInput.value.trim(); 
    if (searchTerm) {
        currentSearchTerm = searchTerm;
        fetchWallpapers(currentSearchTerm); // isAppending is false by default
    }
});

// --- 6. EVENT LISTENERS FOR CATEGORY BUTTONS ---
const categoryButtons = document.querySelectorAll('.categories button');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.textContent;
        currentSearchTerm = category;

        const currentActive = document.querySelector('.categories .active-btn');
        if (currentActive) {
            currentActive.classList.remove('active-btn');
        }
        button.classList.add('active-btn');
        fetchWallpapers(category); // isAppending is false by default
    });
});

// --- 7. EVENT LISTENER FOR LOAD MORE BUTTON ---
loadMoreBtn.addEventListener('click', () => {
    if (currentSearchTerm) {
        currentPage++; // Go to the next page
        fetchWallpapers(currentSearchTerm, true); // Pass 'true' to append images
    }
});

// --- 8. INITIAL FETCH ON PAGE LOAD ---
currentSearchTerm = 'Nature';
fetchWallpapers(currentSearchTerm);