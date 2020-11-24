from json import dumps
from flask import Flask, render_template, session, request, jsonify
import os, glob
import json

import json
import main as main
app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))



#Upload endpoint
@app.route('/<value>/', methods=['GET','POST'])
def upload(value):
    output = main.itemCollaborative(int(value))
    return json.dumps(output)



if __name__ == '__main__':

    app.run(port=3000, debug=True) 