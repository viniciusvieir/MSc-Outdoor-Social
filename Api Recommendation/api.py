from flask import Flask, render_template, session, request, jsonify
import os, glob
import json

import json
import Item_Collaborative as model
app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

#Upload endpoint
@app.route('/<user_id>/', methods=['GET'])
def upload(user_id):
    output = model.get_recommendation(int(user_id))
    return jsonify(output)


if __name__ == '__main__':
    app.run(port=os.getenv('PORT'), debug=True)