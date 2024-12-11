'use client'

import { useState } from 'react'

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0')

  const handleFunction = (fn: string) => {
    try {
      const result = eval(`Math.${fn}(${display})`)
      setDisplay(result.toString())
    } catch (error) {
      setDisplay('Error')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Scientific Calculator</h2>
      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4">
        <div className="text-right text-2xl text-gray-900 dark:text-white">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['sin', 'cos', 'tan', 'sqrt'].map((fn) => (
          <button
            key={fn}
            onClick={() => handleFunction(fn)}
            className="p-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            {fn}
          </button>
        ))}
      </div>
    </div>
  )
}
