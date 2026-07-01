import axios from "axios";


export async function predictCreditScore(text, block, last, first, action) {
  const res = await axios.post("http://127.0.0.1:5000/predict", {
    tx_count: text,
    unique_blocks: block,
    action: action,
    last_tx: last,
    first_tx: first,
  });
  return res.data; // Axios response body
}

