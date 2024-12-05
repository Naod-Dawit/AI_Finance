import Navbar from "../pages/navbar/Navbar";

export default function About() {
    return (
        <>
        <Navbar/>
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">About Us</h1>
        <p className="text-lg text-gray-600">
          FinanceApp helps you track your income and expenses efficiently, ensuring you stay on top of your financial goals.
        </p>
      </div>
        </>
    );
  }
  