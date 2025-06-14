import { MoonPhase } from '../MoonPhase.js';
import { TIME_CONFIG, CALENDAR } from '../config.js';

describe('MoonPhase', () => {
  let moonPhase;
  let mockElements;
  let mockForm;

  beforeEach(() => {
    // Mock DOM elements
    mockElements = {
      phase: document.createElement('div'),
      calendar: document.createElement('div'),
      details: document.createElement('div')
    };

    // Mock form
    mockForm = {
      Moon: { value: '3' }
    };

    // Mock getElementById
    document.getElementById = jest.fn((id) => {
      switch (id) {
        case 'mPhase':
          return mockElements.phase;
        case 'mCalendar':
          return mockElements.calendar;
        case 'Details':
          return mockElements.details;
        default:
          return null;
      }
    });

    // Mock document.forms
    document.forms = { Timer: mockForm };

    moonPhase = new MoonPhase();
  });

  describe('calculateMoonPhase', () => {
    it('should calculate correct moon phase', () => {
      const result = moonPhase.calculateMoonPhase();

      expect(result).toEqual({
        phase: expect.any(Number),
        optimalPhase: expect.any(Number),
        toNextPhase: expect.any(Number),
        toOptimalPhase: expect.any(Number),
        percent: expect.any(Number)
      });

      expect(result.phase).toBeGreaterThanOrEqual(0);
      expect(result.phase).toBeLessThanOrEqual(7);
      expect(result.percent).toBeGreaterThanOrEqual(0);
      expect(result.percent).toBeLessThanOrEqual(100);
    });
  });

  describe('updateMoonPhase', () => {
    it('should update phase element with moon phase information', () => {
      moonPhase.updateMoonPhase();

      expect(mockElements.phase.innerHTML).toContain('onmouseover="javascript:getMoonDetails()"');
      expect(mockElements.phase.innerHTML).toContain('Next phase');
      expect(mockElements.phase.innerHTML).toContain('Next');

      // Check if any moon phase name is present
      const anyPhaseName = CALENDAR.PHASE_NAMES.some(name => 
        mockElements.phase.innerHTML.includes(name)
      );
      expect(anyPhaseName).toBe(true);
    });

    it('should handle errors gracefully', () => {
      // Simulate error by removing element
      document.getElementById = jest.fn(() => null);

      moonPhase.updateMoonPhase();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateMoonCalendar', () => {
    it('should update calendar element with moon calendar', () => {
      moonPhase.updateMoonCalendar();

      expect(mockElements.calendar.innerHTML).toContain('table');
      expect(mockElements.calendar.innerHTML).toContain('New Moon Start');
      expect(mockElements.calendar.innerHTML).toContain('New Moon End');
      expect(mockElements.calendar.innerHTML).toContain('Full Moon Start');
      expect(mockElements.calendar.innerHTML).toContain('Full Moon End');
    });

    it('should handle errors gracefully', () => {
      // Simulate error by removing element
      document.getElementById = jest.fn(() => null);

      moonPhase.updateMoonCalendar();

      expect(console.error).toHaveBeenCalled();
    });

    it('should clear calendar element when Moon value is 0', () => {
      mockForm.Moon.value = '0';
      moonPhase.updateMoonCalendar();

      expect(mockElements.calendar.innerHTML).toBe('');
    });
  });

  describe('showMoonDetails', () => {
    it('should update details element with moon information', () => {
      moonPhase.showMoonDetails();

      expect(mockElements.details.innerHTML).toContain('Moon Information');
      expect(mockElements.details.innerHTML).toContain('84 game days');
    });
  });

  describe('updateAll', () => {
    it('should update both moon phase and calendar', () => {
      const spyPhase = jest.spyOn(moonPhase, 'updateMoonPhase');
      const spyCalendar = jest.spyOn(moonPhase, 'updateMoonCalendar');

      moonPhase.updateAll();

      expect(spyPhase).toHaveBeenCalled();
      expect(spyCalendar).toHaveBeenCalled();
    });
  });
});