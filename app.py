from flask import Flask, render_template, redirect, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from flask_sqlalchemy import SQLAlchemy

engine = create_engine("sqlite:///Data/belly_button_biodiversity.sqlite")

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///Data/belly_button_biodiversity.sqlite"
db = SQLAlchemy(app)

db.metadata.bind = db.engine
db.metadata.reflect(db.engine)

base = automap_base(metadata=db.metadata)
base.prepare()

#Pet = base.classes.pets

@app.route("/")
def home():
    return "Welcome!"

@app.route('/names')
def get_names():
    from functions import find_col_names
    names = find_col_names(engine, 'samples')
    del names[:1]

    return jsonify(names)



if __name__ == "__main__":
    app.run()