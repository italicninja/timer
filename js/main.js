import { VanadielTime } from './VanadielTime.js';
import { CardManager } from './CardManager.js';
import { TransportSchedule } from './TransportSchedule.js';
import { MoonPhase } from './MoonPhase.js';
import { RSECalendar } from './RSECalendar.js';
import { DayCalendar } from './DayCalendar.js';
import { CraftingGuild } from './CraftingGuild.js';
import { TIME_CONFIG } from './config.js';

class TimerApp {
    constructor() {
        // Wait for DOM to be ready before initializing modules
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeModules();
            this.initEventListeners();
            this.startUpdateLoop();
        });

        // Error handling
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handleError.bind(this));
    }

    initializeModules() {
        // Get the form element
        const form = document.querySelector('form[name="Timer"]');
        if (!form) {
            throw new Error('Timer form not found');
        }

        // Initialize modules with form reference
        this.modules = {
            vanadielTime: new VanadielTime(form),
            transportSchedule: new TransportSchedule(form),
            moonPhase: new MoonPhase(form),
            rseCalendar: new RSECalendar(form),
            dayCalendar: new DayCalendar(form),
            craftingGuild: new CraftingGuild(),
            cardManager: new CardManager()
        };
    }

    initEventListeners() {
        this.initThemeToggle();
        this.initFormListeners();
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('darklighttoggle');
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }

        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    initFormListeners() {
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', () => this.updateAll());
        });
    }


    startUpdateLoop() {
        let isUpdating = false;

        const update = async () => {
            if (!isUpdating) {
                isUpdating = true;
                try {
                    await this.updateAll();
                } catch (error) {
                    console.error('Error in update loop:', error);
                    this.handleError(error);
                } finally {
                    isUpdating = false;
                }
            }
            requestAnimationFrame(() => setTimeout(update, TIME_CONFIG.UPDATE_INTERVAL));
        };

        update();
    }

    async updateAll() {
        if (!this.modules) return;

        const updates = [
            this.modules.vanadielTime.updateVanadielTime(),
            this.modules.vanadielTime.updateEarthTime(),
            this.modules.moonPhase.updateAll(),
            this.modules.transportSchedule.updateSchedules(),
            this.modules.rseCalendar.updateCalendar(),
            this.modules.dayCalendar.updateCalendar(),
            this.modules.craftingGuild.updateGuildInfo()
        ];

        await Promise.all(updates.map(p => p?.catch?.(error => {
            console.error('Update error:', error);
        })));
    }

    handleError(error) {
        console.error('Application error:', error);

        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message fade-in';
        errorMessage.textContent = 'An error occurred. Please refresh the page.';

        const header = document.querySelector('.header');
        if (header && !document.querySelector('.error-message')) {
            header.insertAdjacentElement('afterend', errorMessage);
            setTimeout(() => errorMessage.remove(), 5000);
        }
    }
}

// Initialize the application
const app = new TimerApp();

export { TimerApp };