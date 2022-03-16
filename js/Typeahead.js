export default class Typeahead {
    constructor(element, data) {
        this.element = element;
        this.data = data.sort();
        this.filteredData = data;
        this.currentFocus = -1;

        this.element.innerHTML = `
            <input class="typeahead__input" id="input">
            <div class="typeahead__options hidden" id="options"></div>
        `;

        this.updateOptions();

        const inputElement = this.element.querySelector('#input');
        inputElement.addEventListener('input', this.onInputChange.bind(this));
        inputElement.addEventListener('focus', this.onInputFocus.bind(this));
        inputElement.addEventListener('keydown', this.onInputKeydown.bind(this));

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
        this.filteredData = this.data;
        this.updateInputValue('');
    }

    onInputKeydown(e) {
        const options = this.element.querySelectorAll('.typeahead__option-item');
        if (e.keyCode === 40) {
            this.currentFocus++;
            this.updateFocusOption(options);
        } else if (e.keyCode === 38) {
            this.currentFocus--;
            this.updateFocusOption(options);
        } else if (e.keyCode === 13) {
            if (this.currentFocus === -1) {
                this.updateInputValue('');
                this.toggleOptionsVisibility(true);
                return;
            }
            this.removeFocus(options);
            this.updateInputValue(options[this.currentFocus].getAttribute('data-value'));
            this.currentFocus = -1;
            this.toggleOptionsVisibility(false);
        } else if (e.keyCode === 27) {
            this.toggleOptionsVisibility(false)
        }
    }

    updateFocusOption(options) {
        this.removeFocus(options);

        if (this.currentFocus < 0) return;
        if (this.currentFocus >= options.length) this.currentFocus = 0;

        options[this.currentFocus].classList.add('active');
    }

    removeFocus(options) {
        (options || []).forEach(option => option.classList.remove('active'));
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