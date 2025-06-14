import { TIME_CONFIG, CALENDAR, TRANSPORT } from './config.js';
import { formatCountdown, formatDate, getElementByIdSafe, colorCodeDay } from './utils.js';

export class TransportSchedule {
    /**
     * @param {HTMLFormElement} form - The Timer form element
     */
    constructor(form) {
        if (!form) {
            throw new Error('Form element is required for TransportSchedule');
        }

        this.form = form;
        this.elements = {
            ferry: getElementByIdSafe('ferry'),
            airship: getElementByIdSafe('Airship')
        };

        // Bind methods
        this.updateFerrySchedule = this.updateFerrySchedule.bind(this);
        this.updateAirshipSchedule = this.updateAirshipSchedule.bind(this);
    }

    /**
     * Updates the ferry schedule display
     */
    async updateFerrySchedule() {
        try {
            const ferryCountSelect = this.form.querySelector('[name="FerryCount"]');
            if (!ferryCountSelect) {
                throw new Error('FerryCount select element not found');
            }

            const repeatFerry = parseInt(ferryCountSelect.value) || 0;
            if (repeatFerry < 1) {
                this.elements.ferry.innerHTML = '';
                return;
            }

            const now = new Date();
            const timeDiff = now.getTime() - TIME_CONFIG.BASIS_DATE.getTime();
            const hours = Math.floor((timeDiff / (TIME_CONFIG.MS_GAME_DAY / 3)) % 3);
            const timeLeft = (TIME_CONFIG.MS_GAME_DAY / 3) - (timeDiff % (TIME_CONFIG.MS_GAME_DAY / 3));

            const vanaDate = ((898 * 360 + 30) * TIME_CONFIG.MS_REAL_DAY) + (timeDiff * 25);
            const vDay = Math.floor((vanaDate % (8 * TIME_CONFIG.MS_REAL_DAY)) / TIME_CONFIG.MS_REAL_DAY);

            let tableRows = '';
            for (let i = 0; i < repeatFerry; i++) {
                const timeLeftLoop = timeLeft + (i * TIME_CONFIG.MS_GAME_DAY / 3);
                const dPos = (vDay + Math.floor((hours + 1 + i) / 3)) % 8;
                const dPos2 = (dPos + TRANSPORT.BOAT_SCHEDULES.DAY_OFFSET[(hours + i) % 3]) % 8;

                const arrivalTime = Math.max(timeLeftLoop - 216000, 0);

                tableRows += `<tr>
                    <td>${colorCodeDay(CALENDAR.VANA_DAYS[dPos2], CALENDAR.DAY_COLORS[dPos2])}</td>
                    <td>${TRANSPORT.BOAT_SCHEDULES.ARRIVAL[(hours + i) % 3]}</td>
                    <td>${formatCountdown(arrivalTime)}</td>
                    <td>${colorCodeDay(CALENDAR.VANA_DAYS[dPos], CALENDAR.DAY_COLORS[dPos])}</td>
                    <td>${TRANSPORT.BOAT_SCHEDULES.DEPARTURE[(hours + i) % 3]}</td>
                    <td>${formatCountdown(timeLeftLoop)}</td>
                </tr>`;
            }

            const table = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Arrives</th>
                            <th>Time</th>
                            <th>ETA</th>
                            <th>Departs</th>
                            <th>Time</th>
                            <th>ETD</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>`;

            this.elements.ferry.innerHTML = table;
        } catch (error) {
            console.error('Error updating ferry schedule:', error);
            this.elements.ferry.innerHTML = '<span class="text-error">Error displaying ferry schedule</span>';
        }
    }

    /**
     * Updates the airship schedule display
     */
    async updateAirshipSchedule() {
        try {
            const now = new Date();
            const elapsedTime = (now.getTime() - TIME_CONFIG.BASIS_DATE.getTime()) % TIME_CONFIG.MS_GAME_DAY;

            const vanaDate = ((898 * 360 + 30) * TIME_CONFIG.MS_REAL_DAY) +
                            (now.getTime() - TIME_CONFIG.BASIS_DATE.getTime()) * 25;
            const vDay = Math.floor((vanaDate % (8 * TIME_CONFIG.MS_REAL_DAY)) / TIME_CONFIG.MS_REAL_DAY);

            const routes = [
                { name: 'Jeuno To Bastok', offset: TRANSPORT.AIRSHIP_OFFSETS.JEUNO_BASTOK },
                { name: 'Jeuno To Kazham', offset: TRANSPORT.AIRSHIP_OFFSETS.JEUNO_KAZHAM },
                { name: 'Jeuno To San d\'Oria', offset: TRANSPORT.AIRSHIP_OFFSETS.BASTOK_JEUNO },
                { name: 'Jeuno To Windurst', offset: TRANSPORT.AIRSHIP_OFFSETS.JEUNO_WINDURST },
                { name: 'Bastok To Jeuno', offset: TRANSPORT.AIRSHIP_OFFSETS.BASTOK_JEUNO },
                { name: 'Kazham To Jeuno', offset: TRANSPORT.AIRSHIP_OFFSETS.JEUNO_WINDURST },
                { name: 'San d\'Oria To Jeuno', offset: TRANSPORT.AIRSHIP_OFFSETS.JEUNO_BASTOK },
                { name: 'Windurst To Jeuno', offset: TRANSPORT.AIRSHIP_OFFSETS.WINDURST_JEUNO }
            ];

            let tableRows = '';
            for (const route of routes) {
                const { nextDeparture, nextDay } = this.calculateNextDeparture(elapsedTime, route.offset, vDay);
                const arrivalTime = Math.max(nextDeparture - elapsedTime - 144000, 0);

                tableRows += `<tr>
                    <td>${route.name}</td>
                    <td>${colorCodeDay(CALENDAR.VANA_DAYS[nextDay], CALENDAR.DAY_COLORS[nextDay])}</td>
                    <td>${formatCountdown(arrivalTime)}</td>
                    <td>${formatCountdown(nextDeparture - elapsedTime)}</td>
                </tr>`;
            }

            const table = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Airship Route</th>
                            <th>Departure Day</th>
                            <th>Arrival</th>
                            <th>Departure</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>`;

            this.elements.airship.innerHTML = table;
        } catch (error) {
            console.error('Error updating airship schedule:', error);
            this.elements.airship.innerHTML = '<span class="text-error">Error displaying airship schedule</span>';
        }
    }

    /**
     * Calculates the next departure time and day for an airship route
     * @private
     */
    calculateNextDeparture(elapsed, offset, day) {
        let newOffset = offset;
        let count = 0;
        while (newOffset < elapsed) {
            count += 1;
            newOffset += (TIME_CONFIG.MS_GAME_DAY / 4);
        }

        const nextDay = count >= 4 ? (day + 1) % 8 : day;
        return { nextDeparture: newOffset, nextDay };
    }

    /**
     * Updates all transportation schedules
     */
    async updateSchedules() {
        await Promise.all([
            this.updateFerrySchedule(),
            this.updateAirshipSchedule()
        ]);
    }
}