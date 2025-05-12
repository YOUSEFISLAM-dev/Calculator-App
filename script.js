// Calculator functionality
document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        previousValue: '',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
        
        updateDisplay() {
            const currentOperandElement = document.getElementById('current-operand');
            const previousOperandElement = document.getElementById('previous-operand');
            
            // Format the display for large numbers and decimal precision
            let displayVal = this.displayValue;
            if (displayVal.length > 12) {
                const num = parseFloat(displayVal);
                if (!isNaN(num)) {
                    displayVal = num.toExponential(6);
                }
            }
            
            currentOperandElement.textContent = displayVal;
            
            // Build the previous operand string based on calculator state
            if (this.operator != null) {
                previousOperandElement.textContent = 
                    `${this.firstOperand !== null ? this.firstOperand : ''} ${this.operator}`;
            } else {
                previousOperandElement.textContent = '';
            }
        },
        
        inputDigit(digit) {
            const { displayValue, waitingForSecondOperand } = this;
            
            if (waitingForSecondOperand === true) {
                this.displayValue = digit;
                this.waitingForSecondOperand = false;
            } else {
                // Overwrite '0' if it's the only digit
                this.displayValue = displayValue === '0' ? digit : displayValue + digit;
            }
        },
        
        inputDecimal(dot) {
            // If waiting for second operand, start with '0.'
            if (this.waitingForSecondOperand === true) {
                this.displayValue = '0.';
                this.waitingForSecondOperand = false;
                return;
            }
            
            // Don't allow more than one decimal point
            if (!this.displayValue.includes(dot)) {
                this.displayValue += dot;
            }
        },
        
        handleOperator(nextOperator) {
            const { firstOperand, displayValue, operator } = this;
            const inputValue = parseFloat(displayValue);
            
            // If there's already an operator and we're waiting for second operand,
            // just update the operator
            if (operator && this.waitingForSecondOperand) {
                this.operator = nextOperator;
                return;
            }
            
            // If this is the first operand, save it
            if (firstOperand === null && !isNaN(inputValue)) {
                this.firstOperand = inputValue;
            } else if (operator) {
                // If we already have a firstOperand and operator, perform calculation
                const result = this.performCalculation(operator, inputValue);
                
                // Handle floating point precision
                this.displayValue = `${parseFloat(result.toFixed(7))}`;
                this.firstOperand = result;
            }
            
            this.waitingForSecondOperand = true;
            this.operator = nextOperator;
        },
        
        performCalculation(operator, secondOperand) {
            if (operator === '+') {
                return this.firstOperand + secondOperand;
            } else if (operator === '−') {
                return this.firstOperand - secondOperand;
            } else if (operator === '×') {
                return this.firstOperand * secondOperand;
            } else if (operator === '÷') {
                if (secondOperand === 0) {
                    alert('Cannot divide by zero');
                    this.clear();
                    return 0;
                }
                return this.firstOperand / secondOperand;
            } else if (operator === '%') {
                return this.firstOperand * (secondOperand / 100);
            }
            
            return secondOperand;
        },
        
        clear() {
            this.displayValue = '0';
            this.firstOperand = null;
            this.waitingForSecondOperand = false;
            this.operator = null;
            this.previousValue = '';
        },
        
        delete() {
            if (this.waitingForSecondOperand) return;
            
            this.displayValue = this.displayValue.toString().slice(0, -1);
            if (this.displayValue === '' || this.displayValue === '-') {
                this.displayValue = '0';
            }
        },
        
        handlePercent() {
            const currentValue = parseFloat(this.displayValue);
            
            if (isNaN(currentValue)) return;
            
            this.displayValue = (currentValue / 100).toString();
        }
    };
    
    // Add event listeners for all calculator buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            // Check if it's a number button
            if (button.hasAttribute('data-number')) {
                calculator.inputDigit(button.getAttribute('data-number'));
                calculator.updateDisplay();
                return;
            }
            
            // Check if it's an operation button
            if (button.hasAttribute('data-action')) {
                const action = button.getAttribute('data-action');
                
                switch (action) {
                    case 'add':
                        calculator.handleOperator('+');
                        break;
                    case 'subtract':
                        calculator.handleOperator('−');
                        break;
                    case 'multiply':
                        calculator.handleOperator('×');
                        break;
                    case 'divide':
                        calculator.handleOperator('÷');
                        break;
                    case 'percent':
                        calculator.handlePercent();
                        break;
                    case 'calculate':
                        if (calculator.firstOperand !== null && calculator.operator !== null) {
                            const secondOperand = parseFloat(calculator.displayValue);
                            const result = calculator.performCalculation(calculator.operator, secondOperand);
                            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
                            calculator.firstOperand = result;
                            calculator.operator = null;
                            calculator.waitingForSecondOperand = true;
                        }
                        break;
                    case 'clear':
                        calculator.clear();
                        break;
                    case 'delete':
                        calculator.delete();
                        break;
                }
                
                calculator.updateDisplay();
            }
        });
    });
    
    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Numbers
        if (/^[0-9]$/.test(key)) {
            event.preventDefault();
            calculator.inputDigit(key);
            calculator.updateDisplay();
        }
        
        // Decimal
        if (key === '.') {
            event.preventDefault();
            calculator.inputDecimal(key);
            calculator.updateDisplay();
        }
        
        // Operators
        if (key === '+') {
            event.preventDefault();
            calculator.handleOperator('+');
            calculator.updateDisplay();
        }
        
        if (key === '-') {
            event.preventDefault();
            calculator.handleOperator('−');
            calculator.updateDisplay();
        }
        
        if (key === '*') {
            event.preventDefault();
            calculator.handleOperator('×');
            calculator.updateDisplay();
        }
        
        if (key === '/') {
            event.preventDefault();
            calculator.handleOperator('÷');
            calculator.updateDisplay();
        }
        
        // Equal / Enter
        if (key === '=' || key === 'Enter') {
            event.preventDefault();
            if (calculator.firstOperand !== null && calculator.operator !== null) {
                const secondOperand = parseFloat(calculator.displayValue);
                const result = calculator.performCalculation(calculator.operator, secondOperand);
                calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
                calculator.firstOperand = result;
                calculator.operator = null;
                calculator.waitingForSecondOperand = true;
            }
            calculator.updateDisplay();
        }
        
        // Backspace
        if (key === 'Backspace') {
            event.preventDefault();
            calculator.delete();
            calculator.updateDisplay();
        }
        
        // Clear
        if (key === 'Escape' || key === 'Delete') {
            event.preventDefault();
            calculator.clear();
            calculator.updateDisplay();
        }
    });
    
    // Initialize display
    calculator.updateDisplay();
});
