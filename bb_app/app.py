from flask import Flask, render_template, redirect, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from flask_sqlalchemy import SQLAlchemy
import os
import time

file_path = os.path.abspath(os.getcwd()) + "/bb_app/db/belly_button_biodiversity.sqlite"

# engine = create_engine("sqlite:///db/belly_button_biodiversity.sqlite") or create_engine(os.environ.get('DATABASE_URL', ''))
# engine = create_engine('sqlite:///'+ file_path) or os.environ.get('DATABASE_URL', '') #for flask
# print(engine)

app = Flask(__name__)


# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/belly_button_biodiversity.sqlite"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + file_path or os.environ.get('DATABASE_URL', '')
print('app.config is set')

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
    # from functions import find_col_names # for local hosting only
    from bb_app.functions import find_col_names # for flask app
    names = find_col_names(db.engine, 'samples')

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
    # from functions import metasample # for local hosting only
    from bb_app.functions import metasample # for flask app
    metaData = metasample(db.engine, sample)

    return jsonify(metaData)


@app.route('/wfreq/<sample>')
def washing_frequency(sample):

    # from functions import find_col_names # for local hosting only
    from bb_app.functions import find_col_names

    if sample in find_col_names(db.engine, 'samples'):
        form_sample = int(sample[3:])
        frequency = int(db.session.query(Samples_metadata.WFREQ).\
        filter(Samples_metadata.SAMPLEID == form_sample).all()[0][0])

        return jsonify(frequency)

    else:
        return f'There is no sample named {sample} in our dataset'

@app.route('/samples/<sample>')
def otu_value(sample):
    # from functions import find_col_names # for local hosting only
    from bb_app.functions import find_col_names

    if sample in find_col_names(db.engine, 'samples'):
        fetch = db.engine.execute(f'select "{sample}", otu_id from samples where "{sample}" > 0 order by "{sample}" desc' ).fetchall()
        val, ids = zip(*fetch)
        values_otu = [dict(otu_ids=list(ids), sample_values=list(val))]

        return jsonify(values_otu)
    
    else:
        return f'There is no sample named {sample} in our dataset'


# check if data can be entered to db (terrible code)
@app.route("/enter", methods=["GET", "POST"])
def enter():
    if request.method == "POST":

        SAMPLEID = int(request.form['SAMPLEID'])
        EVENT = request.form['EVENT']
        ETHNICITY = request.form['ETHNICITY']
        GENDER = request.form['GENDER']
        AGE = int(request.form['AGE'])
        WFREQ = int(request.form['WFREQ'])
        BBTYPE = request.form['BBTYPE']
        LOCATION = request.form['LOCATION']
        COUNTRY012 = request.form['COUNTRY012']
        ZIP012 = int(request.form['ZIP012'])
        COUNTRY1319 = request.form['COUNTRY1319']
        ZIP1319 = int(request.form['ZIP1319'])
        DOG = request.form['DOG']
        CAT = request.form['CAT']
        IMPSURFACE013 = int(request.form['IMPSURFACE013'])
        NPP013 = int(float(request.form['NPP013']))
        MMAXTEMP013 = int(float(request.form['MMAXTEMP013']))
        PFC013 = int(float(request.form['PFC013']))
        IMPSURFACE1319 = int(request.form['IMPSURFACE1319'])
        NPP1319 = int(float(request.form['NPP1319']))
        MMAXTEMP1319 = int(float(request.form['MMAXTEMP1319']))
        PFC1319 = int(float(request.form['PFC1319']))


        sample_data = Samples_metadata(SAMPLEID=SAMPLEID, EVENT=EVENT, ETHNICITY=ETHNICITY, GENDER=GENDER,\
        AGE=AGE, WFREQ=WFREQ, BBTYPE=BBTYPE, LOCATION=LOCATION, COUNTRY012=COUNTRY012, ZIP012=ZIP012,\
        COUNTRY1319=COUNTRY1319, ZIP1319=ZIP1319, DOG=DOG, CAT=CAT, IMPSURFACE013=IMPSURFACE013, NPP013=NPP013,\
        MMAXTEMP013=MMAXTEMP013, PFC013=PFC013, IMPSURFACE1319=IMPSURFACE1319, NPP1319=NPP1319, MMAXTEMP1319=MMAXTEMP1319, PFC1319=PFC1319)

        db.session.add(sample_data)

        # time.sleep(5)

        db.session.commit()

        return redirect('/', code=302) 

    return render_template("form.html")


if __name__ == "__main__":
    # app.jinja_env.auto_reload = True
    # app.config['TEMPLATES_AUTO_RELOAD'] = True
    # app.run(debug=True)
    app.run()