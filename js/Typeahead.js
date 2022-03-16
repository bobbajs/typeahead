export default class Typeahead {
    constructor(element, data) {
        this.element = element;
        this.data = data.sort();
        this.filteredData = data;

        this.element.innerHTML = `
            <input class="typeahead__input" id="input">
            <div class="typeahead__options hidden" id="options"></div>
        `;

        this.updateOptions();

        const inputElement = this.element.querySelector('#input');
        inputElement.addEventListener('input', this.onInputChange.bind(this));
        inputElement.addEventListener('focus', this.onInputFocus.bind(this));

        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    updateOptions() {
        let optionsHtml = `<ul>`

        for (let option of this.filteredData) {
            optionsHtml += `<li class="typeahead__option-item" data-value="${option}">${option}</li>`
        }

        optionsHtml += `</ul>`

        this.element.querySelector('#options').innerHTML = optionsHtml;
        this.element.querySelectorAll('.typeahead__option-item').forEach(item => {
            item.addEventListener('click', this.onSelectOption.bind(this));
        })
    }

    onInputChange(e) {
        const value = e.target.value;

        this.filteredData = this.data.filter(option => option.includes(value));
        this.updateOptions();
    }

    onInputFocus() {
        this.toggleOptionsVisibility(true);
        this.updateInputValue('');
    }

    updateInputValue(newValue) {
        this.element.querySelector('#input').value = newValue;
    }

    toggleOptionsVisibility(isVisible) {
        const options = this.element.querySelector('#options');

        if (isVisible) {
            options.classList.remove('hidden');
        } else {
            options.classList.add('hidden');
        }
    }

    onSelectOption(e) {
        const selectedOption = e.target.getAttribute('data-value');

        this.updateInputValue(this.filteredData.find(item => item === selectedOption));
        this.toggleOptionsVisibility(false);
    }

    handleOutsideClick(e) {
        const noCloseClass = [
            'typeahead__options', 'typeahead__option-item', 'typeahead__input'
        ];

        if (!noCloseClass.includes(e.target.className)) {
            this.toggleOptionsVisibility(false);
        }
    }





}