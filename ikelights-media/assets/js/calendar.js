
// ============================================
// IKELIGHTS MEDIA - CALENDAR FUNCTIONALITY
// ============================================

// Booking data (simulated - in production, this would come from localStorage or API)
let bookedDates = JSON.parse(localStorage.getItem('ikelights_bookings') || '[]');
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDateObj = null;
let selectedTimeSlot = null;

// Time slots
const timeSlots = ['09:00:00', '11:00:00', '14:00:00', '16:00:00'];
const timeLabels = {
    '09:00:00': '09:00 AM',
    '11:00:00': '11:00 AM',
    '14:00:00': '02:00 PM',
    '16:00:00': '04:00 PM'
};

// Get booking counts for each date
function getBookingCount(dateStr) {
    return bookedDates.filter(b => b.date === dateStr && b.status !== 'cancelled').length;
}

// Check if date is fully booked (4 slots max)
function isFullyBooked(dateStr) {
    return getBookingCount(dateStr) >= 4;
}

// Check if date has availability
function hasAvailability(dateStr) {
    return getBookingCount(dateStr) < 4;
}

// Check if date is in the past
function isPastDate(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateStr);
    return checkDate < today;
}

// Get booked times for a specific date
function getBookedTimes(dateStr) {
    return bookedDates.filter(b => b.date === dateStr).map(b => b.time);
}

// Render calendar
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNameSpan = document.getElementById('currentMonth');
    if (monthNameSpan) {
        monthNameSpan.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    let calendarHTML = '<div class="calendar-grid">';
    
    // Weekday headers
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < weekdays.length; i++) {
        calendarHTML += `<div class="calendar-weekday">${weekdays[i]}</div>`;
    }
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
        calendarHTML += '<div class="calendar-day other-month"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isPast = isPastDate(dateStr);
        const fullyBooked = isFullyBooked(dateStr);
        const hasSlots = hasAvailability(dateStr);
        const isSelected = selectedDateObj === dateStr;
        const bookingCount = getBookingCount(dateStr);
        const remainingSlots = 4 - bookingCount;
        
        let statusClass = '';
        let statusText = '';
        
        if (isSelected) {
            statusClass = 'selected';
        } else if (isPast) {
            statusClass = 'past';
            statusText = 'Past';
        } else if (fullyBooked) {
            statusClass = 'booked';
            statusText = 'Full';
        } else if (hasSlots) {
            statusClass = 'available';
            statusText = remainingSlots > 0 ? `${remainingSlots} left` : '';
        }
        
        calendarHTML += `
            <div class="calendar-day ${statusClass}" onclick="${!isPast && !fullyBooked ? `selectDate('${dateStr}')` : ''}" data-date="${dateStr}">
                <div class="day-number">${day}</div>
                ${statusText ? `<div class="booking-count">${statusText}</div>` : ''}
            </div>
        `;
    }
    
    // Fill remaining cells
    const totalCells = startingDay + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
        calendarHTML += '<div class="calendar-day other-month"></div>';
    }
    
    calendarHTML += '</div>';
    const calendarDiv = document.getElementById('calendar');
    if (calendarDiv) {
        calendarDiv.innerHTML = calendarHTML;
    }
}

// Select a date
function selectDate(dateStr) {
    selectedDateObj = dateStr;
    selectedTimeSlot = null;
    
    renderCalendar();
    
    // Show selected date info
    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const selectedDisplay = document.getElementById('selectedDateDisplay');
    if (selectedDisplay) selectedDisplay.textContent = formattedDate;
    
    const selectedInfo = document.getElementById('selectedInfo');
    if (selectedInfo) selectedInfo.style.display = 'block';
    
    const selectedDateInput = document.getElementById('selectedDate');
    if (selectedDateInput) selectedDateInput.value = dateStr;
    
    // Load time slots
    loadTimeSlots(dateStr);
    checkSubmitButton();
}

// Load available time slots
function loadTimeSlots(date) {
    const bookedTimesForDate = getBookedTimes(date);
    
    let slotsHTML = '';
    for (let slot of timeSlots) {
        const isBooked = bookedTimesForDate.includes(slot);
        const isSelected = selectedTimeSlot === slot;
        
        slotsHTML += `
            <div class="time-slot ${isBooked ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" 
                 onclick="${!isBooked ? `selectTime('${slot}')` : ''}">
                ${timeLabels[slot]}
                ${isBooked ? '<br><small>(Booked)</small>' : ''}
            </div>
        `;
    }
    
    const slotsGrid = document.getElementById('slotsGrid');
    if (slotsGrid) slotsGrid.innerHTML = slotsHTML;
    
    const timeSlotsDiv = document.getElementById('timeSlots');
    if (timeSlotsDiv) timeSlotsDiv.style.display = 'block';
}

// Select a time slot
function selectTime(time) {
    selectedTimeSlot = time;
    const selectedTimeInput = document.getElementById('selectedTime');
    if (selectedTimeInput) selectedTimeInput.value = time;
    
    // Update UI
    const slots = document.querySelectorAll('.time-slot');
    slots.forEach(slot => {
        slot.classList.remove('selected');
        if (slot.textContent.includes(timeLabels[time])) {
            slot.classList.add('selected');
        }
    });
    
    checkSubmitButton();
}

// Check if submit button should be enabled
function checkSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    const serviceSelect = document.getElementById('service');
    
    if (selectedDateObj && selectedTimeSlot && serviceSelect && serviceSelect.value) {
        submitBtn.disabled = false;
    } else if (submitBtn) {
        submitBtn.disabled = true;
    }
}

// Change month
function changeMonth(delta) {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    
    if (newMonth < 0) {
        newMonth = 11;
        newYear--;
    } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
    }
    
    currentMonth = newMonth;
    currentYear = newYear;
    renderCalendar();
}

// Service select listener
const serviceSelect = document.getElementById('service');
if (serviceSelect) {
    serviceSelect.addEventListener('change', checkSubmitButton);
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    
    // Refresh bookings from localStorage
    const refreshBookings = () => {
        bookedDates = JSON.parse(localStorage.getItem('ikelights_bookings') || '[]');
        renderCalendar();
    };
    
    // Listen for storage changes
    window.addEventListener('storage', refreshBookings);
});