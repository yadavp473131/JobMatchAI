from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client['mydatabase']
collection = db['mycollection']

@app.route('/', methods=['GET'])
def hello_flask_learner():
    return "Hello Flask Learner"

@app.route('/api/data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {'_id': 0}))  # Convert MongoDB cursor to a list
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def add_data():
    new_data = request.json
    collection.insert_one(new_data)
    print(collection)
    return jsonify({"message": "Data added successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
