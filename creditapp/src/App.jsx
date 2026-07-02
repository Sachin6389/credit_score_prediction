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
    if (!filepath) return;

    try {
      const text = await filepath.text();
      const jsonData = JSON.parse(text);

      console.log(jsonData);

      const res = await predictCreditScorefile(jsonData);
      setResultfile(res);
    } catch (error) {
      console.error("Error reading JSON file:", error);
      alert("Invalid JSON file");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Parameter Prediction */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4">
            Predict Credit Score Using Parameters
          </h1>

          <p className="text-gray-500 text-center mb-8 text-sm sm:text-base">
            Fill in the details below to estimate a credit score.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Text
              </label>
              <input
                type="number"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unique Block Count
              </label>
              <input
                type="number"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Action
              </label>
              <input
                type="text"
                placeholder="deposit, borrow, repay..."
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple actions with commas.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
            >
              Predict
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Prediction Result
              </h2>

              {Object.entries(result).map(([key, value]) => (
                <p key={key} className="py-1 break-words">
                  <span className="font-semibold capitalize">{key}: </span>
                  {String(value)}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* JSON File Prediction */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4">
            Predict Credit Score Using JSON File
          </h1>

          <p className="text-gray-500 text-center mb-8 text-sm sm:text-base">
            Upload a JSON file containing fields like{" "}
            <span className="font-medium">
              userWallet, txHash, timestamp, blockNumber, action
            </span>
            .
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
            >
              Predict From File
            </button>
          </form>

          {Array.isArray(resultfile) && resultfile.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                User Predictions
              </h2>

              <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {resultfile.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded-lg shadow-sm bg-gray-50"
                  >
                    {Object.entries(item).map(([key, value]) => (
                      <p key={key} className="py-1 break-words">
                        <span className="font-semibold capitalize">
                          {key.replace(/_/g, " ")}:
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