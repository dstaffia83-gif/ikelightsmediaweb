// ============================================
// IKELIGHTS MEDIA - MAIN JAVASCRIPT
// ============================================

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
    
    // Sticky navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;
        
        // Create WhatsApp message
        const whatsappMsg = `New Contact Message:%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
        const whatsappUrl = `https://wa.me/233546117004?text=${whatsappMsg}`;
        
        // Create email link
        const emailLink = `mailto:vcasio94@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Show options
        const messageDiv = document.getElementById('formMessage');
        messageDiv.innerHTML = `
            <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <p>✅ Message ready to send!</p>
                <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                    <a href="${whatsappUrl}" target="_blank" style="background: #25D366; color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none;">
                        <i class="fab fa-whatsapp"></i> Send via WhatsApp
                    </a>
                    <a href="${emailLink}" style="background: #E2725B; color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none;">
                        <i class="fas fa-envelope"></i> Send via Email
                    </a>
                </div>
            </div>
        `;
        
        contactForm.reset();
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 10000);
    });
}

// Booking Form Handler
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('selectedDate').value;
        const time = document.getElementById('selectedTime').value;
        const requests = document.getElementById('requests').value;
        
        if (!date || !time) {
            alert('Please select a date and time from the calendar');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMsg = `*NEW BOOKING - IKELIGHTS MEDIA*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A*Date:* ${date}%0A*Time:* ${time}%0A*Requests:* ${requests}%0A%0A_This is an automated booking notification_`;
        const whatsappUrl = `https://wa.me/233546117004?text=${whatsappMsg}`;
        
        // Create email
        const emailSubject = `New Booking: ${service} - ${name}`;
        const emailBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}\nRequests: ${requests}`;
        const emailLink = `mailto:vcasio94@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Save to localStorage (for admin panel)
        const bookings = JSON.parse(localStorage.getItem('ikelights_bookings') || '[]');
        bookings.push({
            id: Date.now(),
            name, email, phone, service, date, time, requests,
            status: 'pending',
            created_at: new Date().toISOString()
        });
        localStorage.setItem('ikelights_bookings', JSON.stringify(bookings));
        
        // Show success message with options
        alert(`Booking submitted successfully!\n\nYou will receive a confirmation via WhatsApp shortly.`);
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        bookingForm.reset();
        document.getElementById('selectedDate').value = '';
        document.getElementById('selectedTime').value = '';
        document.getElementById('submitBtn').disabled = true;
    });
}