# Flask application to retrieve data and to manage user login and registration
from flask import Flask, jsonify
#from flask_jsonpify import jsonify
from flask import abort
from flask import request
import psycopg2
from flask_cors import CORS, cross_origin
from psycopg2 import Error
from sqlalchemy import exc
from psycopg2 import sql
import sys
from flask_jwt import JWT
from flask_jwt_extended import (JWTManager, create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from werkzeug.security import safe_str_cmp
from flask_jwt import current_identity
import base64


app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

# Set secret key.
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)

# Registration endpoint
@app.route('/seasonal_recipes/api/v1.0/register', methods=['POST'])

def register():
    
    # Connect to db
    connection = psycopg2.connect(
        user = "tuqurqnlmabgfb",
        password = "f22e3198e9b9a293bfbdef4877290eb420dc2ced9133d1ce303b375f0989a398",
        host = "ec2-54-246-85-151.eu-west-1.compute.amazonaws.com",
        port = "5432",
        database = "d104oreqrestf1",
        sslmode="require"
    )
        
    try:   
        # Get new username, password and email from client request
        client_request = request.get_json()
        username = client_request['username']  
        client_pw = client_request['password']
        client_email = client_request['email']

        cursor = connection.cursor()

        # 3 SQL commands needed here
        # First, get a salt from Postgres
        cursor.execute("SELECT gen_salt('bf')")       
        db_output = cursor.fetchall()
        salt = db_output[0]

        # Second, encrypt the password with Postgres's 'crypt' function and the salt just created
        cursor.execute("select crypt(%s, %s);", (client_pw, salt))
        db_output = cursor.fetchall()
        client_pw_hash = db_output[0][0]

        # Third, insert the new user into the users table
        cursor.execute("INSERT INTO users(username, password_hash, salt, email) VALUES(%s, %s, %s, %s)", (username, client_pw_hash, salt, client_email,))

        # Commit change to db   
        connection.commit() 

        success_object = {"registration": "success"}

        # Return success message to client
        return jsonify(success_object), 200
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)

    finally:
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is now closed")
    

# Authentication endpoint
@app.route('/seasonal_recipes/api/v1.0/auth', methods=['POST'])

def authent():
    
    connection = psycopg2.connect(
            user = "tuqurqnlmabgfb",
            password = "f22e3198e9b9a293bfbdef4877290eb420dc2ced9133d1ce303b375f0989a398",
            host = "ec2-54-246-85-151.eu-west-1.compute.amazonaws.com",
            port = "5432",
            database = "d104oreqrestf1",
            sslmode="require"
    )
    try:
        print("Got to try in auth")
        client_request = request.get_json()
        username = client_request['username']
        print(username)
        client_pw = client_request['password']
        print(client_pw)
        # Get user data
        cursor = connection.cursor()
        cursor.execute("SELECT * from users WHERE username = %s", (username,))       
        row = cursor.fetchall()
        print(row)
        
        # Create variable with hash for user that is stored in db        
        db_hash = row[0][2] 
        
        # Create new hash using pw from client and salt from db
        db_salt = row[0][3] 
        
        cursor.execute("select crypt(%s, %s);", (client_pw, db_salt))  
        db_output = cursor.fetchall()
        client_data_hash = db_output[0][0]
        
        if db_hash == client_data_hash:
            
            access_token = create_access_token(identity = username)
            refresh_token = create_refresh_token(identity = username)
            return jsonify({
            'message':'login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            }), 200
        
        else:
            return jsonify({"user_info":"invalid",   
        }), 401
                
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)

    finally:
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is now closed")

# Get recipes endpoint
@app.route('/seasonal_recipes/api/v1.0/<vegetable>', methods=['GET'])

def get_recipes(vegetable):
    
    connection = psycopg2.connect(
            user = "tuqurqnlmabgfb",
            password = "f22e3198e9b9a293bfbdef4877290eb420dc2ced9133d1ce303b375f0989a398",
            host = "ec2-54-246-85-151.eu-west-1.compute.amazonaws.com",
            port = "5432",
            database = "d104oreqrestf1",
            sslmode="require"
    )
        
    # Get recipe data
    cursor = connection.cursor()
    # Get recipes where the title contains the vegetable name from the request
    cursor.execute("SELECT * from test_recipe_data WHERE title LIKE '%" + vegetable + "%'")    
    recipes_list = []  
    data = cursor.fetchall()

    for row in data:
        title = row[1]
        ingredients = row[2]
        method = row[3]
        recipe = {
        'vegetable': vegetable,
        'title': title,
        'ingredients': ingredients,
        'method': method,
        'image_url': ''
        }
        recipes_list.append(recipe)

    for recipe in recipes_list:
        cursor.execute("SELECT url_pictures FROM recipes WHERE title=%s", (recipe['title'],))
        recipe['image_url'] = cursor.fetchall()
    

    return jsonify(recipes_list), 200

       
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)