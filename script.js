// Application State
let appState = {
    currentScreen: 'welcome',
    selectedPackage: null,
    dogInfo: null,
    ownerInfo: null,
    appointmentInfo: null
};

// Service packages data
const servicePackages = {
    basic: {
        name: 'Basic Groom',
        price: 45,
        duration: '1-2 hours',
        features: ['Bath & Dry', 'Nail Trim', 'Ear Cleaning', 'Basic Brush Out']
    },
    luxury: {
        name: 'Luxury Spa',
        price: 120,
        duration: '3-4 hours',
        features: ['Everything in Premium', 'Deep Conditioning Treatment', 'Aromatherapy Bath', 'Paw Moisturizing', 'Bandana or Bow Tie', 'Professional Photos']
    },
    custom: {
        name: 'Custom Service',
        price: 0,
        duration: '0 hours',
        features: [],
        services: [],
        specialRequests: ''
    }
};

// Available time slots
const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    generateFloatingPaws();
    setupFormHandlers();
    generateCalendar();
});

function initializeApp() {
    showScreen('welcome');
    updateAppointmentSummary();
}

// Screen Management
function showScreen(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the selected screen
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        appState.currentScreen = screenName;
        
        // Update appointment summary when showing scheduling screen
        if (screenName === 'scheduling') {
            updateAppointmentSummary();
        }
        
        // Update confirmation details when showing confirmation screen
        if (screenName === 'confirmation') {
            updateConfirmationDetails();
        }
    }
}

// Service Selection
function selectService(serviceType) {
    appState.selectedPackage = {
        type: serviceType,
        ...servicePackages[serviceType]
    };
    showScreen('dogInfo');
}

// Form Handlers
function setupFormHandlers() {
    // Dog Information Form
    const dogInfoForm = document.getElementById('dog-info-form');
    if (dogInfoForm) {
        dogInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(dogInfoForm);
            appState.dogInfo = {
                name: formData.get('dogName'),
                breed: formData.get('breed'),
                age: formData.get('age'),
                size: formData.get('size'),
                coatType: formData.get('coatType'),
                temperament: formData.get('temperament'),
                specialNeeds: formData.get('specialNeeds'),
                previousGrooming: formData.get('previousGrooming')
            };
            showScreen('owner-info');
        });
    }
    
    // Owner Information Form
    const ownerInfoForm = document.getElementById('owner-info-form');
    if (ownerInfoForm) {
        ownerInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(ownerInfoForm);
            appState.ownerInfo = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                emergencyContact: formData.get('emergencyContact'),
                emergencyPhone: formData.get('emergencyPhone'),
                preferredContact: formData.get('preferredContact')
            };
            showScreen('scheduling');
        });
    }
}

// Calendar Generation
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Clear existing calendar
    calendar.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.padding = '0.5rem';
        calendar.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day disabled';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dayDate = new Date(currentYear, currentMonth, day);
        const dayOfWeek = dayDate.getDay();
        
        // Disable past days and Sundays (assuming closed on Sundays)
        if (dayDate < today || dayOfWeek === 0) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(dayDate));
        }
        
        calendar.appendChild(dayElement);
    }
}

function selectDate(date) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Add selection to clicked date
    event.target.classList.add('selected');
    
    // Store selected date
    appState.selectedDate = date;
    
    // Generate time slots
    generateTimeSlots();
    
    // Update appointment summary
    updateAppointmentSummary();
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    timeSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        timeSlot.addEventListener('click', () => selectTime(time));
        timeSlotsContainer.appendChild(timeSlot);
    });
}

function selectTime(time) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked time
    event.target.classList.add('selected');
    
    // Store selected time
    appState.selectedTime = time;
    
    // Update appointment summary
    updateAppointmentSummary();
    
    // Enable confirm button if date and time are selected
    const confirmBtn = document.getElementById('confirm-appointment-btn');
    if (confirmBtn && appState.selectedDate && appState.selectedTime) {
        confirmBtn.disabled = false;
    }
}

function updateAppointmentSummary() {
    // Update service
    const summaryService = document.getElementById('summary-service');
    if (summaryService && appState.selectedPackage) {
        let serviceName = appState.selectedPackage.name;
        if (appState.selectedPackage.type === 'custom' && appState.selectedPackage.services) {
            serviceName += ` (${appState.selectedPackage.services.length} services)`;
        }
        summaryService.textContent = serviceName;
    }
    
    // Update dog name
    const summaryDog = document.getElementById('summary-dog');
    if (summaryDog && appState.dogInfo) {
        summaryDog.textContent = appState.dogInfo.name || '-';
    }
    
    // Update date
    const summaryDate = document.getElementById('summary-date');
    if (summaryDate && appState.selectedDate) {
        summaryDate.textContent = appState.selectedDate.toLocaleDateString();
    }
    
    // Update time
    const summaryTime = document.getElementById('summary-time');
    if (summaryTime && appState.selectedTime) {
        summaryTime.textContent = appState.selectedTime;
    }
    
    // Update total
    const summaryTotal = document.getElementById('summary-total');
    if (summaryTotal && appState.selectedPackage) {
        summaryTotal.textContent = `$${appState.selectedPackage.price}`;
    }
}

function confirmAppointment() {
    if (!appState.selectedDate || !appState.selectedTime) {
        alert('Please select both date and time for your appointment.');
        return;
    }
    
    appState.appointmentInfo = {
        date: appState.selectedDate,
        time: appState.selectedTime,
        total: appState.selectedPackage.price
    };
    
    showScreen('confirmation');
}

function updateConfirmationDetails() {
    // Update service
    const confirmService = document.getElementById('confirm-service');
    if (confirmService && appState.selectedPackage) {
        let serviceName = appState.selectedPackage.name;
        
        // For custom services, show the individual services
        if (appState.selectedPackage.type === 'custom' && appState.selectedPackage.services) {
            const servicesList = appState.selectedPackage.services.map(s => s.name).join(', ');
            serviceName = `Custom Service: ${servicesList}`;
        }
        
        confirmService.textContent = serviceName;
    }
    
    // Update dog
    const confirmDog = document.getElementById('confirm-dog');
    if (confirmDog && appState.dogInfo) {
        confirmDog.textContent = appState.dogInfo.name || '-';
    }
    
    // Update owner
    const confirmOwner = document.getElementById('confirm-owner');
    if (confirmOwner && appState.ownerInfo) {
        confirmOwner.textContent = `${appState.ownerInfo.firstName} ${appState.ownerInfo.lastName}`;
    }
    
    // Update date and time
    const confirmDateTime = document.getElementById('confirm-datetime');
    if (confirmDateTime && appState.appointmentInfo) {
        const dateStr = appState.appointmentInfo.date.toLocaleDateString();
        const timeStr = appState.appointmentInfo.time;
        confirmDateTime.textContent = `${dateStr} at ${timeStr}`;
    }
    
    // Update total
    const confirmTotal = document.getElementById('confirm-total');
    if (confirmTotal && appState.selectedPackage) {
        confirmTotal.textContent = `$${appState.selectedPackage.price}`;
    }
}

function resetApp() {
    appState = {
        currentScreen: 'welcome',
        selectedPackage: null,
        dogInfo: null,
        ownerInfo: null,
        appointmentInfo: null,
        selectedDate: null,
        selectedTime: null
    };
    
    // Reset forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    // Reset calendar and time slots
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Disable confirm button
    const confirmBtn = document.getElementById('confirm-appointment-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
    }
    
    // Clear time slots
    const timeSlotsContainer = document.getElementById('time-slots');
    if (timeSlotsContainer) {
        timeSlotsContainer.innerHTML = '<div class="time-slot-placeholder">Please select a date to see available times</div>';
    }
    
    showScreen('welcome');
}

// Floating Paws Generation
function generateFloatingPaws() {
    generateSmallPaws();
    generateTinyPaws();
    generateSeamlessPaws();
}

function generateSmallPaws() {
    const container = document.getElementById('small-paws-container');
    if (!container) return;
    
    const colors = ['emerald', 'teal', 'green'];
    const shades = ['400', '500', '600'];
    const opacities = [0.2, 0.25, 0.3, 0.35];
    
    for (let i = 0; i < 15; i++) {
        const pawDiv = document.createElement('div');
        pawDiv.className = 'paw-print small-paw';
        pawDiv.style.position = 'absolute';
        pawDiv.style.top = Math.random() * 100 + '%';
        pawDiv.style.left = Math.random() * 100 + '%';
        pawDiv.style.animation = `small-paw-float 22s linear infinite ${Math.random() * 5}s`;
        
        const size = 20 + Math.random() * 16;
        const color = colors[Math.floor(Math.random() * 3)];
        const shade = shades[Math.floor(Math.random() * 3)];
        const opacity = opacities[Math.floor(Math.random() * 4)];
        
        pawDiv.style.color = `var(--${color}-${shade})`;
        pawDiv.style.opacity = opacity;
        
        pawDiv.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="currentColor">
                <ellipse cx="50" cy="65" rx="18" ry="22" />
                <ellipse cx="30" cy="35" rx="8" ry="12" transform="rotate(-15 30 35)" />
                <ellipse cx="42" cy="25" rx="8" ry="12" transform="rotate(-5 42 25)" />
                <ellipse cx="58" cy="25" rx="8" ry="12" transform="rotate(5 58 25)" />
                <ellipse cx="70" cy="35" rx="8" ry="12" transform="rotate(15 70 35)" />
            </svg>
        `;
        
        container.appendChild(pawDiv);
    }
}

function generateTinyPaws() {
    const container = document.getElementById('tiny-paws-container');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const pawDiv = document.createElement('div');
        pawDiv.className = 'paw-print tiny-paw';
        pawDiv.style.position = 'absolute';
        pawDiv.style.top = Math.random() * 100 + '%';
        pawDiv.style.left = Math.random() * 100 + '%';
        
        const randomDelay = Math.random() * 10;
        const randomDuration = 15 + Math.random() * 10;
        pawDiv.style.animation = `tiny-paw-float ${randomDuration}s linear infinite ${randomDelay}s`;
        
        const size = 12 + Math.random() * 8;
        pawDiv.style.color = 'var(--emerald-400)';
        pawDiv.style.opacity = '0.2';
        
        pawDiv.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="currentColor">
                <ellipse cx="50" cy="65" rx="18" ry="22" />
                <ellipse cx="30" cy="35" rx="8" ry="12" transform="rotate(-15 30 35)" />
                <ellipse cx="42" cy="25" rx="8" ry="12" transform="rotate(-5 42 25)" />
                <ellipse cx="58" cy="25" rx="8" ry="12" transform="rotate(5 58 25)" />
                <ellipse cx="70" cy="35" rx="8" ry="12" transform="rotate(15 70 35)" />
            </svg>
        `;
        
        container.appendChild(pawDiv);
    }
}

function generateSeamlessPaws() {
    const container = document.getElementById('seamless-paws-container');
    if (!container) return;
    
    const colors = ['emerald', 'teal', 'green'];
    
    for (let i = 0; i < 8; i++) {
        const pawDiv = document.createElement('div');
        pawDiv.className = 'paw-print seamless-paw';
        pawDiv.style.position = 'absolute';
        pawDiv.style.top = Math.random() * 100 + '%';
        pawDiv.style.left = Math.random() * 100 + '%';
        
        const randomColor = colors[Math.floor(Math.random() * 3)];
        const randomDelay = Math.random() * 15;
        const randomDuration = 25 + Math.random() * 15;
        
        pawDiv.style.animation = `seamless-paw-float ${randomDuration}s linear infinite ${randomDelay}s`;
        pawDiv.style.color = `var(--${randomColor}-500)`;
        pawDiv.style.opacity = '0.25';
        
        const size = 24 + Math.random() * 12;
        
        pawDiv.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="currentColor">
                <ellipse cx="50" cy="65" rx="18" ry="22" />
                <ellipse cx="30" cy="35" rx="8" ry="12" transform="rotate(-15 30 35)" />
                <ellipse cx="42" cy="25" rx="8" ry="12" transform="rotate(-5 42 25)" />
                <ellipse cx="58" cy="25" rx="8" ry="12" transform="rotate(5 58 25)" />
                <ellipse cx="70" cy="35" rx="8" ry="12" transform="rotate(15 70 35)" />
            </svg>
        `;
        
        container.appendChild(pawDiv);
    }
}

// Navigation helper functions
function goBack() {
    switch (appState.currentScreen) {
        case 'services':
            showScreen('welcome');
            break;
        case 'dog-info':
            showScreen('services');
            break;
        case 'owner-info':
            showScreen('dog-info');
            break;
        case 'scheduling':
            showScreen('owner-info');
            break;
        case 'confirmation':
            showScreen('scheduling');
            break;
        case 'reviews':
            showScreen('welcome');
            break;
        default:
            showScreen('welcome');
    }
}

// Utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Phone number formatting on input
document.addEventListener('input', function(e) {
    if (e.target.type === 'tel') {
        e.target.value = formatPhoneNumber(e.target.value);
    }
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
}

// Add form validation
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        if (input.value && !validateEmail(input.value)) {
            e.preventDefault();
            alert('Please enter a valid email address.');
            input.focus();
        }
    });
    
    // Phone validation
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (input.value && !validatePhone(input.value)) {
            e.preventDefault();
            alert('Please enter a valid 10-digit phone number.');
            input.focus();
        }
    });
});

// Smooth scrolling for mobile
if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape' && appState.currentScreen !== 'welcome') {
        goBack();
    }
    
    // Enter key on calendar days
    if (e.key === 'Enter' && e.target.classList.contains('calendar-day')) {
        e.target.click();
    }
    
    // Enter key on time slots
    if (e.key === 'Enter' && e.target.classList.contains('time-slot')) {
        e.target.click();
    }
});

// Make calendar days focusable
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const calendarDays = document.querySelectorAll('.calendar-day.available');
                calendarDays.forEach(day => {
                    day.setAttribute('tabindex', '0');
                });
                
                const timeSlots = document.querySelectorAll('.time-slot');
                timeSlots.forEach(slot => {
                    slot.setAttribute('tabindex', '0');
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Console welcome message
console.log('🐕 Welcome to Symphony\'s Dog Grooming! 🐕');
console.log('This website was converted from React to pure HTML/CSS/JS while maintaining the exact same functionality and animations.');

// Review functionality
let reviewData = {
    selectedPhoto: null,
    currentRating: 5
};

// Sample reviews data (this would normally come from a database)
let customerReviews = [
    {
        id: 1,
        customerName: 'Sarah Mitchell',
        dogName: 'Max',
        rating: 5,
        comment: 'Absolutely wonderful service! My Golden Retriever, Max, always comes home looking and smelling amazing. The team is so gentle and caring with him.',
        service: 'Premium Groom',
        date: '2025-01-15',
        image: null
    },
    {
        id: 2,
        customerName: 'David Johnson',
        dogName: 'Buddy',
        rating: 5,
        comment: 'Professional, affordable, and they truly care about the dogs. My nervous rescue pup now actually enjoys grooming days!',
        service: 'Basic Groom',
        date: '2025-01-12',
        image: null
    },
    {
        id: 3,
        customerName: 'Jennifer Martinez',
        dogName: 'Luna',
        rating: 5,
        comment: 'Symphony did an amazing job with my Poodle mix! Luna can be quite anxious, but the staff made her feel so comfortable. The custom service option was perfect for her needs.',
        service: 'Custom Service',
        date: '2025-02-08',
        image: null
    },
    {
        id: 4,
        customerName: 'Mark Thompson',
        dogName: 'Charlie',
        rating: 5,
        comment: 'Been bringing Charlie here for 6 months now and the consistency is outstanding! My Lab always looks fantastic and Symphony truly understands different coat types. Worth every penny!',
        service: 'Luxury Spa',
        date: '2025-02-03',
        image: null
    }
];

function showReviewForm() {
    showScreen('write-review');
    setupStarRating();
    resetReviewForm();
}

function setupStarRating() {
    const stars = document.querySelectorAll('#star-rating .star');
    const ratingText = document.getElementById('rating-text');
    const ratingValue = document.getElementById('rating-value');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            reviewData.currentRating = rating;
            ratingValue.value = rating;
            
            // Update star display
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('filled');
                } else {
                    s.classList.remove('filled');
                }
            });
            
            // Update rating text
            ratingText.textContent = `(${rating} star${rating !== 1 ? 's' : ''})`;
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
    
    // Set initial rating to 5 stars
    setTimeout(() => {
        stars[4].click();
    }, 100);
}

function handlePhotoSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
    }
    
    reviewData.selectedPhoto = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const uploadArea = document.getElementById('photo-upload-area');
        const previewArea = document.getElementById('photo-preview');
        const previewImage = document.getElementById('preview-image');
        
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    reviewData.selectedPhoto = null;
    document.getElementById('photo-input').value = '';
    document.getElementById('photo-upload-area').style.display = 'block';
    document.getElementById('photo-preview').style.display = 'none';
}

function resetReviewForm() {
    document.getElementById('review-form').reset();
    removePhoto();
    reviewData.currentRating = 5;
    document.getElementById('rating-value').value = '5';
}

async function submitReview(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-review-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    
    // Get form data
    const formData = new FormData(event.target);
    const reviewSubmission = {
        customerName: formData.get('customerName').trim(),
        dogName: formData.get('dogName').trim(),
        service: formData.get('service') || '',
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment').trim(),
        date: new Date().toISOString().split('T')[0],
        image: reviewData.selectedPhoto ? URL.createObjectURL(reviewData.selectedPhoto) : null
    };
    
    // Validate required fields
    if (!reviewSubmission.customerName || !reviewSubmission.dogName || !reviewSubmission.comment) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show loading state
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Add review to the list
        const newReview = {
            id: Date.now(),
            ...reviewSubmission
        };
        
        customerReviews.unshift(newReview);
        
        // Update reviews display
        updateReviewsDisplay();
        
        // Show success screen
        showScreen('review-success');
        
        // Reset form
        resetReviewForm();
        
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('There was an error submitting your review. Please try again.');
    } finally {
        // Reset button state
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function updateReviewsDisplay() {
    const reviewsGrid = document.querySelector('#reviews-screen .reviews-grid');
    if (!reviewsGrid) return;
    
    // Clear existing reviews
    reviewsGrid.innerHTML = '';
    
    // Add new reviews
    customerReviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsGrid.appendChild(reviewCard);
    });
    
    // Update stats
    updateReviewStats();
}

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    const initials = review.customerName.split(' ').map(name => name[0]).join('').toUpperCase();
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    card.innerHTML = `
        <div class="review-header">
            <div class="review-avatar">${initials}</div>
            <div class="review-info">
                <h3>${review.customerName}</h3>
                <div class="review-stars">${stars}</div>
                ${review.service ? `<div class="review-service">${review.service}</div>` : ''}
            </div>
        </div>
        ${review.image ? `<div class="review-image"><img src="${review.image}" alt="${review.dogName} after grooming"></div>` : ''}
        <p>"${review.comment}"</p>
        <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
    `;
    
    return card;
}

function updateReviewStats() {
    const avgRating = customerReviews.reduce((sum, review) => sum + review.rating, 0) / customerReviews.length;
    const statCards = document.querySelectorAll('#reviews-screen .stat-card');
    
    if (statCards.length > 0) {
        statCards[0].querySelector('.stat-number').textContent = avgRating.toFixed(1);
        statCards[1].querySelector('.stat-number').textContent = `${customerReviews.length}+`;
    }
}

// Initialize reviews display when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateReviewsDisplay();
    }, 100);
});

// Custom Service Builder functionality
let customServiceData = {
    selectedServices: [],
    totalPrice: 0,
    totalDuration: 0,
    specialRequests: ''
};

function showCustomService() {
    console.log('showCustomService called');
    showScreen('custom-service');
    setupCustomServiceBuilder();
    resetCustomService();
    console.log('Custom service screen should be visible');
}

function setupCustomServiceBuilder() {
    const checkboxes = document.querySelectorAll('.service-checkbox');
    const totalPriceElement = document.getElementById('custom-total-price');
    const durationElement = document.getElementById('custom-duration');
    const continueBtn = document.getElementById('continue-custom-btn');
    const specialRequestsTextarea = document.getElementById('custom-requests');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateCustomServiceCalculation();
        });
    });

    // Special requests textarea
    if (specialRequestsTextarea) {
        specialRequestsTextarea.addEventListener('input', function() {
            customServiceData.specialRequests = this.value;
        });
    }

    // Initialize the calculation
    updateCustomServiceCalculation();
}

function updateCustomServiceCalculation() {
    const checkboxes = document.querySelectorAll('.service-checkbox:checked');
    let totalPrice = 0;
    let totalDuration = 0;
    const selectedServices = [];

    checkboxes.forEach(checkbox => {
        const price = parseInt(checkbox.dataset.price);
        const duration = parseInt(checkbox.dataset.duration);
        const serviceName = checkbox.nextElementSibling.querySelector('.service-name').textContent;
        
        totalPrice += price;
        totalDuration += duration;
        selectedServices.push({
            name: serviceName,
            price: price,
            duration: duration
        });
    });

    // Update custom service data
    customServiceData.selectedServices = selectedServices;
    customServiceData.totalPrice = totalPrice;
    customServiceData.totalDuration = totalDuration;

    // Update display
    document.getElementById('custom-total-price').textContent = `$${totalPrice}`;
    document.getElementById('custom-duration').textContent = `${Math.round(totalDuration / 60 * 10) / 10} hours`;

    // Update continue button
    const continueBtn = document.getElementById('continue-custom-btn');
    if (selectedServices.length > 0) {
        continueBtn.disabled = false;
        continueBtn.textContent = `Proceed to Checkout ($${totalPrice})`;
        continueBtn.classList.add('enabled');
        continueBtn.classList.remove('disabled');
    } else {
        continueBtn.disabled = true;
        continueBtn.textContent = 'Select at least one service';
        continueBtn.classList.add('disabled');
        continueBtn.classList.remove('enabled');
    }

    // Update service package data
    servicePackages.custom = {
        name: 'Custom Service',
        price: totalPrice,
        duration: `${Math.round(totalDuration / 60 * 10) / 10} hours`,
        features: selectedServices.map(service => service.name),
        services: selectedServices,
        specialRequests: customServiceData.specialRequests
    };
}

function resetCustomService() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.service-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear special requests
    const specialRequestsTextarea = document.getElementById('custom-requests');
    if (specialRequestsTextarea) {
        specialRequestsTextarea.value = '';
    }

    // Reset data
    customServiceData = {
        selectedServices: [],
        totalPrice: 0,
        totalDuration: 0,
        specialRequests: ''
    };

    // Update display
    updateCustomServiceCalculation();
}

function proceedWithCustomService() {
    if (customServiceData.selectedServices.length === 0) {
        alert('Please select at least one service before continuing.');
        return;
    }

    // Update special requests from textarea
    const specialRequestsTextarea = document.getElementById('custom-requests');
    if (specialRequestsTextarea) {
        customServiceData.specialRequests = specialRequestsTextarea.value;
        servicePackages.custom.specialRequests = customServiceData.specialRequests;
    }

    // Set the selected package to custom
    appState.selectedPackage = {
        type: 'custom',
        ...servicePackages.custom
    };
    
    // Continue to dog info screen
    showScreen('dog-info');
}

function proceedToCheckout() {
    if (customServiceData.selectedServices.length === 0) {
        alert('Please select at least one service before continuing.');
        return;
    }

    // Update special requests from textarea
    const specialRequestsTextarea = document.getElementById('custom-requests');
    if (specialRequestsTextarea) {
        customServiceData.specialRequests = specialRequestsTextarea.value;
        servicePackages.custom.specialRequests = customServiceData.specialRequests;
    }

    // Show checkout screen and populate summary
    showScreen('custom-checkout');
    populateCheckoutSummary();
    setMinDate();
}

function populateCheckoutSummary() {
    const servicesList = document.getElementById('selected-services-summary');
    const totalPrice = document.getElementById('checkout-total-price');
    const totalDuration = document.getElementById('checkout-total-duration');

    // Clear existing services
    servicesList.innerHTML = '';

    // Add each selected service
    customServiceData.selectedServices.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-summary-item';
        serviceItem.innerHTML = `
            <div class="service-summary-details">
                <span class="service-summary-name">${service.name}</span>
                <span class="service-summary-description">${getServiceDescription(service.name)}</span>
            </div>
            <span class="service-summary-price">$${service.price}</span>
        `;
        servicesList.appendChild(serviceItem);
    });

    // Update totals
    totalPrice.textContent = `$${customServiceData.totalPrice}`;
    totalDuration.textContent = `${Math.round(customServiceData.totalDuration / 60 * 10) / 10} hours`;
}

function getServiceDescription(serviceName) {
    const descriptions = {
        'Bath & Dry': 'Complete wash with premium shampoo and thorough drying',
        'Nail Trim': 'Professional nail trimming and filing',
        'Ear Cleaning': 'Gentle ear cleaning and inspection',
        'Brush Out': 'Thorough brushing to remove loose fur',
        'Full Body Haircut': 'Complete styling and trimming',
        'Face & Sanitary Trim': 'Precise trimming around face and sensitive areas',
        'De-shedding Treatment': 'Specialized treatment to reduce shedding',
        'Teeth Brushing': 'Gentle dental cleaning with dog-safe toothpaste',
        'Deep Conditioning': 'Moisturizing treatment for healthy coat',
        'Aromatherapy Bath': 'Calming essential oils for relaxation',
        'Paw Moisturizing': 'Paw balm and nail care treatment',
        'Cologne Spritz': 'Light, dog-safe fragrance',
        'Bandana or Bow Tie': 'Stylish finishing touch',
        'Professional Photos': 'High-quality photos of your groomed pup'
    };
    return descriptions[serviceName] || '';
}

function setMinDate() {
    const dateInput = document.getElementById('checkout-date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

async function submitCustomBooking(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-booking-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    
    // Show loading state
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    try {
        // Get form data
        const formData = new FormData(event.target);
        const bookingData = {
            customerName: formData.get('customerName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            dogName: formData.get('dogName'),
            breed: formData.get('breed'),
            preferredDate: formData.get('preferredDate'),
            preferredTime: formData.get('preferredTime'),
            specialNotes: formData.get('specialNotes'),
            services: customServiceData.selectedServices,
            totalPrice: customServiceData.totalPrice,
            totalDuration: customServiceData.totalDuration,
            serviceRequests: customServiceData.specialRequests
        };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Store booking data for confirmation screen
        appState.customBookingData = bookingData;

        // Show confirmation screen
        showScreen('custom-confirmation');
        populateCustomConfirmation();

    } catch (error) {
        console.error('Error submitting booking:', error);
        alert('There was an error submitting your booking. Please try again.');
    } finally {
        // Reset button state
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function populateCustomConfirmation() {
    const booking = appState.customBookingData;
    if (!booking) return;

    // Update confirmation details
    const servicesElement = document.getElementById('confirm-custom-services');
    const customerElement = document.getElementById('confirm-custom-customer');
    const dogElement = document.getElementById('confirm-custom-dog');
    const datetimeElement = document.getElementById('confirm-custom-datetime');
    const totalElement = document.getElementById('confirm-custom-total');

    if (servicesElement) {
        const serviceNames = booking.services.map(s => s.name).join(', ');
        servicesElement.textContent = serviceNames;
    }

    if (customerElement) {
        customerElement.textContent = booking.customerName;
    }

    if (dogElement) {
        const dogInfo = booking.dogName + (booking.breed ? ` (${booking.breed})` : '');
        dogElement.textContent = dogInfo;
    }

    if (datetimeElement) {
        const dateStr = new Date(booking.preferredDate).toLocaleDateString();
        datetimeElement.textContent = `${dateStr} at ${booking.preferredTime}`;
    }

    if (totalElement) {
        totalElement.textContent = `$${booking.totalPrice}`;
    }
}

function showTerms() {
    alert('Terms and Conditions:\n\n1. All appointments are subject to availability\n2. Cancellations must be made 24 hours in advance\n3. Additional charges may apply for difficult pets\n4. We are not responsible for pets with pre-existing health conditions\n5. Payment is due at time of service');
}