from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb+srv://shakeabhi403:PF7AzgxuIbu06vC9@cluster0.wzqqh9a.mongodb.net/')
db = client['Expesify']
expenses = db['expenses']

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    expense_list = list(expenses.find())
    # Convert ObjectId to string for JSON serialization
    for expense in expense_list:
        expense['_id'] = str(expense['_id'])
    return jsonify(expense_list)

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    expense = request.json
    expense['created_at'] = datetime.utcnow()
    result = expenses.insert_one(expense)
    expense['_id'] = str(result.inserted_id)
    return jsonify(expense), 201

@app.route('/api/expenses/<id>', methods=['PUT'])
def update_expense(id):
    expense = request.json
    result = expenses.update_one(
        {'_id': ObjectId(id)},
        {'$set': {
            'title': expense['title'],
            'amount': expense['amount'],
            'date': expense['date'],
            'category': expense['category'],
            'updated_at': datetime.utcnow()
        }}
    )
    if result.modified_count:
        expense['_id'] = id
        return jsonify(expense)
    return 'Expense not found', 404

@app.route('/api/expenses/<id>', methods=['DELETE'])
def delete_expense(id):
    result = expenses.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return '', 204
    return 'Expense not found', 404

@app.route('/api/expenses/stats', methods=['GET'])
def get_stats():
    pipeline = [
        {
            '$group': {
                '_id': None,
                'total': {'$sum': '$amount'},
                'average': {'$avg': '$amount'},
                'count': {'$sum': 1}
            }
        }
    ]
    stats = list(expenses.aggregate(pipeline))
    if stats:
        stats = stats[0]
        stats.pop('_id')
        return jsonify(stats)
    return jsonify({'total': 0, 'average': 0, 'count': 0})

@app.route('/api/expenses/by-category', methods=['GET'])
def get_by_category():
    pipeline = [
        {
            '$group': {
                '_id': '$category',
                'total': {'$sum': '$amount'},
                'count': {'$sum': 1}
            }
        }
    ]
    categories = list(expenses.aggregate(pipeline))
    return jsonify(categories)

if __name__ == '__main__':
    app.run()