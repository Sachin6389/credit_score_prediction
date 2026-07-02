import json
import joblib
from flask_cors import CORS

from flask import Flask,request,app,jsonify,url_for,render_template
import numpy as np
import pandas as pd

app=Flask(__name__)
CORS(app, origins="*")
## Load the model
model = joblib.load('linear_model.pkl')
scaler = joblib.load('nurmalijation.pkl')
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/predict_api',methods=['POST'])
def predict_api():
    data=request.get_json()
    
    

    datanew = pd.DataFrame([data])
    ##print(np.array(list(data.values())).reshape(1,-1))
    
    ##datas.drop(columns=["_id","actionData","createdAt","updatedAt"],axis=1,inplace=True, errors='ignore')
    datas=datanew[["userWallet","txHash","timestamp","blockNumber","action"]]
    datas=datas.dropna()
    datas=datas.drop_duplicates()
    datas["timestamp"]= pd.to_datetime(datas["timestamp"])
    action_weights = {
    'deposit': 2, 
    'repay': 1, 
    'borrow': -1, 
    'liquidationcall': -5,
    'redeemunderlying':-2
     }
    datas['action_score'] = datas['action'].map(action_weights).fillna(0)
    grouped = datas.groupby('userWallet').agg({
    'txHash': 'count',
    'blockNumber': 'nunique',
    'action_score': 'sum',
    'timestamp': ['min', 'max']
        })
    grouped.columns = ['tx_count', 'unique_blocks', 'total_action_score', 'first_tx', 'last_tx']
    grouped['active_days'] = (grouped['last_tx'] - grouped['first_tx']).dt.days + 1
    grouped[['tx_score', 'activity_score', 'behavior_score']] = scaler.fit_transform(
    grouped[['tx_count', 'active_days', 'total_action_score']]
    )
    grouped['credit_score'] = (
    0.4 * grouped['tx_score'] +
    0.3 * grouped['activity_score'] +
    0.3 * grouped['behavior_score']
    ) * 100
    final_score = grouped[['credit_score']].sort_values(by='credit_score', ascending=False)
    result_json = final_score.reset_index().to_dict(orient='records')
    return jsonify(result_json)

@app.route('/predict',methods=['POST'])
def predict():

    datas = request.get_json()   # <-- JSON from React
    tx_count = datas.get("tx_count")   # safe way
    unique_blocks = datas.get("unique_blocks")
    last_tx = datas.get("last_tx")
    first_tx = datas.get("first_tx")
    action = datas.get("action")

    # Now use these variables to create DataFrame or run model
    data = pd.DataFrame([{
        "tx_count": tx_count,
        "unique_blocks": unique_blocks,
        "last_tx": last_tx,
        "first_tx": first_tx,
        "action": action
    }])

    # Convert columns to appropriate types
    
    data['first_tx'] = pd.to_datetime(data['first_tx'])
    data['last_tx'] = pd.to_datetime(data['last_tx'])

    # Action weights
    action_weights = {
        'deposit': 2, 
        'repay': 1, 
        'borrow': -1, 
        'liquidationcall': -5,
        'redeemunderlying': -2
    }

    data['action_score'] = data['action'].map(action_weights).fillna(0)
    data['total_action_score'] = data['action_score'].sum()

    # Active days
    data['active_days'] = (data['last_tx'] - data['first_tx']).dt.days + 1

    # Drop timestamps
    data.drop(columns=["last_tx", "first_tx","action","action_score"], inplace=True, errors='ignore')
    
    # Scale relevant features
    data[['tx_score', 'activity_score', 'behavior_score']] = scaler.fit_transform(
        data[['tx_count', 'active_days', 'total_action_score']]
    )
    newdata=data.to_numpy()
    

    # Predict
    output = model.predict(newdata)[0]
    return jsonify({'prediction': float(output[0])})

    
 
    





if __name__=="__main__":
    app.run(debug=True)
   
     