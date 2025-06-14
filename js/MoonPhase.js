import { TIME_CONFIG, CALENDAR } from './config.js';
import { formatCountdown, formatDate, getElementByIdSafe } from './utils.js';

/**
 * Handles moon phase calculations and display
 */
export class MoonPhase {
    /**
     * @param {HTMLFormElement} form - The Timer form element
     */
    constructor(form) {
        if (!form) {
            throw new Error('Form element is required for MoonPhase');
        }

        this.form = form;
        this.elements = {
            phase: getElementByIdSafe('mPhase'),
            calendar: getElementByIdSafe('mCalendar'),
            tooltip: getElementByIdSafe('tooltip')
        };

        // Moon phase emojis
        this.moonEmojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

        // Bind methods
        this.updateMoonPhase = this.updateMoonPhase.bind(this);
        this.updateMoonCalendar = this.updateMoonCalendar.bind(this);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    /**
   * Calculates the current moon phase
   * @returns {Object} Moon phase information
   */
    calculateMoonPhase() {
        const now = new Date();
        const localTime = now.getTime();
        const moonDays = Math.floor((localTime - TIME_CONFIG.MOON_DATE.getTime()) / TIME_CONFIG.MS_GAME_DAY) % 84;
        const moonPercent = -Math.round((42 - moonDays) / 42 * 100);

        let phase = 0;
        let optimalPhase = 4;
        let toNextPhase = 0;
        let toOptimalPhase = 0;

        if (moonPercent <= -94 || moonPercent >= 90) {
            phase = 0;
            optimalPhase = 4;
            toNextPhase = moonPercent >= 90 ?
                (87 - moonDays) * TIME_CONFIG.MS_GAME_DAY :
                (3 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
            toOptimalPhase = (38 - moonDays + (moonPercent >= 90 ? 84 : 0)) * TIME_CONFIG.MS_GAME_DAY;
        } else if (moonPercent >= -93 && moonPercent <= -62) {
            phase = 1;
            optimalPhase = 4;
            toNextPhase = (17 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
            toOptimalPhase = (38 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
        } else if (moonPercent >= -61 && moonPercent <= -41) {
            phase = 2;
            optimalPhase = 4;
            toNextPhase = (25 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
            toOptimalPhase = (38 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
        } else if (moonPercent >= -40 && moonPercent <= -11) {
            phase = 3;
            optimalPhase = 4;
            toNextPhase = (38 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
            toOptimalPhase = (38 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
        } else if (moonPercent >= -10 && moonPercent <= 6) {
            phase = 4;
            optimalPhase = 0;
            toNextPhase = (45 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
            toOptimalPhase = (80 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
        } else if (moonPercent >= 7 && moonPercent <= 36) {
            phase = 5;
            optimalPhase = 0;
            toNextPhase = (58 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
            toOptimalPhase = (80 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
        } else if (moonPercent >= 37 && moonPercent <= 56) {
            phase = 6;
            optimalPhase = 0;
            toNextPhase = (66 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
            toOptimalPhase = (80 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
        } else if (moonPercent >= 57 && moonPercent <= 89) {
            phase = 7;
            optimalPhase = 0;
            toNextPhase = (80 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
            toOptimalPhase = (80 - moonDays) * TIME_CONFIG.MS_GAME_DAY;
        }

        return {
            phase,
            optimalPhase,
            toNextPhase,
            toOptimalPhase,
            percent: Math.abs(moonPercent)
        };
    }

    /**
     * Updates the moon phase display
     */
    async updateMoonPhase() {
        try {
            const moonInfo = this.calculateMoonPhase();
            const phaseName = CALENDAR.PHASE_NAMES[moonInfo.phase];

            console.log('Updating moon phase');
            let phaseText = document.createElement('span');
            phaseText.textContent = `${this.moonEmojis[moonInfo.phase]} ${phaseName} (${moonInfo.percent}%)`;

            if (moonInfo.percent <= 5 && moonInfo.percent >= -10) {
                phaseText.className = 'text-error';
            } else if (moonInfo.percent >= 90 || moonInfo.percent <= -95) {
                phaseText.className = 'text-primary';
            }

            const nextPhaseIndex = (moonInfo.phase + 1) % 8;
            const nextPhase = `Next phase (${this.moonEmojis[nextPhaseIndex]} ${CALENDAR.PHASE_NAMES[nextPhaseIndex]}): ${formatCountdown(moonInfo.toNextPhase)}`;
            const nextOptimal = `Next ${this.moonEmojis[moonInfo.optimalPhase]} ${CALENDAR.PHASE_NAMES[moonInfo.optimalPhase]}: ${formatCountdown(moonInfo.toOptimalPhase)}`;

            // Create the moon phase container
            const container = document.createElement('div');
            container.className = 'info-value';

            // Create the moon phase element
            const moonPhaseElement = document.createElement('div');
            moonPhaseElement.className = 'moon-phase';
            moonPhaseElement.dataset.phase = moonInfo.phase;
            moonPhaseElement.dataset.percent = moonInfo.percent;
            moonPhaseElement.appendChild(phaseText);

            // Create the additional info element
            const additionalInfo = document.createElement('div');
            additionalInfo.innerHTML = `${nextPhase}<br>${nextOptimal}`;

            // Add event listeners to the moon phase element
            moonPhaseElement.addEventListener('mouseenter', (event) => {
                console.log('Mouse entered moon phase element', event.target);
                this.showTooltip(event, moonPhaseElement);
            });

            moonPhaseElement.addEventListener('mouseleave', (event) => {
                console.log('Mouse left moon phase element', event.target);
                this.hideTooltip();
            });

            // Assemble the elements
            container.appendChild(moonPhaseElement);
            container.appendChild(additionalInfo);

            // Clear and update the phase element
            this.elements.phase.innerHTML = '';
            this.elements.phase.appendChild(container);

            console.log('Moon phase updated, element:', moonPhaseElement);

        } catch (error) {
            console.error('Error updating moon phase:', error);
            this.elements.phase.innerHTML = '<span class="text-error">Error displaying moon phase</span>';
        }
    }

    /**
     * Updates the moon calendar display
     */
    async updateMoonCalendar() {
        try {
            const moonSelect = this.form.querySelector('[name="Moon"]');
            if (!moonSelect) {
                throw new Error('Moon select element not found');
            }

            const repeatCal = parseInt(moonSelect.value) || 0;
            if (repeatCal < 1) {
                this.elements.calendar.innerHTML = '';
                return;
            }

            const now = new Date();
            const fullMoonBasis = TIME_CONFIG.MOON_DATE.getTime() + (3 * TIME_CONFIG.MS_GAME_DAY);

            let tableRows = '';
            for (let i = 0; i < repeatCal; i++) {
                const elapsedCycles = Math.floor((now.getTime() - fullMoonBasis) / (84 * TIME_CONFIG.MS_GAME_DAY)) + i;
                const fullEnd = fullMoonBasis + (elapsedCycles * 84 * TIME_CONFIG.MS_GAME_DAY);
                const fullStart = fullEnd - 7 * TIME_CONFIG.MS_GAME_DAY;
                const newStart = fullEnd - 49 * TIME_CONFIG.MS_GAME_DAY;
                const newEnd = fullEnd - 42 * TIME_CONFIG.MS_GAME_DAY;

                tableRows += `<tr>
                    <td>${formatDate(newStart, 2)}</td>
                    <td>${formatDate(newEnd, 2)}</td>
                    <td>${formatDate(fullStart, 2)}</td>
                    <td>${formatDate(fullEnd, 2)}</td>
                </tr>`;
            }

            const table = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>🌑 New Moon Start</th>
                            <th>🌒 New Moon End</th>
                            <th>🌕 Full Moon Start</th>
                            <th>🌖 Full Moon End</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>`;

            this.elements.calendar.innerHTML = table;
        } catch (error) {
            console.error('Error updating moon calendar:', error);
            this.elements.calendar.innerHTML = '<span class="text-error">Error displaying moon calendar</span>';
        }
    }

    /**
     * Shows tooltip with moon phase details
     * @param {Event} event - The mouse event
     * @param {HTMLElement} element - The moon phase element
     */
    showTooltip(event, element) {
        console.log('Showing tooltip for', element);
        const phase = parseInt(element.dataset.phase);
        const percent = parseInt(element.dataset.percent);
        const phaseName = CALENDAR.PHASE_NAMES[phase];

        const tooltipContent = `
            <div class="tooltip-content">
                <h3>Moon Information</h3>
                <p>Current Phase: ${this.moonEmojis[phase]} ${phaseName} (${percent}%)</p>
                <p>Each lunar cycle takes exactly 84 game days (3 days, 8 hours, 38 minutes, 24 seconds)</p>
            </div>
        `;

        this.elements.tooltip.innerHTML = tooltipContent;
        this.elements.tooltip.style.display = 'block';

        const rect = element.getBoundingClientRect();
        const tooltipWidth = this.elements.tooltip.offsetWidth;
        const tooltipHeight = this.elements.tooltip.offsetHeight;

        // Position the tooltip above the element
        const left = Math.max(0, Math.min(rect.left, window.innerWidth - tooltipWidth));
        const top = Math.max(0, rect.top - tooltipHeight - 10);

        this.elements.tooltip.style.left = `${left}px`;
        this.elements.tooltip.style.top = `${top}px`;

        console.log('Tooltip positioned at', left, top, 'for element at', rect.left, rect.top);
    }

    /**
     * Hides the tooltip
     */
    hideTooltip() {
        this.elements.tooltip.style.display = 'none';
    }

    /**
     * Updates all moon-related displays
     */
    async updateAll() {
        await Promise.all([
            this.updateMoonPhase(),
            this.updateMoonCalendar()
        ]);
    }
}