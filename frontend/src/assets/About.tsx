import Navbar from "../pages/navbar/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        <div className="container mx-auto p-8">
          <div className="bg-gradient-to-b from-gray-800 to-gray-700 p-10 rounded-lg shadow-2xl">
            <h1 className="text-4xl font-bold text-green-400 mb-6 text-center">
              About Us
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              FinanceApp is designed to empower individuals and businesses by 
              offering tools to track income and expenses seamlessly. Our platform 
              aims to simplify financial management, enabling you to stay in control 
              of your finances and achieve your monetary goals.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Our mission is to provide users with insightful analytics and effortless 
              tools for managing daily, monthly, and yearly expenses. We believe that 
              financial clarity is the cornerstone of success, and our app is tailored 
              to meet the needs of diverse users, whether you’re budgeting for personal 
              savings or managing complex business finances.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Join our growing community and let FinanceApp help you make smarter 
              financial decisions. Together, we can pave the way toward a brighter, 
              more secure financial future.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
