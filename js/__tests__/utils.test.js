import { formatCountdown, formatDate, getElementByIdSafe, colorCodeDay } from '../utils.js';
import { TIME_CONFIG } from '../config.js';

describe('utils', () => {
  describe('formatCountdown', () => {
    it('should format countdown with days', () => {
      const time = 2 * TIME_CONFIG.MS_REAL_DAY + 3 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000;
      const result = formatCountdown(time);
      expect(result).toBe('2:03:45:30');
    });

    it('should format countdown with hours only', () => {
      const time = 3 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000;
      const result = formatCountdown(time);
      expect(result).toBe('3:45:30');
    });

    it('should format countdown with minutes and seconds only', () => {
      const time = 45 * 60 * 1000 + 30 * 1000;
      const result = formatCountdown(time);
      expect(result).toBe('45:30');
    });

    it('should handle zero time', () => {
      const result = formatCountdown(0);
      expect(result).toBe('00:00');
    });

    it('should pad numbers with zeros', () => {
      const time = 1 * TIME_CONFIG.MS_REAL_DAY + 2 * 60 * 60 * 1000 + 5 * 60 * 1000 + 7 * 1000;
      const result = formatCountdown(time);
      expect(result).toBe('1:02:05:07');
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock Date to ensure consistent testing
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-06-13T10:30:45'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format date with full day (showDay=1)', () => {
      const timestamp = Date.now();
      const result = formatDate(timestamp, 1);
      expect(result).toBe('Friday, Jun 13, 2025 10:30:45');
    });

    it('should format date with short format (showDay=2)', () => {
      const timestamp = Date.now();
      const result = formatDate(timestamp, 2);
      expect(result).toBe('Jun 13, 10:30:45');
    });

    it('should format date with default format (no showDay)', () => {
      const timestamp = Date.now();
      const result = formatDate(timestamp, 0);
      expect(result).toBe('Jun 13, 2025 10:30:45');
    });

    it('should pad single-digit numbers', () => {
      const timestamp = new Date('2025-01-05T09:05:07').getTime();
      const result = formatDate(timestamp, 1);
      expect(result).toBe('Sunday, Jan 05, 2025 09:05:07');
    });
  });

  describe('getElementByIdSafe', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="testElement"></div>';
    });

    it('should return element when found', () => {
      const element = getElementByIdSafe('testElement');
      expect(element).toBeTruthy();
      expect(element.id).toBe('testElement');
    });

    it('should throw error when element not found', () => {
      expect(() => getElementByIdSafe('nonexistentElement'))
        .toThrow('Element with id "nonexistentElement" not found');
    });
  });

  describe('colorCodeDay', () => {
    it('should create color-coded HTML span', () => {
      const result = colorCodeDay('TestDay', '#FF0000');
      expect(result).toBe('<span style="color: #FF0000">TestDay</span>');
    });

    it('should escape HTML in day name', () => {
      const result = colorCodeDay('<script>alert("xss")</script>', '#FF0000');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should handle empty values', () => {
      const result = colorCodeDay('', '#FF0000');
      expect(result).toBe('<span style="color: #FF0000"></span>');
    });
  });
});