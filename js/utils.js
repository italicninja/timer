import { TIME_CONFIG } from './config.js';

/**
 * Formats a countdown duration into a string
 * @param {number} timeInMs - Time in milliseconds
 * @returns {string} Formatted countdown string (e.g. "1:23:45")
 */
export function formatCountdown(timeInMs) {
    const days = Math.floor(timeInMs / TIME_CONFIG.MS_REAL_DAY);
    const hours = Math.floor((timeInMs % TIME_CONFIG.MS_REAL_DAY) / (60 * 60 * 1000));
    const minutes = Math.floor((timeInMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeInMs % (60 * 1000)) / 1000);

    let formattedTime = '';

    if (days > 0) {
        formattedTime += `${days}:${hours.toString().padStart(2, '0')}:`;
    } else if (hours > 0) {
        formattedTime += `${hours}:`;
    }

    formattedTime += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
}

/**
 * Formats a date into a string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @param {number} showDay - 0: no day, 1: full day, 2: short day
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp, showDay) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let dateString = '';
    if (showDay === 1) {
        dateString = `${dayNames[date.getDay()]}, ${monthNames[month-1]} ${day.toString().padStart(2, '0')}, ${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (showDay === 2) {
        dateString = `${monthNames[month-1]} ${day.toString().padStart(2, '0')}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        dateString = `${monthNames[month-1]} ${day.toString().padStart(2, '0')}, ${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return dateString;
}

/**
 * Safely gets an element by ID and throws an error if not found
 * @param {string} id - The ID of the element to find
 * @returns {HTMLElement} The found element
 * @throws {Error} If the element is not found
 */
export function getElementByIdSafe(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id "${id}" not found`);
    }
    return element;
}

/**
 * Creates a color-coded HTML string for a day name
 * @param {string} dayName - The name of the day
 * @param {string} color - The color to use for the day name
 * @returns {string} HTML string with color-coded day name
 */
export function colorCodeDay(dayName, color) {
    // For Darksday in dark mode, add a light background
    if (dayName === 'Darksday' && document.body.classList.contains('dark-theme')) {
        return `<span style="color: ${color}; background-color: rgba(145, 177, 142, 0.83); padding: 2px 4px; border-radius: 2px;">${dayName}</span>`;
    }
    return `<span style="color: ${color}">${dayName}</span>`;
}