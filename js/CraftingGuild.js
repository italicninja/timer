import { TIME_CONFIG } from './config.js';
import { formatCountdown, getElementByIdSafe } from './utils.js';

export class CraftingGuild {
    constructor() {
        this.elements = {
            guilds: getElementByIdSafe('Guilds'),
            tooltip: getElementByIdSafe('tooltip')
        };

        this.guildInfo = [
            { name: "Alchemy", location: "Bastok Mines", holiday: 6, openHour: 8, closeHour: 23 },
            { name: "Blacksmithing", location: "Bastok Metalworks, Northern San d'Oria", holiday: 2, openHour: 8, closeHour: 23 },
            { name: "Boneworking", location: "Windurst Woods", holiday: 3, openHour: 8, closeHour: 23 },
            { name: "Goldsmithing", location: "Bastok Market", holiday: 4, openHour: 8, closeHour: 23 },
            { name: "Clothcraft", location: "Windurst Woods", holiday: 0, openHour: 6, closeHour: 21 },
            { name: "Woodworking", location: "Northern San d'Oria", holiday: 0, openHour: 6, closeHour: 21 },
            { name: "Leathercraft", location: "Southern San d'Oria", holiday: 4, openHour: 3, closeHour: 18 },
            { name: "Fishing", location: "Port Windurst", holiday: 5, openHour: 3, closeHour: 18 },
            { name: "Cooking", location: "Windurst Waters", holiday: 7, openHour: 5, closeHour: 20 }
        ];

        this.updateGuildInfo = this.updateGuildInfo.bind(this);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    showTooltip(event) {
        const guildName = event.target.dataset.guild;
        const guild = this.guildInfo.find(g => g.name === guildName);
        if (guild) {
            const { isOpen, isHoliday, nextChange } = this.calculateGuildStatus(guild);
            const status = isHoliday ? 'Holiday' : (isOpen ? 'Open' : 'Closed');
            const nextChangeText = isOpen ? 'Closes in' : 'Opens in';

            this.elements.tooltip.innerHTML = `
                <strong>${guild.name}</strong><br>
                Location: ${guild.location}<br>
                Status: ${status}<br>
                ${nextChangeText}: ${formatCountdown(nextChange)}
            `;

            const rect = event.target.getBoundingClientRect();
            this.elements.tooltip.style.left = `${rect.left}px`;
            this.elements.tooltip.style.top = `${rect.bottom + 5}px`;
            this.elements.tooltip.style.display = 'block';
        }
    }

    hideTooltip() {
        this.elements.tooltip.style.display = 'none';
    }

    calculateGuildStatus(guild) {
        const now = new Date();
        const timeDiff = now.getTime() - TIME_CONFIG.BASIS_DATE.getTime();
        const vanaDate = ((898 * 360 + 30) * TIME_CONFIG.MS_REAL_DAY) + (timeDiff * 25);
        const vanaDay = Math.floor((vanaDate % (8 * TIME_CONFIG.MS_REAL_DAY)) / TIME_CONFIG.MS_REAL_DAY);
        const vanaHour = Math.floor((vanaDate % TIME_CONFIG.MS_REAL_DAY) / (60 * 60 * 1000));

        const isHoliday = vanaDay === guild.holiday;
        const isOpen = !isHoliday && vanaHour >= guild.openHour && vanaHour < guild.closeHour;

        let nextChange;
        if (isOpen) {
            // Time until closing
            nextChange = ((guild.closeHour - vanaHour) * 60 * 60 * 1000) / 25;
        } else if (isHoliday) {
            // Time until next day's opening
            const hoursUntilNextDay = 24 - vanaHour + guild.openHour;
            nextChange = (hoursUntilNextDay * 60 * 60 * 1000) / 25;
        } else {
            // Time until today's opening (if not past closing) or next day's opening
            const hoursUntilOpening = vanaHour < guild.openHour ?
                guild.openHour - vanaHour :
                24 - vanaHour + guild.openHour;
            nextChange = (hoursUntilOpening * 60 * 60 * 1000) / 25;
        }

        return { isOpen, isHoliday, nextChange };
    }

    async updateGuildInfo() {
        try {
            let guildInfoHtml = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Guild</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Next Change</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (const guild of this.guildInfo) {
                const { isOpen, isHoliday, nextChange } = this.calculateGuildStatus(guild);
                const statusClass = isHoliday ? 'guild-status-holiday' :
                    isOpen ? 'guild-status-open' : 'guild-status-closed';
                const statusText = isHoliday ? 'Holiday' :
                    isOpen ? 'Open' : 'Closed';
                const status = `<span class="${statusClass}">${statusText}</span>`;
                const nextChangeText = isOpen ? 'Closes in' : 'Opens in';

                guildInfoHtml += `
                    <tr class="guild-row" data-guild="${guild.name}">
                        <td data-guild="${guild.name}">${guild.name}</td>
                        <td data-guild="${guild.name}">${guild.location}</td>
                        <td data-guild="${guild.name}">${status}</td>
                        <td data-guild="${guild.name}">
                            <div class="crafting-guild-info">
                                <div>${nextChangeText}</div>
                                <div>${formatCountdown(nextChange)}</div>
                            </div>
                        </td>
                    </tr>
                `;
            }

            guildInfoHtml += '</tbody></table>';
            this.elements.guilds.innerHTML = guildInfoHtml;

            // Add event listeners for tooltip
            const guildRows = this.elements.guilds.querySelectorAll('.guild-row td');
            guildRows.forEach(cell => {
                cell.addEventListener('mouseenter', this.showTooltip);
                cell.addEventListener('mouseleave', this.hideTooltip);
            });
        } catch (error) {
            console.error('Error updating guild info:', error);
            this.elements.guilds.innerHTML = '<span class="text-error">Error displaying guild information</span>';
        }
    }
}