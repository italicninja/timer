export class CardManager {
    constructor() {
        this.containers = document.querySelectorAll('.cards-container');
        this.cards = document.querySelectorAll('.card');
        this.draggedCard = null;
        this.positions = this.loadPositions();

        this.initializeCards();
        this.applyPositions();
        this.setupEventListeners();
    }

    initializeCards() {
        // Initialize cards with their IDs if not already in storage
        this.cards.forEach(card => {
            const cardId = card.dataset.cardId;
            // Add container IDs if not present
            const container = card.closest('.cards-container');
            if (!container.id) {
                container.id = `container-${Array.from(this.containers).indexOf(container)}`;
            }
            if (!this.positions[cardId]) {
                const container = card.closest('.cards-container');
                const containerIndex = Array.from(this.containers).indexOf(container);
                const cardIndex = Array.from(container.children).indexOf(card);
                this.positions[cardId] = {
                    containerId: containerIndex,
                    order: cardIndex
                };
            }
        });
        this.savePositions();
    }

    loadPositions() {
        const savedPositions = localStorage.getItem('cardPositions');
        return savedPositions ? JSON.parse(savedPositions) : {};
    }

    savePositions() {
        localStorage.setItem('cardPositions', JSON.stringify(this.positions));
    }

    applyPositions() {
        this.containers.forEach((container, containerIndex) => {
            const containerCards = Array.from(this.cards).filter(card => {
                const position = this.positions[card.dataset.cardId];
                return position && position.containerId === containerIndex;
            });

            containerCards.sort((a, b) => {
                return this.positions[a.dataset.cardId].order - this.positions[b.dataset.cardId].order;
            });

            containerCards.forEach(card => container.appendChild(card));
        });
    }

    updatePositions() {
        this.containers.forEach((container, containerIndex) => {
            Array.from(container.children).forEach((card, cardIndex) => {
                if (card.classList.contains('card')) {
                    this.positions[card.dataset.cardId] = {
                        containerId: containerIndex,
                        order: cardIndex
                    };
                }
            });
        });
        this.savePositions();
    }

    setupEventListeners() {
        this.cards.forEach(card => {
            const handle = card.querySelector('.drag-handle');

            // Make cards draggable by default
            card.setAttribute('draggable', 'true');

            // Handle drag start
            handle.addEventListener('mousedown', () => {
                this.containers.forEach(container => container.classList.add('drag-active'));
            });

            // Handle drag end and mouse up
            const endDrag = () => {
                this.containers.forEach(container => container.classList.remove('drag-active'));
            };

            document.addEventListener('mouseup', endDrag);
            card.addEventListener('dragend', endDrag);

            card.addEventListener('dragstart', (e) => {
                if (!e.target.closest('.drag-handle')) {
                    e.preventDefault();
                    return;
                }

                card.classList.add('dragging');
                this.draggedCard = card;

                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', ''); // Required for Firefox
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                this.draggedCard = null;
                this.updatePositions();
            });
        });

        this.containers.forEach(container => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                if (!this.draggedCard) return;

                const afterElement = this.getDragAfterElement(container, e.clientY);
                if (afterElement) {
                    container.insertBefore(this.draggedCard, afterElement);
                } else {
                    container.appendChild(this.draggedCard);
                }
            });

            container.addEventListener('drop', (e) => {
                e.preventDefault();
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}