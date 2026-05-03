// ============================================
// IKELIGHTS MEDIA - CHATBOT
// ============================================

class Chatbot {
    constructor() {
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createChatbotUI();
        this.attachEventListeners();
    }
    
    createChatbotUI() {
        if (document.getElementById('ikelights-chatbot')) return;
        
        const chatbotHTML = `
            <div id="ikelights-chatbot" class="chatbot-container">
                <div class="chatbot-toggle" id="chatbotToggle">
                    <i class="fas fa-comment-dots"></i>
                </div>
                <div class="chatbot-window" id="chatbotWindow">
                    <div class="chatbot-header">
                        <div class="chatbot-info">
                            <i class="fas fa-robot"></i>
                            <div>
                                <h4>IKELIGHTS Assistant</h4>
                                <p>Online • Usually replies instantly</p>
                            </div>
                        </div>
                        <button class="chatbot-minimize" id="minimizeChat">&minus;</button>
                    </div>
                    
                    <div class="chatbot-messages" id="chatMessages">
                        <div class="message bot">
                            <div class="message-content">
                                <p>👋 Hello! I'm IKELIGHTS virtual assistant. How can I help you today?</p>
                                <div class="quick-replies">
                                    <button onclick="window.chatbot.quickReply('Pricing')">💰 Pricing</button>
                                    <button onclick="window.chatbot.quickReply('Booking')">📅 Booking</button>
                                    <button onclick="window.chatbot.quickReply('Location')">📍 Location</button>
                                    <button onclick="window.chatbot.quickReply('Services')">🎬 Services</button>
                                    <button onclick="window.chatbot.quickReply('Contact')">📞 Contact</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chatbot-input-area">
                        <input type="text" id="chatInput" placeholder="Type your message..." autocomplete="off">
                        <button id="sendMessageBtn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    attachEventListeners() {
        const toggle = document.getElementById('chatbotToggle');
        const window = document.getElementById('chatbotWindow');
        const minimize = document.getElementById('minimizeChat');
        const sendBtn = document.getElementById('sendMessageBtn');
        const input = document.getElementById('chatInput');
        
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleChat());
        }
        
        if (minimize) {
            minimize.addEventListener('click', () => this.toggleChat());
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    }
    
    toggleChat() {
        const window = document.getElementById('chatbotWindow');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            window.classList.add('active');
            document.getElementById('chatInput')?.focus();
        } else {
            window.classList.remove('active');
        }
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get bot response
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }
    
    addMessage(message, sender) {
        const messagesDiv = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `<div class="message-content"><p>${this.escapeHtml(message)}</p></div>`;
        } else {
            messageDiv.innerHTML = `<div class="message-content"><p>${this.escapeHtml(message)}</p></div>`;
        }
        
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    showTypingIndicator() {
        const messagesDiv = document.getElementById('chatMessages');
        const indicator = document.createElement('div');
        indicator.className = 'message bot typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `<div class="message-content"><span>.</span><span>.</span><span>.</span></div>`;
        messagesDiv.appendChild(indicator);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }
    
    getBotResponse(message) {
        const msg = message.toLowerCase();
        
        const responses = {
            'price|cost|ghs|how much|pricing|rates': "💰 Here are our rates:\n\n• Wedding Preset: GHS 200\n• Melanin LUTs: GHS 280\n• Light Skin LUTs: GHS 240\n• One-on-One Classes: From GHS 5,000\n\nVisit our Rate Cards page for complete pricing!",
            'book|appointment|schedule|booking|reserve': "📅 To book a session:\n\n1. Go to our Book Now page\n2. Fill out the booking form\n3. Choose your preferred date/time\n4. We'll confirm within 24 hours!\n\nClick the Book Now button on our website to get started.",
            'location|where|address|studio|directions|weija': "📍 We're located at:\n\nHM7F+MGV Weija, Accra, Ghana\n\n🕒 Hours: Mon-Sat, 9AM-6PM\nSunday: Closed\n\nCheck our Contact page for Google Maps directions!",
            'service|offer|what do you do|services|photography': "🎬 We offer:\n\n• Wedding Photography\n• Portrait Sessions\n• Event Coverage\n• Photo Retouching\n• One-on-One Training\n• Video Production\n\nAnything specific you'd like to know?",
            'contact|call|phone|email|reach|whatsapp': "📞 Contact us:\n\n• Phone/WhatsApp: 054 611 7004\n• Email: vcasio94@gmail.com\n• Visit our studio in Weija, Accra\n\nWe typically respond within 2 hours during business hours!",
            'payment|pay|deposit|money': "💳 Payment Info:\n\n• 50% deposit required to confirm booking\n• Balance due on day of shoot\n• Payments accepted: Mobile Money, Bank Transfer, Cash\n• Receipts provided for all payments",
            'cancellation|refund|cancel|policy': "📋 Cancellation Policy:\n\n• 7+ days notice: Full refund\n• 3-6 days notice: 50% refund\n• Less than 72 hours: Deposit forfeited\n• Rescheduling allowed up to 48 hours before",
            'hours|open|time|schedule': "🕐 Business Hours:\n\nMonday - Friday: 9AM - 6PM\nSaturday: 10AM - 4PM\nSunday: Closed\n\nSpecial appointments available upon request!",
            'gallery|portfolio|samples|work': "🖼️ Check out our Gallery page to see examples of our work! We showcase weddings, portraits, events, and professional edits there.",
            'hi|hello|hey|good morning|good afternoon': "Hello! 👋 Welcome to IKELIGHTS MEDIA. How can I assist you today?"
        };
        
        for (let [pattern, response] of Object.entries(responses)) {
            const keywords = pattern.split('|');
            if (keywords.some(keyword => msg.includes(keyword))) {
                return response;
            }
        }
        
        return "Thank you for your message! 👋\n\nI can help you with:\n• 💰 Pricing & Rates\n• 📅 Booking appointments\n• 📍 Location & Directions\n• 🎬 Our Services\n• 📞 Contact Information\n• 💳 Payment options\n\nWhat would you like to know more about?";
    }
    
    quickReply(topic) {
        this.addMessage(topic, 'user');
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.getBotResponse(topic);
            this.addMessage(response, 'bot');
        }, 500);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new Chatbot();
});