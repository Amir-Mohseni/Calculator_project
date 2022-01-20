const calculate = (x, operator, y) => {
  const firstNum = parseFloat(x)
  const secondNum = parseFloat(y)
  let num = 0
  let b = 0
  if (operator === 'add')
    num = firstNum + secondNum, b = 1
  if (operator === 'subtract')
    num = firstNum - secondNum, b = 1
  if (operator === 'multiply')
    num = firstNum * secondNum, b = 1
  if (operator === 'divide')
    num = firstNum / secondNum, b = 1
  if(operator === 'mod')
    num = firstNum % secondNum, b = 1
  let text = num.toString();
  if(b === 1) {
    if(text.length > 11) {
      return num.toExponential(5);
    } else {
        return num
    }
  }
}

const getKeyType = key => {
  const { action } = key.dataset
  if (!action)
    return 'number'
  if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide' || action === 'mod')
    return 'operator'
  else
    return action
}

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = state

  if (keyType === 'number') {
    return displayedNum === '0' ||  previousKeyType === 'operator' || previousKeyType === 'calculate' ? keyContent : displayedNum + keyContent
  }

  if (keyType === 'decimal') {
    if (!displayedNum.includes('.'))
      return displayedNum + '.'
    if (previousKeyType === 'operator' || previousKeyType === 'calculate')
      return '0.'
    return displayedNum
  }

  if (keyType === 'operator') {
    return firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate' ? calculate(firstValue, operator, displayedNum)  : displayedNum
  }

  if (keyType === 'clear')
    return 0

  if (keyType === 'calculate') {
    return firstValue ? previousKeyType === 'calculate' ? calculate(displayedNum, operator, modValue) : calculate(firstValue, operator, displayedNum) : displayedNum
  }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = calculator.dataset

  calculator.dataset.previousKeyType = keyType

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate' ? modValue : displayedNum
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = ''
    calculator.dataset.modValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.previousKeyType = ''
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  if (keyType === 'operator')
    key.classList.add('is-depressed')
  if (keyType === 'clear' && key.textContent !== 'AC')
    key.textContent = 'AC'
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    clearButton.textContent = 'CE'
  }
}

const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

keys.addEventListener('click', e => {
  if (!e.target.matches('button'))
    return
  const key = e.target
  const displayedNum = display.textContent
  const resultString = createResultString(key, displayedNum, calculator.dataset)

  display.textContent = resultString
  updateCalculatorState(key, calculator, resultString, displayedNum)
  updateVisualState(key, calculator)
})
  