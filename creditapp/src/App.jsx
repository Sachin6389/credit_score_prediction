import React, { useState,useEffect } from "react";
import { predictCreditScore } from "./prediction"; // your function
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
  

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await predictCreditScore(text, block, dateFirst, dateLast, action);
    setResult(res);
  };
  const handleSubmitfile = async (e) => {
    e.preventDefault();
    await handleFileUpload(filepath);
  };
  const handleFileUpload = async (event) => {
    const text = await filepath.text();
    const jsonData = JSON.parse(text);
    console.log(jsonData);
    const res = await predictCreditScorefile(jsonData);

    setResultfile(res);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Predict Credit Score using parametar
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Fill in the details below to get an estimated credit score.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Type of Action */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Action
            </label>
            <input
              type="text"
              placeholder="e.g., deposit, borrow, repay, liquidationcall, redeemunderlying."
              value={action}
              onChange={(e) => setAction(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate actions with commas.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
          >
            Predict
          </button>
        </form>

        {/* Result Display */}
        
        {result && (
          <div>
            {Object.entries(result).map(([key, value]) => (
              <p key={key}>
                <span className="font-semibold">{key}: </span> {value}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Predict Credit Score using json file
        </h1>
        <p className="text-gray-500 text-center mb-8">
          json file should have these features like:-"userWallet","txHash","timestamp","blockNumber","action" , etc.
    
        </p>
        <form onSubmit={handleSubmitfile} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File as json formate
            </label>
            <input
              type="file"
              onChange={(e) => setfilepath(e.target.files[0])}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
          >
            Predict
          </button>
        </form>
        {Array.isArray(resultfile) && resultfile.length > 0 && (
          <div className="mt-8 text-left">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              User Predictions:
            </h2>
            <ul className="space-y-4">
              {resultfile.map((item, index) => (
                <li key={index} className="p-4 border rounded-lg shadow">
                  {Object.entries(item).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold capitalize">
                        {key.replace("_", " ")}:
                      </span>{" "}
                      {value}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
