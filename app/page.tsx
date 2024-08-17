"use client";

import { useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recognizedData, setRecognizedData] = useState("");
  const [isLoginSubmitted, setIsLoginSubmitted] = useState(false);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isContactsModalVisible, setIsContactsModalVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (emailRegex.test(value)) {
      setRecognizedData("Email recognized: " + value);
      setIsModalVisible(true);
    } else if (phoneRegex.test(value)) {
      setRecognizedData("Phone number recognized: " + value);
      setIsModalVisible(true);
    } else if (value.trim().length > 0) {
      setRecognizedData("Name recognized: " + value);
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginSubmitted(true);
  };

  const handleViewContactsClick = () => {
    setIsContactsModalVisible(true);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data as string[][]);
        },
        header: true,
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-beige">
      {/* Top Header */}
      <header className="w-full py-6 bg-gray-800 text-white text-center text-3xl font-bold shadow-lg">
        Personal CRM
      </header>

      {/* Main Content Area */}
      <div className="flex w-full max-w-4xl mt-12 bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 p-6 bg-gray-100 border-r border-gray-300">
          <nav>
            <ul>
              <li
                className="text-lg font-semibold mb-4 text-gray-700 hover:text-gray-900 cursor-pointer"
                onClick={handleViewContactsClick}
              >
                View Contacts
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Form Section */}
        <section className="w-3/4 p-10">
          {!isLoginSubmitted && (
            <div className="mb-8 w-full bg-gray-50 p-6 rounded-lg shadow-md">
              <form className="flex flex-col items-center" onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-transform transform hover:-translate-y-1"
                >
                  Login
                </button>
              </form>
            </div>
          )}

          {/* Contact Information Form */}
          <form className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md">
            <label htmlFor="crm-input" className="mb-4 text-xl font-medium text-gray-700">
              Enter Contact Information
            </label>
            <input
              id="crm-input"
              type="text"
              placeholder="Type here..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-transform transform hover:-translate-y-1"
            >
              Submit
            </button>
          </form>

          {/* Modal Section */}
          {isModalVisible && (
            <div className="mt-6 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-lg w-full">
              <p className="text-lg text-gray-700">{recognizedData}</p>
            </div>
          )}
        </section>
      </div>

      {/* Contacts Modal */}
      {isContactsModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-2xl font-semibold mb-4 text-black">Contacts</h2>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="mb-4"
            />
            <div className="overflow-auto max-h-64">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    {csvData.length > 0 &&
                      Object.keys(csvData[0]).map((header, index) => (
                        <th
                          key={index}
                          className="text-left px-4 py-2 border-b"
                        >
                          {header}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td
                          key={colIndex}
                          className="text-left px-4 py-2 border-b"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setIsContactsModalVisible(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
