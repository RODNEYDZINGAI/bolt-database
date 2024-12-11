import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Welcome to StudyCalc</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Calculators Card */}
        <Link href="/dashboard/free/basic-calculator">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free Calculators</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Access our collection of essential calculators including basic arithmetic and percentage calculations.
            </p>
            <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside">
              <li>Basic Calculator</li>
              <li>Percentage Calculator</li>
            </ul>
            <div className="mt-4 text-blue-500 dark:text-blue-400">Get Started →</div>
          </div>
        </Link>

        {/* Premium Calculators Card */}
        <Link href="/dashboard/premium/scientific-calculator">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-white mb-4">Premium Calculators</h2>
              <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-sm font-semibold">
                Premium
              </span>
            </div>
            <p className="text-white/90 mb-4">
              Unlock advanced calculators with premium features for complex calculations and graphing.
            </p>
            <ul className="text-white/90 list-disc list-inside">
              <li>Scientific Calculator</li>
              <li>Graphing Calculator</li>
            </ul>
            <div className="mt-4 text-white">Upgrade Now →</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
