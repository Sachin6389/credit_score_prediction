import React, { useState } from "react";
import { predictCreditScore } from "./prediction";
import { predictCreditScorefile } from "./Fileprediction";

function App() {
  const [text, setText] = useState("");
  const [block, setBlock] = useState("");
  const [dateFirst, setDateFirst] = useState("");
  const [dateLast, setDateLast] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState(null);
  const [resultfile, setResultfile] = useState(null);
  const [filepath, setfilepath] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await predictCreditScore(
      text,
      block,
      dateFirst,
      dateLast,
      action
    );
    setResult(res);
  };

  const handleSubmitfile = async (e) => {
    e.preventDefault();
    await handleFileUpload();
  };

  const handleFileUpload = async () => {
    const text = await filepath.text();
    const jsonData = JSON.parse(text);
    console.log(jsonData);

    const res = await predictCreditScorefile(jsonData);
    setResultfile(res);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Parameter Prediction Card */}
        <div className="w-full bg-white shadow-xl rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            Predict Credit Score using Parameters
          </h1>

          <p className="text-sm sm:text-base text-gray-500 text-center mb-6 sm:mb-8">
            Fill in the details below to get an estimated credit score.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Number of Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Text
              </label>
              <input
                type="number"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
              />
            </div>

            {/* Unique Block Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unique Block Count
              </label>
              <input
                type="number"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
              />
            </div>

            {/* First Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Date
              </label>
              <input
                type="datetime-local"
                step="1"
                value={dateFirst}
                onChange={(e) => setDateFirst(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
              />
            </div>

            {/* Last Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Date
              </label>
              <input
                type="datetime-local"
                step="1"
                value={dateLast}
                onChange={(e) => setDateLast(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
              />
            </div>

            {/* Type of Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Action
              </label>
              <input
                type="text"
                placeholder="deposit, borrow, repay, liquidationcall..."
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate actions with commas.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 text-sm sm:text-base"
            >
              Predict
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border overflow-auto">
              <h2 className="font-semibold text-lg mb-3 text-gray-800">
                Prediction Result
              </h2>

              {Object.entries(result).map(([key, value]) => (
                <p key={key} className="mb-2 break-words">
                  <span className="font-semibold capitalize">{key}: </span>
                  {value}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* JSON File Prediction Card */}
        <div className="w-full bg-white shadow-xl rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            Predict Credit Score using JSON File
          </h1>

          <p className="text-sm sm:text-base text-gray-500 text-center mb-6 sm:mb-8">
            JSON file should contain fields such as:
            <br />
            <span className="font-medium">
              userWallet, txHash, timestamp, blockNumber, action
            </span>
          </p>

          <form onSubmit={handleSubmitfile} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload JSON File
              </label>

              <input
                type="file"
                accept=".json"
                onChange={(e) => setfilepath(e.target.files[0])}
                required
                className="w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 text-sm sm:text-base"
            >
              Predict
            </button>
          </form>

          {Array.isArray(resultfile) && resultfile.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                User Predictions
              </h2>

              <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {resultfile.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded-lg shadow-sm bg-gray-50"
                  >
                    {Object.entries(item).map(([key, value]) => (
                      <p
                        key={key}
                        className="text-sm sm:text-base mb-1 break-words"
                      >
                        <span className="font-semibold capitalize">
                          {key.replaceAll("_", " ")}:
                        </span>{" "}
                        {String(value)}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;