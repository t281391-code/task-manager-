// Initialize users array from JSON Server API
let users = [];
const API_BASE_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : window.location.origin;

// Load users from JSON Server API
async function loadUsersFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (response.ok) {
            const data = await response.json();
            users = Array.isArray(data) ? data : [];
            // Save to localStorage as backup
            localStorage.setItem('users', JSON.stringify({ users: users }));
            return true;
        }
        console.log('API returned an error, trying localStorage or static file');
        if (loadUsersFromStorage()) {
            return true;
        }
        return await loadUsersFromJSONFile();
    } catch (error) {
        console.log('Could not load users from API, trying localStorage or static file');
        // Fallback to localStorage
        if (loadUsersFromStorage()) {
            return true;
        }
        // Try loading from static file as last resort
        return await loadUsersFromJSONFile();
    }
    return false;
}

// Load users from static JSON file (fallback)
async function loadUsersFromJSONFile() {
    try {
        const response = await fetch('/task4/users.json');
        if (response.ok) {
            const data = await response.json();
            users = data.users || [];
            // Save to localStorage as backup
            localStorage.setItem('users', JSON.stringify(data));
            return true;
        }
    } catch (error) {
        console.log('Could not load users.json');
    }
    return false;
}

// Load users from localStorage (fallback)
function loadUsersFromStorage() {
    try {
        const stored = localStorage.getItem('users');
        if (stored) {
            const data = JSON.parse(stored);
            users = data.users || [];
            return true;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return false;
}

// Save new user to JSON Server API
async function saveUserToAPI(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            const newUser = await response.json();
            // Add to local users array
            users.push(newUser);
            // Update localStorage as backup
            localStorage.setItem('users', JSON.stringify({ users: users }));
            return { success: true, user: newUser };
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error saving user to API:', error);
        // Fallback: add to local array and localStorage
        users.push(userData);
        localStorage.setItem('users', JSON.stringify({ users: users }));
        return { success: false, user: userData, error: error.message };
    }
}

// Language and Theme state
let currentLanguage = localStorage.getItem('language') || 'en';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Language order: en -> mn -> mn-mong -> en
const languageOrder = ['en', 'mn', 'mn-mong'];

// Update theme icon
function updateThemeIcon(isDark) {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.classList.remove('fa-moon', 'fa-sun');
        themeIcon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
    }
}

// Update language
function updateLanguage(lang) {
    currentLanguage = lang;
    
    // Helper function to get text based on language
    function getTextForLang(element, attrPrefix) {
        if (lang === 'en') {
            return element.getAttribute(attrPrefix + '-en');
        } else if (lang === 'mn') {
            return element.getAttribute(attrPrefix + '-mn') || element.getAttribute(attrPrefix + '-en');
        } else if (lang === 'mn-mong') {
            return element.getAttribute(attrPrefix + '-mn-mong') || element.getAttribute(attrPrefix + '-mn') || element.getAttribute(attrPrefix + '-en');
        }
        return element.getAttribute(attrPrefix + '-en');
    }
    
    // Update text elements (spans, labels, etc.)
    document.querySelectorAll('[data-en]').forEach(element => {
        if (element.tagName !== 'INPUT' && element.tagName !== 'BUTTON') {
            const text = getTextForLang(element, 'data');
            if (text) {
                element.textContent = text;
            }
        }
    });

    // Update button texts
    document.querySelectorAll('button[data-en]').forEach(button => {
        const text = getTextForLang(button, 'data');
        if (text) {
            // For buttons with spans inside, update the span
            const span = button.querySelector('span');
            if (span) {
                span.textContent = text;
            } else {
                button.textContent = text;
            }
        }
    });

    // Update input placeholders
    document.querySelectorAll('input[data-placeholder-en]').forEach(input => {
        const placeholder = getTextForLang(input, 'data-placeholder');
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });

    // Update labels
    document.querySelectorAll('label[data-en]').forEach(label => {
        const text = getTextForLang(label, 'data');
        if (text) {
            label.textContent = text;
        }
    });

    // Update language toggle button text
    const langText = document.getElementById('langText');
    if (langText) {
        if (lang === 'en') {
            langText.textContent = 'MN';
        } else if (lang === 'mn') {
            langText.textContent = 'ᠮ';
        } else if (lang === 'mn-mong') {
            langText.textContent = 'EN';
        }
    }
}

// Get translated text
function getText(enText, mnText, mnMongText) {
    if (currentLanguage === 'en') {
        return enText;
    } else if (currentLanguage === 'mn') {
        return mnText || enText;
    } else if (currentLanguage === 'mn-mong') {
        return mnMongText || mnText || enText;
    }
    return enText;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Try to load from API first, then fallback to localStorage/static file
    await loadUsersFromAPI();

    // Initialize theme
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    // Initialize language
    updateLanguage(currentLanguage);

    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            // Cycle through languages: en -> mn -> mn-mong -> en
            const currentIndex = languageOrder.indexOf(currentLanguage);
            const nextIndex = (currentIndex + 1) % languageOrder.length;
            currentLanguage = languageOrder[nextIndex];
            localStorage.setItem('language', currentLanguage);
            updateLanguage(currentLanguage);
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            document.body.classList.toggle('dark-mode', isDarkMode);
            updateThemeIcon(isDarkMode);
        });
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Social login buttons
    const googleBtn = document.getElementById('googleBtn');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert(getText('Google login would be implemented here', 'Google нэвтрэлт энд хэрэгжүүлэх болно'));
        });
    }

    const facebookBtn = document.getElementById('facebookBtn');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert(getText('Facebook login would be implemented here', 'Facebook нэвтрэлт энд хэрэгжүүлэх болно'));
        });
    }

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert(getText('Forgot password functionality would be implemented here', 'Нууц үг сэргээх функц энд хэрэгжүүлэх болно'));
        });
    }

    // Toggle between login and register
    const showLoginBtn = document.getElementById('showLogin');
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    }

    const showLoginFromSignupBtn = document.getElementById('showLoginFromSignup');
    if (showLoginFromSignupBtn) {
        showLoginFromSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    }

    // Sign Up button handler
    const signUpBtn = document.getElementById('signUpBtn');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegister();
        });
    }

    // Create Account button handler
    const createAccountBtn = document.getElementById('createAccountBtn');
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegister();
        });
    }

    // Password toggle buttons
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            togglePasswordVisibility('password', togglePassword);
        });
    }

    const toggleRegPassword = document.getElementById('toggleRegPassword');
    if (toggleRegPassword) {
        toggleRegPassword.addEventListener('click', () => {
            togglePasswordVisibility('regPassword', toggleRegPassword);
        });
    }
});

// Toggle password visibility
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show register form
function showRegister() {
    const loginWrapper = document.getElementById('loginWrapper');
    const registerBox = document.getElementById('registerBox');
    
    if (loginWrapper && registerBox) {
        loginWrapper.style.display = 'none';
        registerBox.style.display = 'block';
        clearMessages();
        window.scrollTo(0, 0);
    }
}

// Show login form
function showLogin() {
    const loginWrapper = document.getElementById('loginWrapper');
    const registerBox = document.getElementById('registerBox');
    
    if (loginWrapper && registerBox) {
        loginWrapper.style.display = 'block';
        registerBox.style.display = 'none';
        clearMessages();
        window.scrollTo(0, 0);
    }
}

// Clear all messages
function clearMessages() {
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');
    const regErrorMsg = document.getElementById('regErrorMessage');
    const regSuccessMsg = document.getElementById('regSuccessMessage');
    
    if (errorMsg) errorMsg.textContent = '';
    if (successMsg) successMsg.textContent = '';
    if (regErrorMsg) regErrorMsg.textContent = '';
    if (regSuccessMsg) regSuccessMsg.textContent = '';
}

// Auto login after registration (deprecated - now redirects directly)
function autoLogin(username, password) {
    // This function is kept for backward compatibility
    // But registration now redirects directly to index.html
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        sessionStorage.setItem('loggedInUser', JSON.stringify({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        }));
        window.location.href = '../index.html';
    }
}

// Handle login
async function handleLogin(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    clearMessages();

    const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
    const username = document.getElementById('username') ? document.getElementById('username').value.trim() : '';
    const password = document.getElementById('password').value;

    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');

    // Use email if available, otherwise username
    const loginIdentifier = email || username;

    // Validate input
    if (!loginIdentifier || !password) {
        if (errorMsg) errorMsg.textContent = getText('Please fill in all fields', 'Бүх талбарыг бөглөнө үү');
        return;
    }

    // Reload users from API to ensure we have the latest data
    await loadUsersFromAPI();

    // Check if user exists (support both email and username for backward compatibility)
    const user = users.find(u => 
        (u.email === loginIdentifier || u.username === loginIdentifier) && u.password === password
    );

    if (user) {
        if (successMsg) {
            const welcomeMsg = getText('Login successful! Welcome back, ', 'Амжилттай нэвтэрлээ! Тавтай морил, ');
            successMsg.textContent = welcomeMsg + (user.name || user.username) + '!';
        }
        if (errorMsg) errorMsg.textContent = '';
        
        // Save logged in user to sessionStorage
        sessionStorage.setItem('loggedInUser', JSON.stringify({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        }));
        
        // Clear form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
        
        // Show success message and redirect
        setTimeout(() => {
            const alertMsg = getText('Login successful! Redirecting...', 'Амжилттай нэвтэрлээ! Шилжүүлж байна...');
            if (successMsg) successMsg.textContent = alertMsg;
            
            // Redirect to main index.html after 1 second
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }, 500);
    } else {
        if (errorMsg) errorMsg.textContent = getText('Invalid email or password', 'Имэйл эсвэл нууц үг буруу байна');
        if (successMsg) successMsg.textContent = '';
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    clearMessages();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;

    const errorMsg = document.getElementById('regErrorMessage');
    const successMsg = document.getElementById('regSuccessMessage');

    // Validate input
    if (!name || !email || !username || !password) {
        if (errorMsg) errorMsg.textContent = getText('Please fill in all fields', 'Бүх талбарыг бөглөнө үү');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (errorMsg) errorMsg.textContent = getText('Please enter a valid email address', 'Зөв имэйл хаяг оруулна уу');
        return;
    }

    // Check password length
    if (password.length < 8) {
        if (errorMsg) errorMsg.textContent = getText('Password must be at least 8 characters long', 'Нууц үг дор хаяж 8 тэмдэгт байх ёстой');
        return;
    }

    // Reload users from API to check for duplicates (in case another user was added)
    await loadUsersFromAPI();

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        if (errorMsg) errorMsg.textContent = getText('Email already exists. Please use another email.', 'Энэ имэйл аль хэдийн бүртгэгдсэн байна. Өөр имэйл ашиглана уу.');
        return;
    }

    // Check if username already exists
    if (users.some(u => u.username === username)) {
        if (errorMsg) errorMsg.textContent = getText('Username already exists. Please choose another.', 'Энэ хэрэглэгчийн нэр аль хэдийн бүртгэгдсэн байна. Өөр нэр сонгоно уу.');
        return;
    }

    // Create new user object
    const newUser = {
        name: name,
        email: email,
        username: username,
        password: password,
        createdAt: new Date().toISOString()
    };

    // Save user to API (JSON Server will assign ID automatically)
    const saveResult = await saveUserToAPI(newUser);

    if (saveResult.success) {
        if (successMsg) successMsg.textContent = getText('Registration successful! Please log in.', 'Амжилттай бүртгүүллээ! Нэвтрэнэ үү.');
        if (errorMsg) errorMsg.textContent = '';

        // Clear form
        document.getElementById('registerForm').reset();

        // Switch to login form and pre-fill email
        setTimeout(() => {
            showLogin();
            
            // Pre-fill email in login form
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = email;
            }
            
            // Show success message in login form
            const loginSuccessMsg = document.getElementById('successMessage');
            if (loginSuccessMsg) {
                loginSuccessMsg.textContent = getText('Registration successful! Please log in with your credentials.', 'Амжилттай бүртгүүллээ! Нэвтрэх мэдээллээ ашиглан нэвтрэнэ үү.');
            }
        }, 1000);
    } else {
        // Still show success if saved to localStorage fallback
        if (successMsg) successMsg.textContent = getText('Registration successful (saved locally)! Please log in.', 'Амжилттай бүртгүүллээ (орон нутгийн хадгаллаа)! Нэвтрэнэ үү.');
        if (errorMsg) errorMsg.textContent = '';
        
        // Clear form
        document.getElementById('registerForm').reset();

        // Switch to login form after delay
        setTimeout(() => {
            showLogin();
            
            // Pre-fill email in login form
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = email;
            }
        }, 1000);
    }
}
