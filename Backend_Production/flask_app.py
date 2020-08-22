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
import json

# This part tells Heroku to deploy the static files in the 'build' folder at the root URI. This is where the Angular files are.
app = Flask(__name__, static_folder='./static', static_url_path='/')

CORS(app, resources={r"*": {"origins": "*"}})

# Set secret key.
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)

# This tells Heroku to render the index.html file of the built Angular app at the root of the Flask API
@app.route('/')
def root():
    return render_template('index.html')

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
        username = client_request['register_username']  
        client_pw = client_request['register_pw']
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
        cursor.close()
        # Return success message to client
        return jsonify(success_object), 200
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)

    
    

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


# Search Ingredient endpoint
@app.route('/seasonal_recipes/api/v1.0/ingredientsearch/<vegetable>', methods=['GET'])
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
    cursor.execute("SELECT * from recipes_new WHERE title LIKE '%" + vegetable + "%'")    
    recipes_list = []  
    data = cursor.fetchall()


    for row in data:
        recipe_id = row[0]
        title = row[2]
        ingredients = row[3]
        method = row[1]
        image_url = row[4]
        recipe = {
        'recipe_id': recipe_id,
        'vegetable': vegetable,
        'title': title,
        'ingredients': ingredients,
        'method': method,
        'image_url': image_url
        }
        recipes_list.append(recipe)
    

    # Update Searchitem table in db
    cursor.execute("SELECT * from searchitems WHERE title LIKE '%" + vegetable + "%'")
    found = cursor.fetchone()
    print(found)

    if not found:
        postgres_insert_query = """ INSERT INTO searchitems (title, count) VALUES (%s,%s)"""
        record_to_insert = (vegetable, 1)
        cursor.execute(postgres_insert_query, record_to_insert)

    else:
        cursor.execute("UPDATE searchitems SET count = count + 1 WHERE title LIKE '%" + vegetable + "%' ")

    connection.commit()

    return jsonify(recipes_list), 200




# Get recipes with veg that is in season for requested month   
@app.route('/seasonal_recipes/api/v1.0/<month>', methods=['GET'])
def get_in_season(month):
    
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

    recipes_list = []

    if month == "January":
        # search for all the recipes containing veg in season in Jan
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()

        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)

        
    elif month == "February":
        # search for all the recipes containing veg in season in Feb
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()

        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)

        
    elif month == "March":
        # search for all the recipes containing veg in season in March
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "April":
        # search for all the recipes containing veg in season in April
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "May":
        # search for all the recipes containing veg in season in May
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "June":
        # search for all the recipes containing veg in season in June
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "July":
        # search for all the recipes containing veg in season in July
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "August":
        # search for all the recipes containing veg in season in August
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "September":
        # search for all the recipes containing veg in season in September
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "October":
        # search for all the recipes containing veg in season in October
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "November":
        # search for all the recipes containing veg in season in November
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    elif month == "December":
        # search for all the recipes containing veg in season in December
        cursor.execute("SELECT * from recipes_new WHERE title LIKE '%%broccoli%%' OR title Like '%%cabbage%%' OR title Like '%%kale%%' OR title Like '%%celeriac%%' OR title Like '%%beetroot%%' OR title Like '%%mushroom%%' OR title Like '%%parsnip%%' OR title Like '%%leek%%' OR title Like '%%cauliflower%%' OR title Like '%%carrot%%' OR title Like '%%celery%%' OR title Like '%%pak choi%%' OR title Like '%%turnip%%' OR title Like '%%potato%%'")
        data = cursor.fetchall()
        for row in data:
            recipe_id = row[0]
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
            
            'recipe_id': recipe_id,
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    else:
        recipes_list = ["invalid month"]

    return jsonify(recipes_list), 200


# Get favorites for report
@app.route('/seasonal_recipes/api/v1.0/favorites', methods=['GET'])
def get_popularsearchitems():
    connection = psycopg2.connect(
        user="tuqurqnlmabgfb",
        password="f22e3198e9b9a293bfbdef4877290eb420dc2ced9133d1ce303b375f0989a398",
        host="ec2-54-246-85-151.eu-west-1.compute.amazonaws.com",
        port="5432",
        database="d104oreqrestf1",
        sslmode="require"
    )

    # Get favorites data
    cursor = connection.cursor()
    # Get favorites by grouping and totalling entries in the favorites table
    cursor.execute("SELECT recipe_id, COUNT(*) FROM favourites GROUP BY recipe_id LIMIT 5")
    favourites_list = []
    data = cursor.fetchall()
    print(data)

    for row in data:
        cursor = connection.cursor()
        cursor.execute("SELECT title FROM recipes_new WHERE recipe_id=%s", (row[0],))
        title = cursor.fetchone()
        count = row[1]
        #ingredients = row[2]
        #method = row[3]
        favorite = {
            'title': title,
            'count': count
            #'ingredients': ingredients,
            #'method': method
        }
        favourites_list.append(favorite)

    return jsonify(favourites_list), 200


# get data re most searched for items
@app.route('/seasonal_recipes/api/v1.0/searchitems', methods=['GET'])
def get_mostsearched():
    connection = psycopg2.connect(
        user="tuqurqnlmabgfb",
        password="f22e3198e9b9a293bfbdef4877290eb420dc2ced9133d1ce303b375f0989a398",
        host="ec2-54-246-85-151.eu-west-1.compute.amazonaws.com",
        port="5432",
        database="d104oreqrestf1",
        sslmode="require"
    )

    # Get popular search data
    cursor = connection.cursor()
    # Get favorites by grouping and totalling entries in the favorites table
    cursor.execute("SELECT title, count FROM searchitems")
    labels = []
    data = []
    results = cursor.fetchall()
    print(results)

    for row in results:
        ingredient = row[0]
        count = row[1]
        labels.append(ingredient)
        data.append(count)

    print(labels)
    print(data)

    return jsonify({'data': data, 'labels': labels}), 200

# Add favourite endpoint
@app.route('/seasonal_recipes/api/v1.0/add_favourite', methods=['POST'])

def user_favourites():
    
    # Connect to db
    connection = psycopg2.connect(
        user = "tuqurqnlmabgfb",
        password = "f22e3198e9b9a293bfbdef4877290eb420dc2ced9133d1ce303b375f0989a398",
        host = "ec2-54-246-85-151.eu-west-1.compute.amazonaws.com",
        port = "5432",
        database = "d104oreqrestf1",
        sslmode="require"
    )
        
     
    client_request = request.get_json()
    username = client_request['username']
    print(username)
    recipe_id = client_request['recipe_id']
    print(recipe_id)  
    # Insert new user favourite into the user_favourites table        
    cursor = connection.cursor()
    cursor.execute("INSERT INTO user_favourites(user_id, recipe_id) VALUES(%s, %s)", (username, recipe_id,))
    # Insert record of favourite action into favourites table for reporting
    cursor.execute("INSERT INTO favourites(recipe_id) VALUES(%s)", (recipe_id,))
    # Commit change to db   
    connection.commit() 

    success_object = {"favourite": "success"}
    cursor.close()
    # Return success message to client
    return jsonify(success_object), 200

# Get favourites for user endpoint
@app.route('/seasonal_recipes/api/v1.0/recipes/favourites', methods=['POST'])

def get_user_favourites():
    
    # Connect to db
    connection = psycopg2.connect(
        user = "tuqurqnlmabgfb",
        password = "f22e3198e9b9a293bfbdef4877290eb420dc2ced9133d1ce303b375f0989a398",
        host = "ec2-54-246-85-151.eu-west-1.compute.amazonaws.com",
        port = "5432",
        database = "d104oreqrestf1",
        sslmode="require"
    )
        
     
    client_request = request.get_json()
    username = client_request['username']
    
    # Get user favourites from user_favourites table        
    cursor = connection.cursor()
    cursor.execute("SELECT recipe_id FROM user_favourites WHERE user_id=%s", (username,))
    
    favourites = cursor.fetchall()

    recipes_list = []

    for favourite_id in favourites:
        # Get all the recipes in the user's favourites list
        cursor.execute("SELECT * from recipes_new WHERE recipe_id=%s", (favourite_id,))
        data = cursor.fetchall()
        for row in data:
            title = row[2]
            ingredients = row[3]
            method = row[1]
            image_url = row[4]
            recipe = {
                
            'title': title,
            'ingredients': ingredients,
            'method': method,
            'image_url': image_url
            }
            recipes_list.append(recipe)
        
    
    cursor.close()
    
    # Return user's favourite recipes to client
    return jsonify(recipes_list), 200
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)