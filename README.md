# FFXI Time Information and Scheduling Tool

This project provides a web-based tool for Final Fantasy XI players to track various in-game time-based events and schedules.

FFXI Timer

Copied and updated from http://www.pyogenes.com/ffxi/timer/v2.html

For use you probably want -> https://italicninja.github.io/timer/


## Features

- Vanadiel time conversion
- Moon phase tracking
- Transportation schedules (ferry and airship)
- Crafting guild schedules
- Dark mode toggle

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ffxi-timer.git
   cd ffxi-timer
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

Open the `index.html` file in a web browser to use the application.

### Running Tests

To run the test suite:

```
npm test
```

To run tests with coverage:

```
npm run test:coverage
```

## Development

This project uses ES6 modules. The main application logic is divided into several modules:

- `VanadielTime.js`: Handles Vanadiel time calculations and display
- `TransportSchedule.js`: Manages transportation schedules
- `MoonPhase.js`: Calculates and displays moon phases
- `main.js`: Coordinates all modules and initializes the application

Utility functions are located in `utils.js`, and configuration constants are in `config.js`.

### Adding New Features

1. Create a new module in the `js/` directory if necessary.
2. Update `main.js` to incorporate the new module.
3. Add corresponding test file in `js/__tests__/` directory.
4. Update `index.html` if new UI elements are required.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Original concept by Pyogenes
- Updated by Itallicninja (Kitiara on HorizonXI)
