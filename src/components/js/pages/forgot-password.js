import { inputStyle, logoStyle } from "../formStyle.js";
import { API_URL, showError } from "./login.js";
import { Logger } from "../../../utils/Logger.js";

const logger = Logger.getLogger('PasswordReset');

document.addEventListener('DOMContentLoaded', () => {
    logoStyle();
    initForgotPassword();
});

const initForgotPassword = () => {
    const form = document.getElementById('forgotPasswordForm');
    if (!form) {
        logger.error('Forgot password form not found', { component: 'ForgotPasswordForm' });
        return;
    }

    form.innerHTML = `
            <div class="text-[var(--color-text)]">
                <label for="email" class="block text-sm font-medium">Email</label>
                <div class="relative flex items-center justify-center">
                    <i class="fa-solid fa-envelope icon-form"></i>
                    <input type="email" id="email" name="email" placeholder="email" required class="input-form">
                </div>
            </div>
            <button type="submit"
                class="w-full bg-active-600 text-white py-2 px-4 rounded-md hover:bg-active-700 focus:outline-none focus:ring-2 focus:ring-active-500 focus:ring-offset-2">
                Reset Password
            </button>`;
    
    inputStyle();
    form.addEventListener('submit', handleForgotPassword);
}

const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email')?.value.trim();
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!email) {
        logger.warn('Email validation failed', { reason: 'empty_email' });
        showError(errorMessage, 'Please enter your email');
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.innerHTML = `
        <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-[var(--color-text)] animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
        Sending...`;

        logger.info('Initiating password reset request', { email });

        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            logger.warn('Password reset request failed', { 
                status: response.status, 
                message: data.message 
            });
            throw new Error(data.message || 'Failed to send reset email');
        }

        logger.info('Password reset email sent successfully', { email });
        showSuccess(errorMessage, 'Reset password link has been sent to your email');
        
    } catch (error) {
        logger.error('Password reset error', { error: error.message });
        showError(errorMessage, error.message || 'An error occurred');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Reset Link';
    }
};

const showSuccess = (element, message) => {
    if (!element) return;
    element.textContent = message;
    element.className = 'success-message';
    element.classList.remove('hidden');
};