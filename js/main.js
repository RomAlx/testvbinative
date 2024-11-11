/**
 * Главный модуль приложения
 */
class UserDataTable {
    /**
     * Инициализация приложения
     */
    constructor() {
        this.originalData = [];
        this.sortDirection = 'asc';
        this.searchTimeout = null;

        // Инициализация обработчиков событий
        this.initializeEventListeners();

        // Загрузка начальных данных
        this.loadData();
    }

    /**
     * Инициализация обработчиков событий
     */
    initializeEventListeners() {
        // Обработчик сортировки
        document.getElementById('countHeader').addEventListener('click', () => {
            this.handleSort();
        });

        // Обработчик поиска
        document.getElementById('searchInput').addEventListener('input', (event) => {
            this.handleSearch(event);
        });
    }

    /**
     * Загрузка данных с сервера
     * @param {string} searchTerm - Строка поиска
     */
    async loadData(searchTerm = '') {
        try {
            this.showLoadingState();

            const url = this.buildUrl(searchTerm);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.error) {
                this.showError(data.error);
                return;
            }

            this.originalData = data;
            this.renderTable(data);
        } catch (error) {
            this.showError('Ошибка загрузки данных');
            console.error('Error:', error);
        }
    }

    /**
     * Формирование URL для запроса
     * @param {string} searchTerm - Строка поиска
     * @returns {string} URL для запроса
     */
    buildUrl(searchTerm) {
        return searchTerm
            ? `/api/data.php?search=${encodeURIComponent(searchTerm)}`
            : '/api/data.php';
    }

    /**
     * Отображение состояния загрузки
     */
    showLoadingState() {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center loading-state">
                    <i class="bi bi-arrow-repeat spinner-border text-dark"></i>
                    <p class="mt-2 mb-0">Загрузка ...</p>
                </td>
            </tr>
        `;
    }

    /**
     * Отображение ошибки
     * @param {string} message - Сообщение об ошибке
     */
    showError(message) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center error-state">
                    ${message}
                </td>
            </tr>
        `;
    }

    /**
     * Отрисовка таблицы
     * @param {Array} data - Массив данных для отображения
     */
    renderTable(data) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            this.showEmptyState();
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>
                    ${item.first_name}
                </td>
                <td class="text-end">${item.count}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    /**
     * Отображение пустого состояния
     */
    showEmptyState() {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center empty-state">
                    Нет результатов
                </td>
            </tr>
        `;
    }

    /**
     * Обработка сортировки
     */
    handleSort() {
        const header = document.getElementById('countHeader');
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

        header.className = 'sort-icon ' + this.sortDirection;

        const sortedData = [...this.originalData].sort((a, b) => {
            return this.sortDirection === 'asc'
                ? a.count - b.count
                : b.count - a.count;
        });

        this.renderTable(sortedData);
    }

    /**
     * Обработка поиска
     * @param {Event} event - Событие ввода
     */
    handleSearch(event) {
        const searchTerm = event.target.value.trim();

        clearTimeout(this.searchTimeout);

        if (searchTerm.length < 3) {
            this.loadData();
            return;
        }

        this.searchTimeout = setTimeout(() => {
            if (searchTerm.length >= 3) {
                this.loadData(searchTerm);
            }
        }, 300);
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new UserDataTable();
});