import { VanadielTime } from '../VanadielTime.js';
import { TIME_CONFIG, CALENDAR } from '../config.js';

describe('VanadielTime', () => {
  let vanadielTime;
  let mockElements;

  beforeEach(() => {
    // Mock DOM elements
    mockElements = {
      vTime: document.createElement('div'),
      eTime: document.createElement('div'),
      details: document.createElement('div')
    };

    // Mock getElementById
    document.getElementById = jest.fn((id) => {
      switch (id) {
        case 'vTime':
          return mockElements.vTime;
        case 'eTime':
          return mockElements.eTime;
        case 'Details':
          return mockElements.details;
        default:
          return null;
      }
    });

    vanadielTime = new VanadielTime();
  });

  describe('calculateVanadielTime', () => {
    it('should calculate correct Vanadiel time components', () => {
      const result = vanadielTime.calculateVanadielTime();

      expect(result).toEqual(expect.objectContaining({
        year: expect.any(Number),
        month: expect.any(Number),
        date: expect.any(Number),
        hour: expect.any(Number),
        minute: expect.any(Number),
        second: expect.any(Number),
        day: expect.any(Number)
      }));

      // Validate ranges
      expect(result.month).toBeGreaterThanOrEqual(1);
      expect(result.month).toBeLessThanOrEqual(12);
      expect(result.date).toBeGreaterThanOrEqual(1);
      expect(result.date).toBeLessThanOrEqual(30);
      expect(result.hour).toBeGreaterThanOrEqual(0);
      expect(result.hour).toBeLessThanOrEqual(23);
      expect(result.minute).toBeGreaterThanOrEqual(0);
      expect(result.minute).toBeLessThanOrEqual(59);
      expect(result.second).toBeGreaterThanOrEqual(0);
      expect(result.second).toBeLessThanOrEqual(59);
      expect(result.day).toBeGreaterThanOrEqual(0);
      expect(result.day).toBeLessThanOrEqual(7);
    });
  });

  describe('formatVanadielTime', () => {
    it('should format time components with leading zeros', () => {
      const mockTime = {
        year: 5,
        month: 3,
        date: 9,
        hour: 2,
        minute: 8,
        second: 5,
        day: 1
      };

      const result = vanadielTime.formatVanadielTime(mockTime);

      expect(result).toEqual({
        year: '0005',
        month: '03',
        date: '09',
        hour: '02',
        minute: '08',
        second: '05',
        day: 1
      });
    });
  });

  describe('updateVanadielTime', () => {
    it('should update vTime element with formatted time', () => {
      vanadielTime.updateVanadielTime();

      expect(mockElements.vTime.innerHTML).toContain(CALENDAR.VANA_DAYS[0]);
      expect(mockElements.vTime.innerHTML).toMatch(/\d{4}-\d{2}-\d{2}/); // Date format
      expect(mockElements.vTime.innerHTML).toMatch(/\d{2}:\d{2}:\d{2}/); // Time format
    });

    it('should handle errors gracefully', () => {
      // Simulate error by removing element
      document.getElementById = jest.fn(() => null);

      vanadielTime.updateVanadielTime();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateEarthTime', () => {
    it('should update eTime element with current Earth time', () => {
      vanadielTime.updateEarthTime();

      expect(mockElements.eTime.innerHTML).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    });

    it('should handle errors gracefully', () => {
      // Simulate error by removing element
      document.getElementById = jest.fn(() => null);

      vanadielTime.updateEarthTime();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('showDayDetails', () => {
    it('should display day details table', () => {
      vanadielTime.showDayDetails(0);

      expect(mockElements.details.innerHTML).toContain('table');
      expect(mockElements.details.innerHTML).toContain('Day');
      expect(mockElements.details.innerHTML).toContain('Weak Element');
      
      // Check if all days are displayed
      CALENDAR.VANA_DAYS.forEach(day => {
        expect(mockElements.details.innerHTML).toContain(day);
      });

      // Check if all elements are displayed
      CALENDAR.WEAK_MAGIC.forEach(element => {
        expect(mockElements.details.innerHTML).toContain(element);
      });
    });
  });

  describe('clearDetails', () => {
    it('should clear details element', () => {
      mockElements.details.innerHTML = 'Test content';
      vanadielTime.clearDetails();
      expect(mockElements.details.innerHTML).toBe('');
    });
  });
});