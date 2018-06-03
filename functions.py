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

