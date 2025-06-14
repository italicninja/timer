import { TimerApp } from '../main.js';
import { VanadielTime } from '../VanadielTime.js';
import { TransportSchedule } from '../TransportSchedule.js';
import { MoonPhase } from '../MoonPhase.js';

jest.mock('../VanadielTime.js');
jest.mock('../TransportSchedule.js');
jest.mock('../MoonPhase.js');

describe('TimerApp', () => {
  let timerApp;
  let mockStorage;

  beforeEach(() => {
    // Mock localStorage
    mockStorage = {};
    global.localStorage = {
      getItem: jest.fn(key => mockStorage[key]),
      setItem: jest.fn((key, value) => { mockStorage[key] = value; })
    };

    // Mock DOM elements
    document.body.innerHTML = `
      <input type="checkbox" id="darklighttoggle">
      <form name="Timer">
        <select name="testSelect"></select>
      </form>
      <a id="clearDetails" href="#"></a>
      <div class="header"></div>
    `;

    timerApp = new TimerApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize modules and event listeners', () => {
      expect(timerApp.modules.vanadielTime).toBeInstanceOf(VanadielTime);
      expect(timerApp.modules.transportSchedule).toBeInstanceOf(TransportSchedule);
      expect(timerApp.modules.moonPhase).toBeInstanceOf(MoonPhase);
      
      expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });
  });

  describe('initDarkModeToggle', () => {
    it('should initialize dark mode toggle', () => {
      const toggle = document.getElementById('darklighttoggle');
      
      // Test initial state
      timerApp.initDarkModeToggle();
      expect(toggle.checked).toBe(false);
      expect(document.body.classList.contains('dark')).toBe(false);

      // Test toggle
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));
      expect(document.body.classList.contains('dark')).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    });

    it('should restore dark mode preference', () => {
      mockStorage.darkMode = 'true';
      timerApp.initDarkModeToggle();
      expect(document.getElementById('darklighttoggle').checked).toBe(true);
      expect(document.body.classList.contains('dark')).toBe(true);
    });
  });

  describe('initFormListeners', () => {
    it('should add change listeners to all select elements', () => {
      const select = document.querySelector('select');
      const spy = jest.spyOn(timerApp, 'updateAll');

      timerApp.initFormListeners();
      select.dispatchEvent(new Event('change'));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('initDetailsListener', () => {
    it('should clear Details element when clearDetails is clicked', () => {
      const clearLink = document.getElementById('clearDetails');
      const detailsElement = document.createElement('div');
      detailsElement.id = 'Details';
      detailsElement.textContent = 'Test content';
      document.body.appendChild(detailsElement);

      timerApp.initDetailsListener();
      clearLink.click();

      expect(detailsElement.innerHTML).toBe('');
    });
  });

  describe('updateAll', () => {
    it('should update all modules', () => {
      timerApp.updateAll();

      expect(timerApp.modules.vanadielTime.updateVanadielTime).toHaveBeenCalled();
      expect(timerApp.modules.vanadielTime.updateEarthTime).toHaveBeenCalled();
      expect(timerApp.modules.moonPhase.updateAll).toHaveBeenCalled();
      expect(timerApp.modules.transportSchedule.updateSchedules).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      timerApp.modules.vanadielTime.updateVanadielTime.mockImplementation(() => { throw error; });

      timerApp.updateAll();

      expect(consoleSpy).toHaveBeenCalledWith('Error updating modules:', error);
    });
  });

  describe('handleError', () => {
    it('should log error and display error message', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      timerApp.handleError(error);

      expect(consoleSpy).toHaveBeenCalledWith('Application error:', error);
      expect(document.querySelector('.error-message')).not.toBeNull();
    });

    it('should remove error message after 5 seconds', () => {
      jest.useFakeTimers();
      timerApp.handleError(new Error('Test error'));
      
      expect(document.querySelector('.error-message')).not.toBeNull();
      
      jest.advanceTimersByTime(5000);
      
      expect(document.querySelector('.error-message')).toBeNull();
      
      jest.useRealTimers();
    });
  });
});