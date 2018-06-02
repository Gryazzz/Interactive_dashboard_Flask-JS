from flask import Flask, render_template, redirect
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


engine = create_engine("sqlite:///Data/belly_button_biodiversity.sqlite")
Base = automap_base()

dash = Flask(__name__)

@dash.route('/')
def home():

    return

@dash.route('/names')
def get_names():
    from functions import find_col_names
    names = find_col_names(engine, 'samples')
    del names[:1]

    return names
