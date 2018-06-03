#List of sample names
def find_col_names(eng, table_name):
    from sqlalchemy import inspect
    inspector = inspect(eng)
    tables = {}
    
    for table in inspector.get_table_names():
        columns = inspector.get_columns(table)
        names = []
        for c in columns:
            names.append(c['name'])
            tables[table] = names
    
    column_names = tables[table_name]        
    del column_names[:1] #del first name(index)
    
    return column_names

#Sample metadata
def metasample(eng, sample):
    from sqlalchemy import inspect
    inspector = inspect(eng)

    form_sample = int(sample[3:])
    
    keys = ['AGE', 'BBTYPE', 'ETHNICITY', 'GENDER', 'LOCATION', 'SAMPLEID']
    values = [f for s in eng.execute(f'SELECT * FROM samples_metadata where SAMPLEID = {form_sample}').\
          fetchall() for f in s]
    
    sample_dict = {}
    cols = inspector.get_columns('samples_metadata')
    for x in range(len(cols)):
        if cols[x]['name'] in keys:
            sample_dict[cols[x]['name']] = values[x]
    return sample_dict