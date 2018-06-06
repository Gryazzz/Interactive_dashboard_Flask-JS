from flask import Flask, render_template, redirect, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from flask_sqlalchemy import SQLAlchemy

engine = create_engine("sqlite:///Data/belly_button_biodiversity.sqlite")

app = Flask(__name__)

def before_request():
    app.jinja_env.cache = {}

app.before_request(before_request)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///Data/belly_button_biodiversity.sqlite"
db = SQLAlchemy(app)

db.metadata.bind = db.engine
db.metadata.reflect(db.engine)

Base = automap_base(metadata=db.metadata)
Base.prepare()

Samples_metadata = Base.classes.samples_metadata
Samples = Base.classes.samples
Otu = Base.classes.otu



@app.route("/")
def home():
    return render_template("index.html")


@app.route('/names')
def get_names():
    from functions import find_col_names
    names = find_col_names(engine, 'samples')

    return jsonify(names)


@app.route('/otu')
def get_otu():

    bact_tuples = db.session.query(Otu.lowest_taxonomic_unit_found).all()
    bacteries = []
    for b_tuple in bact_tuples:
        for bact in b_tuple:
            bacteries.append(bact)
    #bacteries = [bact for b_tuple in bact_tuples for bact in b_tuple]

    return jsonify(bacteries)


@app.route('/metadata/<sample>')
def metaData_sample(sample):
    from functions import metasample
    metaData = metasample(engine, sample)

    return jsonify(metaData)


@app.route('/wfreq/<sample>')
def washing_frequency(sample):

    from functions import find_col_names

    if sample in find_col_names(engine, 'samples'):
        form_sample = int(sample[3:])
        frequency = int(db.session.query(Samples_metadata.WFREQ).\
        filter(Samples_metadata.SAMPLEID == form_sample).all()[0][0])

        return jsonify(frequency)

    else:
        return f'There is no sample named {sample} in our dataset'

@app.route('/samples/<sample>')
def otu_value(sample):
    from functions import find_col_names

    if sample in find_col_names(engine, 'samples'):
        fetch = engine.execute(f'select "{sample}", otu_id from samples where "{sample}" > 0 order by "{sample}" desc' ).fetchall()
        val, ids = zip(*fetch)
        values_otu = [dict(otu_ids=list(ids), sample_values=list(val))]

        return jsonify(values_otu)
    
    else:
        return f'There is no sample named {sample} in our dataset'


if __name__ == "__main__":
    # app.jinja_env.auto_reload = True
    # app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True)