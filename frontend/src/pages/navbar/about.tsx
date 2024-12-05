import Navbar from "./Navbar";

export default function About() {
  return (
    <>
      <Navbar />
    <div className="container mx-auto p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-green-500 mb-6">
          About FinanceApp
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
          FinanceApp is your ultimate tool for taking control of your finances.
          Our app enables you to seamlessly track your income, monitor
          expenses, and achieve your financial goals. With powerful analytics
          and an easy-to-use interface, we empower you to make informed
          decisions and build a secure financial future.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
          Whether you want to save for a dream vacation, plan your monthly
          budget, or understand your spending habits, FinanceApp is here to
          guide you every step of the way. Join our growing community and start
          your journey to financial wellness today!
        </p>
      </div>
      <div className="mt-12 text-center">
        <img
          src=""
          alt="About Us Graphic"
          className="rounded-lg shadow-lg mx-auto"
          />
      </div>
    </div>
          </>
  );
}
