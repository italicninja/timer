import { TIME_CONFIG } from './config.js';
import { formatDate, getElementByIdSafe } from './utils.js';

/**
 * RSE (Race-Specific Equipment) Calendar class
 */
export class RSECalendar {
    /**
     * @param {HTMLFormElement} form - The Timer form element
     */
    constructor(form) {
        if (!form) {
            throw new Error('Form element is required for RSECalendar');
        }

        this.form = form;
        this.elements = {
            calendar: getElementByIdSafe('rCal'),
            tooltip: getElementByIdSafe('tooltip')
        };

        // RSE configuration
        this.config = {
            races: [
                'Male Hume', 'Female Hume', 'Male Elvaan', 'Female Elvaan',
                'Male TaruTaru', 'Female TaruTaru', 'Mithra', 'Galka'
            ],
            locations: [
                'Gusgen Mines', 'Shakrami Maze', 'Ordelle Caves'
            ],
            keyDroppers: {
                'Gusgen Mines': [
                    'Sad Fly', 'Gallinipper', 'Rancid Ooze', 'Banshee', 'Mauthe Dog',
                    'Myconid', 'Wight', 'Ghast', 'Wendigo', 'Spunkie', 'Amphisbeana',
                    'Thunder Elemental', 'Greater Pugil'
                ],
                'Shakrami Maze': [
                    'Goblin Furrier', 'Goblin Shaman', 'Goblin Pathfinder', 'Goblin Smithy',
                    'Caterchipillar', 'Wight', 'Labyrinth Scorpion', 'Abyss Worm',
                    'Protozoan', 'Air Elemental', 'Ichorous Ire'
                ],
                'Ordelle Caves': [
                    'Air Elemental', 'Goblin Shaman', 'Goblin Smithy', 'Goblin Pathfinder',
                    'Goliath Beetle', 'Napam', 'Stroper', 'Stroper Chyme', 'Water Elemental'
                ]
            }
        };

        // Bind methods
        this.updateCalendar = this.updateCalendar.bind(this);
        this.showLocationDetails = this.showLocationDetails.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    /**
     * Updates the RSE calendar display
     */
    async updateCalendar() {
        try {
            const rseSelect = this.form.querySelector('[name="RSE"]');
            const raceSelect = this.form.querySelector('[name="RSErace"]');

            if (!rseSelect || !raceSelect) {
                throw new Error('RSE or RSErace select elements not found');
            }

            const repeatCal = parseInt(rseSelect.value) || 0;
            const raceFilter = parseInt(raceSelect.value);

            if (repeatCal < 1) {
                this.elements.calendar.innerHTML = '';
                return;
            }

            const now = new Date();
            const rseTime = TIME_CONFIG.RSE_DATE.getTime();
            const localTime = now.getTime();

            let table;
            if (raceFilter > 7) {
                // Show all races
                let tableRows = '';
                for (let i = 0; i < repeatCal; i++) {
                    const elapsedWeeks = Math.floor((localTime - rseTime) / (8 * TIME_CONFIG.MS_GAME_DAY)) + i;
                    const rseStart = rseTime + (elapsedWeeks * 8 * TIME_CONFIG.MS_GAME_DAY);

                    tableRows += `<tr>
                        <td>${formatDate(rseStart, 2)}</td>
                        <td>${this.config.races[elapsedWeeks % 8]}</td>
                        <td>
                            <span class="location-link" data-location="${elapsedWeeks % 3}">
                                ${this.config.locations[elapsedWeeks % 3]}
                            </span>
                        </td>
                    </tr>`;
                }

                table = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Race</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>`;
            } else {
                // Show specific race
                let tableRows = '';
                const offsetTime = raceFilter * 8 * TIME_CONFIG.MS_GAME_DAY;

                for (let i = 0; i < repeatCal; i++) {
                    const elapsedWeeks = Math.floor((localTime - rseTime) / (64 * TIME_CONFIG.MS_GAME_DAY)) + i;
                    const elapsedLocationWeeks = Math.floor((localTime - rseTime) / (8 * TIME_CONFIG.MS_GAME_DAY)) + (8 * i);
                    const raceOffset = raceFilter - (elapsedLocationWeeks % 8);
                    const adjustedLocationWeeks = elapsedLocationWeeks + raceOffset;

                    const rseStart = rseTime + (elapsedWeeks * 64 * TIME_CONFIG.MS_GAME_DAY) + offsetTime;
                    const rseEnd = rseStart + (8 * TIME_CONFIG.MS_GAME_DAY);

                    tableRows += `<tr>
                        <td>${formatDate(rseStart, 2)}</td>
                        <td>${formatDate(rseEnd, 2)}</td>
                        <td>
                            <span class="location-link" data-location="${adjustedLocationWeeks % 3}">
                                ${this.config.locations[adjustedLocationWeeks % 3]}
                            </span>
                        </td>
                    </tr>`;
                }

                table = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Start</th>
                                <th>End</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>`;
            }

            this.elements.calendar.innerHTML = table;

            // Add event listeners for tooltips
            const locationLinks = this.elements.calendar.querySelectorAll('.location-link');
            locationLinks.forEach(link => {
                link.addEventListener('mouseenter', (event) => {
                    const locationIndex = parseInt(event.target.dataset.location);
                    this.showLocationDetails(event, locationIndex);
                });
                link.addEventListener('mouseleave', this.hideTooltip);
            });
        } catch (error) {
            console.error('Error updating RSE calendar:', error);
            this.elements.calendar.innerHTML = '<span class="text-error">Error displaying RSE calendar</span>';
        }
    }

    /**
     * Shows details for a specific RSE location in a tooltip
     * @param {Event} event - The mouse event
     * @param {number} locationIndex - Index of the location to show details for
     */
    showLocationDetails(event, locationIndex) {
        try {
            const location = this.config.locations[locationIndex];
            const keyDroppers = this.config.keyDroppers[location];

            // Split key droppers into columns
            const midPoint = Math.ceil(keyDroppers.length / 2);
            const col1 = keyDroppers.slice(0, midPoint);
            const col2 = keyDroppers.slice(midPoint);

            const tooltipContent = `
                <div class="tooltip-content">
                    <h3>Key Droppers - ${location}</h3>
                    <table class="table">
                        <tr>
                            <td class="no-border">
                                ${col1.join('<br>')}
                            </td>
                            <td class="no-border">
                                ${col2.join('<br>')}
                            </td>
                        </tr>
                    </table>
                </div>`;

            this.elements.tooltip.innerHTML = tooltipContent;
            this.elements.tooltip.style.display = 'block';

            const tooltipWidth = this.elements.tooltip.offsetWidth;
            const tooltipHeight = this.elements.tooltip.offsetHeight;

            // Position the tooltip above the cursor
            const left = Math.min(event.pageX - tooltipWidth / 2, window.innerWidth - tooltipWidth);
            const top = Math.max(event.pageY - tooltipHeight - 10, 0);

            this.elements.tooltip.style.left = `${left}px`;
            this.elements.tooltip.style.top = `${top}px`;
        } catch (error) {
            console.error('Error showing RSE location details:', error);
            this.elements.tooltip.innerHTML = '<span class="text-error">Error displaying location details</span>';
        }
    }

    /**
     * Hides the tooltip
     */
    hideTooltip() {
        this.elements.tooltip.style.display = 'none';
    }
}