from flask import Flask, jsonify, Blueprint
from app.models import fetch_a_user
from app.extensions import mongo

profilefetch = Blueprint('profilefetch', __name__)

@profilefetch.route("/user/api/session/<key>", methods=["GET"])
def get_user_profile(key):
    
    user = mongo.db.users.find_one({'session_key': key})
    # print(user)
    if user:
        user_data = {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "user_type": user["user_type"],
            "session_key": user["session_key"]
        }
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "User not found"}), 404
    
   