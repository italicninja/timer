import { TIME_CONFIG, CALENDAR } from './config.js';
import { formatDate, getElementByIdSafe, colorCodeDay } from './utils.js';

/**
 * Handles day calendar calculations and display
 */
export class DayCalendar {
    /**
     * @param {HTMLFormElement} form - The Timer form element
     */
    constructor(form) {
        if (!form) {
            throw new Error('Form element is required for DayCalendar');
        }

        this.form = form;
        this.elements = {
            calendar: getElementByIdSafe('days'),
            tooltip: getElementByIdSafe('tooltip')
        };

        // Bind methods
        this.updateCalendar = this.updateCalendar.bind(this);
        this.showMoonPhaseDetails = this.showMoonPhaseDetails.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    /**
     * Calculates moon phase information
     * @private
     * @param {number} moonPercent - Moon phase percentage
     * @returns {Object} Phase information
     */
    calculateMoonPhase(moonPercent) {
        let phase;
        if (moonPercent <= -94 || moonPercent >= 90) {
            phase = 0;
        } else if (moonPercent >= -93 && moonPercent <= -62) {
            phase = 1;
        } else if (moonPercent >= -61 && moonPercent <= -41) {
            phase = 2;
        } else if (moonPercent >= -40 && moonPercent <= -11) {
            phase = 3;
        } else if (moonPercent >= -10 && moonPercent <= 6) {
            phase = 4;
        } else if (moonPercent >= 7 && moonPercent <= 36) {
            phase = 5;
        } else if (moonPercent >= 37 && moonPercent <= 56) {
            phase = 6;
        } else if (moonPercent >= 57 && moonPercent <= 89) {
            phase = 7;
        }

        let phaseText = `${CALENDAR.PHASE_NAMES[phase]} (${Math.abs(moonPercent)}%)`;

        if (moonPercent <= 5 && moonPercent >= -10) {
            phaseText = `<span class="text-error">${phaseText}</span>`;
        } else if (moonPercent >= 90 || moonPercent <= -95) {
            phaseText = `<span class="text-primary">${phaseText}</span>`;
        }

        return { phase, phaseText };
    }

    /**
     * Updates the day calendar display
     */
    async updateCalendar() {
        try {
            const dayCountSelect = this.form.querySelector('[name="DayCount"]');
            const daySelect = this.form.querySelector('[name="Day"]');

            if (!dayCountSelect || !daySelect) {
                throw new Error('DayCount or Day select elements not found');
            }

            const repeatCal = parseInt(dayCountSelect.value) || 0;
            const dayOffset = parseInt(daySelect.value);

            if (repeatCal < 1) {
                this.elements.calendar.innerHTML = '';
                return;
            }

            const now = new Date();
            const timeDiff = now.getTime() - TIME_CONFIG.MOON_DATE.getTime();
            const weekStart = now.getTime() - (timeDiff % (8 * TIME_CONFIG.MS_GAME_DAY));

            let tableRows = '';
            if (dayOffset > 7) {
                // Show all days
                for (let i = 0; i < repeatCal; i++) {
                    const startTime = weekStart + ((dayOffset - 14) * TIME_CONFIG.MS_GAME_DAY) + (TIME_CONFIG.MS_GAME_DAY * i);
                    const endTime = startTime + TIME_CONFIG.MS_GAME_DAY;

                    const moonDays = Math.floor((startTime - TIME_CONFIG.MOON_DATE.getTime()) / TIME_CONFIG.MS_GAME_DAY) % 84;
                    const moonPercent = -Math.round((42 - moonDays) / 42 * 100);
                    const { phaseText } = this.calculateMoonPhase(moonPercent);

                    tableRows += `<tr>
                        <td>${colorCodeDay(CALENDAR.VANA_DAYS[(dayOffset + i) % 8], CALENDAR.DAY_COLORS[(dayOffset + i) % 8])}</td>
                        <td>${formatDate(startTime, 2)}</td>
                        <td>${formatDate(endTime, 2)}</td>
                        <td><span class="moon-phase" data-moon-percent="${moonPercent}">${phaseText}</span></td>
                    </tr>`;
                }
            } else {
                // Show specific day
                for (let i = 0; i < repeatCal; i++) {
                    const startTime = weekStart + ((dayOffset - 6) * TIME_CONFIG.MS_GAME_DAY) + (8 * TIME_CONFIG.MS_GAME_DAY * i);
                    const endTime = startTime + TIME_CONFIG.MS_GAME_DAY;

                    const moonDays = Math.floor((startTime - TIME_CONFIG.MOON_DATE.getTime()) / TIME_CONFIG.MS_GAME_DAY) % 84;
                    const moonPercent = -Math.round((42 - moonDays) / 42 * 100);
                    const { phaseText } = this.calculateMoonPhase(moonPercent);

                    tableRows += `<tr>
                        <td>${colorCodeDay(CALENDAR.VANA_DAYS[dayOffset], CALENDAR.DAY_COLORS[dayOffset])}</td>
                        <td>${formatDate(startTime, 2)}</td>
                        <td>${formatDate(endTime, 2)}</td>
                        <td><span class="moon-phase" data-moon-percent="${moonPercent}">${phaseText}</span></td>
                    </tr>`;
                }
            }

            const table = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Begins</th>
                            <th>Ends</th>
                            <th>Moon Phase</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>`;

            this.elements.calendar.innerHTML = table;

            // Add event listeners for tooltips
            const moonPhases = this.elements.calendar.querySelectorAll('.moon-phase');
            moonPhases.forEach(phase => {
                phase.addEventListener('mouseenter', this.showMoonPhaseDetails);
                phase.addEventListener('mouseleave', this.hideTooltip);
            });
        } catch (error) {
            console.error('Error updating day calendar:', error);
            this.elements.calendar.innerHTML = '<span class="text-error">Error displaying day calendar</span>';
        }
    }

    /**
     * Shows moon phase details in a tooltip
     * @param {Event} event - The mouse event
     */
    showMoonPhaseDetails(event) {
        const moonPercent = parseInt(event.target.dataset.moonPercent);
        const { phase } = this.calculateMoonPhase(moonPercent);

        const tooltipContent = `
            <div class="tooltip-content">
                <h3>Moon Phase Details</h3>
                <p>Phase: ${CALENDAR.PHASE_NAMES[phase]}</p>
                <p>Percentage: ${Math.abs(moonPercent)}%</p>
                <p>Effect: ${this.getMoonPhaseEffect(phase)}</p>
            </div>
        `;

        this.elements.tooltip.innerHTML = tooltipContent;
        this.elements.tooltip.style.display = 'block';

        const tooltipWidth = this.elements.tooltip.offsetWidth;
        const tooltipHeight = this.elements.tooltip.offsetHeight;

        // Position the tooltip above the cursor
        const left = Math.min(event.pageX - tooltipWidth / 2, window.innerWidth - tooltipWidth);
        const top = Math.max(event.pageY - tooltipHeight - 10, 0);

        this.elements.tooltip.style.left = `${left}px`;
        this.elements.tooltip.style.top = `${top}px`;
    }

    /**
     * Hides the tooltip
     */
    hideTooltip() {
        this.elements.tooltip.style.display = 'none';
    }

    /**
     * Gets the effect of a moon phase
     * @param {number} phase - The moon phase index
     * @returns {string} The effect description
     */
    getMoonPhaseEffect(phase) {
        const effects = [
            "Enhances dark-elemental spells and abilities",
            "Slightly enhances dark-elemental spells and abilities",
            "No significant elemental effects",
            "Slightly enhances light-elemental spells and abilities",
            "Enhances light-elemental spells and abilities",
            "Slightly enhances light-elemental spells and abilities",
            "No significant elemental effects",
            "Slightly enhances dark-elemental spells and abilities"
        ];
        return effects[phase];
    }
}