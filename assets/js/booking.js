let facilitiesData = [];
let selectedSport = 'all';
let filteredFacilities = [];
let selectedFacility = null;

// Expose functions
window.selectSport = selectSport;
window.openBookingModal = openBookingModal;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Load facilities first
        await fetchFacilitiesFromServer();
        
        // Initialize page components
        initBookingPage();
        initFilters();
        initBookingModal();
        initDatePicker();
        initMobileMenu();
        initSearchFunctionality();
        
        // Check for sport in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sportFromUrl = urlParams.get('sport');
        
        if (sportFromUrl) {
            // Small delay to ensure all elements are rendered
            setTimeout(() => {
                selectSport(sportFromUrl);
            }, 100);
        } else {
            // Default to 'all' if no sport specified
            selectSport('all');
        }
        
        // Add smooth scrolling for better UX
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
    } catch (error) {
        console.error('Error initializing booking page:', error);
    }
});

async function fetchFacilitiesFromServer() {
    try {
        const res = await fetch('http://localhost/project_web3/api/getFacilities.php');
        const data = await res.json();

        if (Array.isArray(data)) {
            facilitiesData = data.map(f => ({
                ...f,
                // Handle the image field mapping
                image: f.image_url || f.image,
                // Handle features properly - they're stored as JSON in database
                features: parseFeatures(f.features)
            }));
            filteredFacilities = [...facilitiesData];
        } else throw new Error('Invalid facilities data');
    } catch (err) {
        console.error('Error fetching facilities:', err);
        facilitiesData = [];
        filteredFacilities = [];
    }
}

function parseFeatures(features) {
    try {
        // If features is already an array, return it
        if (Array.isArray(features)) {
            return features;
        }
        
        // If features is a JSON string, parse it
        if (typeof features === 'string') {
            // Try to parse as JSON first
            try {
                const parsed = JSON.parse(features);
                return Array.isArray(parsed) ? parsed : [];
            } catch (jsonError) {
                // If JSON parsing fails, try comma-separated values
                return features.split(',').map(f => f.trim()).filter(f => f !== '');
            }
        }
        
        return [];
    } catch (error) {
        console.warn('Error parsing features:', error);
        return [];
    }
}

function initBookingPage() {
    renderSportCards();
    renderFacilities();
    updateFacilitiesCount();
    
    // Add event listeners to Book Now buttons
    setTimeout(() => {
        document.querySelectorAll('.book-now-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const facilityId = parseInt(btn.getAttribute('data-facility-id'));
                console.log('Book Now clicked for facility:', facilityId);
                window.location.href = `booking-form.html?facility=${facilityId}`;
            });
        });
    }, 100);
}

function renderSportCards() {
    const container = document.getElementById('sport-cards');
    if (!container) return;

    // Default sports with icons
    const defaultSports = {
        'football': { name: 'Football', icon: 'fas fa-futbol' },
        'basketball': { name: 'Basketball', icon: 'fas fa-basketball-ball' },
        'tennis': { name: 'Tennis', icon: 'fas fa-table-tennis' },
        'swimming': { name: 'Swimming', icon: 'fas fa-swimming-pool' },
        'volleyball': { name: 'Volleyball', icon: 'fas fa-volleyball-ball' },
        'badminton': { name: 'Badminton', icon: 'fas fa-shuttlecock' },
        'soccer': { name: 'Soccer', icon: 'fas fa-futbol' },
        'basket': { name: 'Basket', icon: 'fas fa-basketball-ball' },
        'padel': { name: 'Padel', icon: 'fas fa-table-tennis' },
        'paddle': { name: 'Paddle', icon: 'fas fa-table-tennis' },
        'handball': { name: 'Handball', icon: 'fas fa-basketball' },
        'hockey': { name: 'Hockey', icon: 'fas fa-hockey-puck' },
        'rugby': { name: 'Rugby', icon: 'fas fa-football-ball' },
        'golf': { name: 'Golf', icon: 'fas fa-golf-ball' },
        'baseball': { name: 'Baseball', icon: 'fas fa-baseball-ball' },
        'cricket': { name: 'Cricket', icon: 'fas fa-baseball-ball' },
        'squash': { name: 'Squash', icon: 'fas fa-table-tennis' },
        'table tennis': { name: 'Table Tennis', icon: 'fas fa-table-tennis' },
        'beach volleyball': { name: 'Beach Volleyball', icon: 'fas fa-volleyball-ball' }
    };

    // Get unique sports from facilities data
    const sportsInData = [...new Set(facilitiesData.map(f => 
        String(f.sport || '').toLowerCase().trim()
    ))].filter(Boolean);

    // Combine default sports with those found in the data
    const sports = [
        { id: 'all', name: 'All Sports', icon: 'fas fa-trophy' },
        ...sportsInData.map(sportId => ({
            id: sportId,
            name: defaultSports[sportId]?.name || sportId.charAt(0).toUpperCase() + sportId.slice(1),
            icon: defaultSports[sportId]?.icon || 'fas fa-running'
        })).filter((sport, index, self) => 
            index === self.findIndex(s => s.id === sport.id)
        )
    ];

    // Sort sports alphabetically, keeping 'All Sports' first
    sports.sort((a, b) => {
        if (a.id === 'all') return -1;
        if (b.id === 'all') return 1;
        return a.name.localeCompare(b.name);
    });

    container.innerHTML = sports.map(sport => {
        const count = facilitiesData.filter(f => 
            sport.id === 'all' || 
            String(f.sport || '').toLowerCase() === sport.id.toLowerCase()
        ).length;
        
        if (count === 0 && sport.id !== 'all') return '';
        
        return `
            <div class="sport-card ${sport.id.toLowerCase() === selectedSport.toLowerCase() ? 'active' : ''}" 
                 data-sport="${sport.id}" 
                 onclick="selectSport('${sport.id}')">
                <div class="sport-icon"><i class="${sport.icon}"></i></div>
                <h3>${sport.name}</h3>
                <p>${count} ${count === 1 ? 'facility' : 'facilities'}</p>
            </div>
        `;
    }).filter(Boolean).join('');
}

function selectSport(sport) {
    // Update the selected sport (case-insensitive match)
    selectedSport = sport.toLowerCase();
    
    // Update active state of sport cards
    document.querySelectorAll('.sport-card').forEach(card => {
        const cardSport = card.getAttribute('data-sport')?.toLowerCase();
        if (cardSport === selectedSport) {
            card.classList.add('active');
            // Scroll the active card into view if needed
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            card.classList.remove('active');
        }
    });
    
    // Apply filters with the new sport selection
    applyFilters();
    
    // Update URL with the selected sport for sharing/bookmarking
    const url = new URL(window.location);
    if (sport.toLowerCase() === 'all') {
        url.searchParams.delete('sport');
    } else {
        url.searchParams.set('sport', sport);
    }
    window.history.pushState({}, '', url);
    
    // Update the page title to reflect the current selection
    if (sport.toLowerCase() !== 'all') {
        const sportName = document.querySelector(`.sport-card[data-sport="${sport}"] h3`)?.textContent || sport;
        document.title = `${sportName} Facilities | SportZone`;
    } else {
        document.title = 'All Sports Facilities | SportZone';
    }
}

function initFilters() {
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');

    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function () {
            priceValue.textContent = this.value;
            applyFilters();
        });
    }

    const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));

    document.getElementById('clear-filters')?.addEventListener('click', () => {
        if (priceRange) priceRange.value = 300;
        if (priceValue) priceValue.textContent = '300';
        checkboxes.forEach(cb => cb.checked = true);
        selectedSport = 'all';
        document.getElementById('search-input').value = '';
        applyFilters();
        renderSportCards();
    });
}

function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
}

function applyFilters() {
    const maxPrice = parseInt(document.getElementById('price-range')?.value || '300');
    const morning = document.getElementById('morning')?.checked;
    const afternoon = document.getElementById('afternoon')?.checked;
    const evening = document.getElementById('evening')?.checked;
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';

    console.log('Applying filters - selectedSport:', selectedSport);
    console.log('Facilities data:', facilitiesData);

    filteredFacilities = facilitiesData.filter(facility => {
        // Normalize sport names for comparison
        const facilitySport = String(facility.sport || '').toLowerCase().trim();
        const normalizedSelectedSport = selectedSport.toLowerCase();
        
        // Check if facility.sport matches the selected sport (case-insensitive)
        const sportMatch = normalizedSelectedSport === 'all' || 
                         facilitySport === normalizedSelectedSport ||
                         facilitySport.includes(normalizedSelectedSport);
        
        const priceMatch = parseFloat(facility.price || 0) <= maxPrice;
        const timeMatch = morning || afternoon || evening; // This filter needs time data to work properly
        
        // Search in multiple fields
        const searchMatch = searchTerm === '' || 
            (facility.name && facility.name.toLowerCase().includes(searchTerm)) ||
            (facility.sport && facility.sport.toLowerCase().includes(searchTerm)) ||
            (facility.description && facility.description.toLowerCase().includes(searchTerm));

        console.log('Facility:', facility.name, 
                   'sportMatch:', sportMatch, 
                   'priceMatch:', priceMatch, 
                   'searchMatch:', searchMatch);
        
        return sportMatch && priceMatch && timeMatch && searchMatch;
    });

    renderFacilities();
    updateFacilitiesCount();
    
    // Re-add event listeners to Book Now buttons after filtering
    setTimeout(() => {
        document.querySelectorAll('.book-now-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const facilityId = parseInt(btn.getAttribute('data-facility-id'));
                console.log('Book Now clicked for facility:', facilityId);
                window.location.href = `booking-form.html?facility=${facilityId}`;
            });
        });
    }, 100);
}

function renderFacilities() {
    const container = document.getElementById('facilities-container');
    if (!container) return;

    if (filteredFacilities.length === 0) {
        container.innerHTML = `
            <div class="no-facilities" style="grid-column: 1 / -1; text-align: center;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc;"></i>
                <h3>No facilities found</h3>
                <p>Try adjusting your filters.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredFacilities.map(facility => {
        // Default placeholder image
        const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiNEOUQ5RDkiLz4KPGV0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
        
        // Handle image path more robustly
        let imagePath = defaultImage;
        if (facility.image &&
            facility.image !== 'undefined' &&
            facility.image !== 'null' &&
            facility.image.trim() !== '') {
            // If the image is a full URL, use it directly
            if (facility.image.startsWith('http://') || facility.image.startsWith('https://')) {
                imagePath = facility.image;
            } else {
                // Otherwise, treat as local image
                imagePath = `http://localhost/project_web3/images/${facility.image}`;
            }
        }

        // Handle features array
        let features = [];
        try {
            if (Array.isArray(facility.features)) {
                features = facility.features;
            } else if (typeof facility.features === 'string') {
                // Handle comma-separated string
                features = facility.features.split(',').map(f => f.trim()).filter(f => f !== '');
            }
        } catch (error) {
            console.warn('Error parsing features for facility:', facility.id, error);
            features = [];
        }

        return `
        <div class="facility-card" data-facility-id="${facility.id}">
            <div class="facility-image">
                <img src="${imagePath}" 
                     alt="${facility.name}" 
                     onerror="this.src='${defaultImage}'; this.onerror=null;">
                <div class="facility-sport">${facility.sport[0].toUpperCase() + facility.sport.slice(1)}</div>
            </div>
            <div class="facility-content">
                <h3 class="facility-title">${facility.name}</h3>
                <p class="facility-description">${facility.description}</p>
                <div class="facility-features">
                    ${features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
                <div class="facility-details">
                    <div class="detail-item"><i class="fas fa-users"></i><span>Up to ${facility.capacity}</span></div>
                    <div class="detail-item"><i class="fas fa-clock"></i><span>${facility.availability}</span></div>
                </div>
                <div class="facility-footer">
                    <div class="facility-price"><span class="price">$${facility.price}</span>/hour</div>
                    <button class="btn btn-primary btn-small book-now-btn" data-facility-id="${facility.id}">
                        <i class="fas fa-calendar-plus"></i> Book Now
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function updateFacilitiesCount() {
    const countElement = document.getElementById('facilities-count');
    if (countElement) {
        countElement.textContent = filteredFacilities.length;
    }
}

function initBookingModal() {
    const modal = document.getElementById('booking-modal');
;
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', closeBookingModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeBookingModal();
    });

    const form = document.getElementById('booking-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleBookingSubmission();
    });

    // Update summary when form changes
    const formInputs = form.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('change', updateBookingSummary);
    });
}

function openBookingModal(facilityId) {
  const modal = document.getElementById('booking-modal');
  const form = document.getElementById('booking-form');
  const title = document.getElementById('modal-title');

  selectedFacility = filteredFacilities.find(f => f.id === facilityId);
  if (!selectedFacility || !modal || !form || !title) return;

  modal.classList.add('active');
  title.textContent = `Book: ${selectedFacility.name}`;

  // Reset the form
  form.reset();
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.remove('active');
}


function generateTimeSlots() {
    const dateInput = document.getElementById('booking-date');
    const timeSelect = document.getElementById('start-time');

    if (!dateInput || !timeSelect) return;

    dateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const today = new Date();
        timeSelect.innerHTML = '<option value="">Select time</option>';

        for (let hour = 6; hour <= 22; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            const displayTime = formatTime(timeString);
            const isToday = selectedDate.toDateString() === today.toDateString();

            if (!isToday || hour > today.getHours()) {
                timeSelect.innerHTML += `<option value="${timeString}">${displayTime}</option>`;
            }
        }
    });
}

function updateBookingSummary() {
    if (!selectedFacility) return;

    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('start-time').value;
    const duration = parseInt(document.getElementById('duration').value) || 0;

    document.getElementById('summary-facility').textContent = selectedFacility.name;

    if (date && time) {
        const formattedDate = new Date(date).toDateString();
        const formattedTime = formatTime(time);
        document.getElementById('summary-datetime').textContent = `${formattedDate} at ${formattedTime}`;
    } else {
        document.getElementById('summary-datetime').textContent = 'Not selected';
    }

    if (duration > 0) {
        document.getElementById('summary-duration').textContent = `${duration} hour${duration > 1 ? 's' : ''}`;
        const basePrice = selectedFacility.price * duration;
        document.getElementById('summary-base-price').textContent = `$${basePrice}`;
        document.getElementById('summary-total').textContent = `$${basePrice}`;
    } else {
        document.getElementById('summary-duration').textContent = 'Not selected';
        document.getElementById('summary-base-price').textContent = '$0';
        document.getElementById('summary-total').textContent = '$0';
    }
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function handleBookingSubmission() {
    const formData = {
        facilityId: selectedFacility.id,
        date: document.getElementById('booking-date').value,
        time: document.getElementById('start-time').value,
        duration: parseInt(document.getElementById('duration').value),
        players: parseInt(document.getElementById('players').value)
    };

    fetch('http://localhost/project_web3/api/createBooking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`Booking confirmed! ID: ${data.bookingId}`);
                closeBookingModal();
            } else {
                alert(data.message || 'Booking failed. Please try again.');
            }
        })
        .catch(error => {
            alert("Error processing booking. Please try again.");
            console.error('Booking error:', error);
        });
}

function initDatePicker() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
}
window.addEventListener('DOMContentLoaded', () => {
  initBookingModal();
});

console.log('Booking page loaded successfully');