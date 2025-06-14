import { TransportSchedule } from '../TransportSchedule.js';
import { TIME_CONFIG, CALENDAR, TRANSPORT } from '../config.js';

describe('TransportSchedule', () => {
  let transportSchedule;
  let mockElements;
  let mockForm;

  beforeEach(() => {
    // Mock DOM elements
    mockElements = {
      ferry: document.createElement('div'),
      airship: document.createElement('div')
    };

    // Mock form
    mockForm = {
      FerryCount: { value: '3' }
    };

    // Mock getElementById
    document.getElementById = jest.fn((id) => {
      switch (id) {
        case 'ferry':
          return mockElements.ferry;
        case 'Airship':
          return mockElements.airship;
        default:
          return null;
      }
    });

    // Mock document.forms
    document.forms = { Timer: mockForm };

    transportSchedule = new TransportSchedule();
  });

  describe('updateFerrySchedule', () => {
    it('should update ferry element with schedule', () => {
      transportSchedule.updateFerrySchedule();

      expect(mockElements.ferry.innerHTML).toContain('table');
      expect(mockElements.ferry.innerHTML).toContain('Arrives');
      expect(mockElements.ferry.innerHTML).toContain('Departs');
      expect(mockElements.ferry.innerHTML).toContain('ETA');
      expect(mockElements.ferry.innerHTML).toContain('ETD');

      // Check if all Vana'diel days are present
      CALENDAR.VANA_DAYS.forEach(day => {
        expect(mockElements.ferry.innerHTML).toContain(day);
      });
    });

    it('should handle errors gracefully', () => {
      // Simulate error by removing element
      document.getElementById = jest.fn(() => null);

      transportSchedule.updateFerrySchedule();

      expect(console.error).toHaveBeenCalled();
    });

    it('should clear ferry element when FerryCount is 0', () => {
      mockForm.FerryCount.value = '0';
      transportSchedule.updateFerrySchedule();

      expect(mockElements.ferry.innerHTML).toBe('');
    });
  });

  describe('updateAirshipSchedule', () => {
    it('should update airship element with schedule', () => {
      transportSchedule.updateAirshipSchedule();

      expect(mockElements.airship.innerHTML).toContain('table');
      expect(mockElements.airship.innerHTML).toContain('Airship Route');
      expect(mockElements.airship.innerHTML).toContain('Departure Day');
      expect(mockElements.airship.innerHTML).toContain('Arrival');
      expect(mockElements.airship.innerHTML).toContain('Departure');

      // Check if all routes are present
      expect(mockElements.airship.innerHTML).toContain('Jeuno To Bastok');
      expect(mockElements.airship.innerHTML).toContain('Jeuno To Kazham');
      expect(mockElements.airship.innerHTML).toContain('Jeuno To San d\'Oria');
      expect(mockElements.airship.innerHTML).toContain('Jeuno To Windurst');
      expect(mockElements.airship.innerHTML).toContain('Bastok To Jeuno');
      expect(mockElements.airship.innerHTML).toContain('Kazham To Jeuno');
      expect(mockElements.airship.innerHTML).toContain('San d\'Oria To Jeuno');
      expect(mockElements.airship.innerHTML).toContain('Windurst To Jeuno');
    });

    it('should handle errors gracefully', () => {
      // Simulate error by removing element
      document.getElementById = jest.fn(() => null);

      transportSchedule.updateAirshipSchedule();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('calculateNextDeparture', () => {
    it('should calculate correct next departure', () => {
      const elapsed = 1000000; // Some arbitrary elapsed time
      const offset = 50000; // Some arbitrary offset
      const day = 3; // Arbitrary day

      const result = transportSchedule.calculateNextDeparture(elapsed, offset, day);

      expect(result).toEqual({
        nextDeparture: expect.any(Number),
        nextDay: expect.any(Number)
      });

      expect(result.nextDeparture).toBeGreaterThan(elapsed);
      expect(result.nextDay).toBeGreaterThanOrEqual(0);
      expect(result.nextDay).toBeLessThanOrEqual(7);
    });
  });

  describe('updateSchedules', () => {
    it('should update both ferry and airship schedules', () => {
      const spyFerry = jest.spyOn(transportSchedule, 'updateFerrySchedule');
      const spyAirship = jest.spyOn(transportSchedule, 'updateAirshipSchedule');

      transportSchedule.updateSchedules();

      expect(spyFerry).toHaveBeenCalled();
      expect(spyAirship).toHaveBeenCalled();
    });
  });
});