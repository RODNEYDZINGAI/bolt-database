'use client'

import { useState } from 'react'

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')

  const handleNumber = (number: string) => {
    if (display === '0') {
      setDisplay(number)
    } else {
      setDisplay(display + number)
    }
  }

  const handleOperator = (operator: string) => {
    setEquation(display + ' ' + operator + ' ')
    setDisplay('0')
  }

  const calculate = () => {
    const finalEquation = equation + display
    try {
      const result = eval(finalEquation)
      setDisplay(result.toString())
      setEquation('')
    } catch (error) {
      setDisplay('Error')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Basic Calculator</h2>
      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4">
        <div className="text-right text-sm text-gray-600 dark:text-gray-300">{equation}</div>
        <div className="text-right text-2xl text-gray-900 dark:text-white">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '=') calculate()
              else if (['+', '-', '*', '/'].includes(btn)) handleOperator(btn)
              else handleNumber(btn)
            }}
            className="p-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  )
}
