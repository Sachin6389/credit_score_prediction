import axios from "axios";

export async function predictCreditScorefile(file) {
  const res = await axios.post("http://127.0.0.1:5000/predict_api",file, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data; // Axios response body
}