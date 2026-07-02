import axios from "axios";


export async function predictCreditScore(text, block, last, first, action) {
  const res = await axios.post("https://credit-score-prediction-ochw.onrender.com/predict", {
    tx_count: text,
    unique_blocks: block,
    action: action,
    last_tx: last,
    first_tx: first,
  });
  return res.data; // Axios response body
}

