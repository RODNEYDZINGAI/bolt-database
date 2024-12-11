'use client'

import { useEffect, useRef } from 'react'

export default function GraphingCalculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw coordinate system
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.strokeStyle = '#666'
    
    // X-axis
    ctx.beginPath()
    ctx.moveTo(-canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, 0)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(0, -canvas.height / 2)
    ctx.lineTo(0, canvas.height / 2)
    ctx.stroke()

    // Plot simple function y = x^2
    ctx.strokeStyle = '#ff0000'
    ctx.beginPath()
    for (let x = -10; x <= 10; x += 0.1) {
      const y = x * x
      ctx.lineTo(x * 20, -y * 10)
    }
    ctx.stroke()
  }, [])

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Graphing Calculator</h2>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full border border-gray-300 dark:border-gray-600"
      />
    </div>
  )
}
