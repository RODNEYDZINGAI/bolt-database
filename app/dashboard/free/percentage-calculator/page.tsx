'use client'

import { useState } from 'react'

export default function PercentageCalculator() {
  const [value, setValue] = useState('')
  const [percentage, setPercentage] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const calculatePercentage = () => {
    const val = parseFloat(value)
    const perc = parseFloat(percentage)
    if (!isNaN(val) && !isNaN(perc)) {
      setResult((val * perc) / 100)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Percentage Calculator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Percentage</label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <button
          onClick={calculatePercentage}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Calculate
        </button>
        {result !== null && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-gray-900 dark:text-white">Result: {result}</p>
          </div>
        )}
      </div>
    </div>
  )
}
