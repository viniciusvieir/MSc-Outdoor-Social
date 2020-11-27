import os, glob, json
import ItemCollaborative as model
import ItemContentSimilarity as similar
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, render_template, session, request, jsonify

load_dotenv(dotenv_path = Path('.env'))

app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

#Upload endpoint
@app.route('/<user_id>/', methods=['GET'])
def upload(user_id):
    output = model.get_recommendation(int(user_id))
    return jsonify(output)

if __name__ == '__main__':
    app.run(port=os.getenv('PORT'), debug=True)