import axios from "axios";

export async function predictCreditScorefile(file) {
  const res = await axios.post("https://credit-score-prediction-ochw.onrender.com/predict_api",file, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data; // Axios response body
}