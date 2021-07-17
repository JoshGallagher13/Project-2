import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
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
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/steam<br/>"
        
    )

@app.route("/api/v1.0/steam")
def steam():
    df=pd.read_sql("SELECT*from steam",conn)
    data = df.values.tolist()
    flask_data=[]
    for result in range(len(data)):
        steam_dic = {}
        steam_dic["Index"] = data[result][0]
        steam_dic["Game"] = data[result][1]
        steam_dic["Players"] =data[result][2]
        steam_dic["Hours"] = data[result][3]
        steam_dic["Percent_Play"] =data[result][4]
        steam_dic["Rank"] =data[result][5]
        steam_dic["Genre"] =data[result][6]
        steam_dic["ESRB_Rating"] =data[result][7]
        steam_dic["Platform"] =data[result][8]
        steam_dic["Publisher"] =data[result][9]
        steam_dic["Developer"] =data[result][10]
        steam_dic["Critic_Score"] =data[result][11]
        steam_dic["User_Score"] =data[result][12]
        steam_dic["Total_Shipped"] =data[result][13]
        steam_dic["Global_Sales"] =data[result][14]
        steam_dic["NA_Sales"] =data[result][15]
        steam_dic["PAL_Sales"] =data[result][16]
        steam_dic["JP_Sales"] =data[result][17]
        steam_dic["Other_Sales"] =data[result][18]
        steam_dic["Year"] =data[result][19]
        flask_data.append(steam_dic)

    return jsonify(flask_data)

if __name__ == '__main__':
    app.run(debug=True)