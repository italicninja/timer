import { TIME_CONFIG, CALENDAR } from './config.js';
import { formatCountdown, getElementByIdSafe, colorCodeDay } from './utils.js';

/**
 * Handles Vanadiel time calculations and display
 */
export class VanadielTime {
    /**
     * @param {HTMLFormElement} form - The Timer form element
     */
    constructor(form) {
        if (!form) {
            throw new Error('Form element is required for VanadielTime');
        }

        this.form = form;
        this.elements = {
            vTime: getElementByIdSafe('vTime'),
            eTime: getElementByIdSafe('eTime'),
            tooltip: getElementByIdSafe('tooltip')
        };

        // Bind methods
        this.updateVanadielTime = this.updateVanadielTime.bind(this);
        this.updateEarthTime = this.updateEarthTime.bind(this);
        this.showDayDetails = this.showDayDetails.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);

        // Add event listeners
        this.elements.vTime.addEventListener('mouseenter', this.showDayDetails);
        this.elements.vTime.addEventListener('mouseleave', this.hideTooltip);
    }

    /**
     * Calculates current Vanadiel date and time components
     * @returns {Object} Vanadiel date/time components
     */
    calculateVanadielTime() {
        const now = new Date();
        const vanaDate = ((898 * 360 + 30) * TIME_CONFIG.MS_REAL_DAY) +
                        (now.getTime() - TIME_CONFIG.BASIS_DATE.getTime()) * 25;

        return {
            year: Math.floor(vanaDate / (360 * TIME_CONFIG.MS_REAL_DAY)),
            month: Math.floor((vanaDate % (360 * TIME_CONFIG.MS_REAL_DAY)) / (30 * TIME_CONFIG.MS_REAL_DAY)) + 1,
            date: Math.floor((vanaDate % (30 * TIME_CONFIG.MS_REAL_DAY)) / TIME_CONFIG.MS_REAL_DAY) + 1,
            hour: Math.floor((vanaDate % TIME_CONFIG.MS_REAL_DAY) / (60 * 60 * 1000)),
            minute: Math.floor((vanaDate % (60 * 60 * 1000)) / (60 * 1000)),
            second: Math.floor((vanaDate % (60 * 1000)) / 1000),
            day: Math.floor((vanaDate % (8 * TIME_CONFIG.MS_REAL_DAY)) / TIME_CONFIG.MS_REAL_DAY)
        };
    }

    /**
     * Formats Vanadiel time components with leading zeros
     * @param {Object} time - Vanadiel time components
     * @returns {Object} Formatted time components
     */
    formatVanadielTime(time) {
        return {
            year: time.year.toString().padStart(4, '0'),
            month: time.month.toString().padStart(2, '0'),
            date: time.date.toString().padStart(2, '0'),
            hour: time.hour.toString().padStart(2, '0'),
            minute: time.minute.toString().padStart(2, '0'),
            second: time.second.toString().padStart(2, '0'),
            day: time.day
        };
    }

    /**
     * Updates the Vanadiel time display
     */
    async updateVanadielTime() {
        try {
            const time = this.calculateVanadielTime();
            const formatted = this.formatVanadielTime(time);

            const dayName = CALENDAR.VANA_DAYS[formatted.day];
            const dayColor = CALENDAR.DAY_COLORS[formatted.day];

            const timeString = `
                <div class="vana-time" data-day="${formatted.day}">
                    ${colorCodeDay(dayName, dayColor)}:
                    ${formatted.year}-${formatted.month}-${formatted.date}
                    ${formatted.hour}:${formatted.minute}:${formatted.second}
                </div>`;

            this.elements.vTime.innerHTML = timeString;
        } catch (error) {
            console.error('Error updating Vanadiel time:', error);
            this.elements.vTime.innerHTML = '<span class="text-error">Error calculating time</span>';
        }
    }

    /**
     * Updates the Earth time display
     */
    async updateEarthTime() {
        try {
            const now = new Date();
            const earthTime = now.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            this.elements.eTime.innerHTML = earthTime;
        } catch (error) {
            console.error('Error updating Earth time:', error);
            this.elements.eTime.innerHTML = '<span class="text-error">Error displaying time</span>';
        }
    }

    /**
     * Shows details for the current Vanadiel day in a tooltip
     * @param {Event} event - The mouse event
     */
    showDayDetails(event) {
        try {
            const currentDay = parseInt(event.target.closest('.vana-time').dataset.day);
            let tableRows = '';

            for (let i = 0; i < 8; i++) {
                const dayIndex = (currentDay + i) % 8;
                const dayName = CALENDAR.VANA_DAYS[dayIndex];
                const dayColor = CALENDAR.DAY_COLORS[dayIndex];
                const weakMagic = CALENDAR.WEAK_MAGIC[dayIndex];
                const weakColor = CALENDAR.WEAK_COLORS[dayIndex];

                tableRows += `<tr>
                    <td>${colorCodeDay(dayName, dayColor)}</td>
                    <td>${colorCodeDay(weakMagic, weakColor)}</td>
                </tr>`;
            }

            const table = `
                <div class="tooltip-content">
                    <h3>Day Details</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Weak Element</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>`;

            this.elements.tooltip.innerHTML = table;
            this.elements.tooltip.style.display = 'block';

            const rect = event.target.getBoundingClientRect();
            this.elements.tooltip.style.left = `${rect.left}px`;
            this.elements.tooltip.style.top = `${rect.bottom + 5}px`;
        } catch (error) {
            console.error('Error showing day details:', error);
            this.elements.tooltip.innerHTML = '<span class="text-error">Error displaying details</span>';
        }
    }

    /**
     * Hides the tooltip
     */
    hideTooltip() {
        this.elements.tooltip.style.display = 'none';
    }
}