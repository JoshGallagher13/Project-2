import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template
from configfile import db_user, db_password, db_host, db_port, db_name

#################################################
# Database Setup
#################################################
### SYNTAX to connect to a database using SQLAlchemy
# dialect://username:password@databasehost:port/databasename
###
# configure the connection string
rds_connection_string = f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
# confirm the connection string
print(rds_connection_string)
# connect to the database
engine = create_engine(rds_connection_string)
conn = engine.connect()



#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return render_template('analysis.html')

@app.route("/api/steam")
def steam():
    
    steam_df = pd.read_sql("SELECT * FROM steam", conn)
    steam_json = steam_df.to_json(orient='records')
    
    return steam_json

@app.route("/api/game_player_summary")
def game_player_summary():
    
    query = '''
        SELECT 
            year,
            genre,
            game,
            SUM(players) AS players_sum,
            SUM(hours) AS hours_sum,
            critic_score,
            user_score,
            rank
        FROM 
            steam
        GROUP BY
            year,
            genre,
            game
        ORDER BY
            year,
            genre,
            game
    '''

    steam_df = pd.read_sql(query, conn)
    steam_json = steam_df.to_json(orient='records')
    
    return steam_json

@app.route("/api/get_genres")
def get_genres():
    
    query = '''
        SELECT 
            genre,
            COUNT(*) as record_count
        FROM 
            steam
        GROUP BY
            genre
        ORDER BY
            genre
    '''

    steam_df = pd.read_sql(query, conn)
    steam_json = steam_df.to_json(orient='records')
    
    return steam_json

if __name__ == '__main__':
    app.run(debug=True)