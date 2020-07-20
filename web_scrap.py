import psycopg2

import re
import requests
from bs4 import BeautifulSoup


# connect to the db
connection = psycopg2.connect(
                         host = "ec2-54-246-85-151.eu-west-1.compute.amazonaws.com",
                         database ="d104oreqrestf1",
                         port = "5432",
                         user ="tuqurqnlmabgfb",
                         password = "f22e3198e9b9a293bfbdef4877290eb420dc2ced9133d1ce303b375f0989a398")

# cursor
cur = connection.cursor()

# execute query
# cur.execute("select recipe from recipes")
# cur.execute ("select id, username from users")

# rows = cur.fetchall()

# for row in rows:
# print(f"id{row[0]} username{row[1]}")

# #close the cursor
# cur.close()

# close
# connection.close()

domain = 'https://www.jamieoliver.com'
vgm_url = '{}/recipes/vegetables-recipes/'.format(domain)
html_text = requests.get(vgm_url).text
soup = BeautifulSoup(html_text, 'html.parser')
mydivs = soup.findAll("div", {"class": "recipe-block"})

cur = connection.cursor()

for idx, div in enumerate(mydivs):
    a = div.find("a", {"id": re.compile("gtm_recipe_subcat")})
    link = "https://www.jamieoliver.com" + a['href']
    print(link)
    html_text = requests.get(link).text
    soup = BeautifulSoup(html_text, 'html.parser')
    div_ing = soup.find("div", {"class": "recipe-ingredients"})
    lis = div_ing.findAll("li")
    ing = ''
    ingredients = []
    for li in lis:
        ingredients.append(" ".join(li.get_text().split()))
    ing = ", ".join(ingredients)
    print(ing)

    title = soup.select("div.single-recipe-details > h1.hidden-xs")[0].get_text()
    print(title.strip())

    time = div.find("span", {"class": "time"})
    difficulty = div.find("span", {"class": "difficulty"})
    if time != None: print(time.text.strip())
    if difficulty != None: print(difficulty.text.strip())

    recipe_steps = soup.select(".recipeSteps > li")
    method = []
    for idx, step in enumerate(recipe_steps):
        method.append("{}. {}".format(idx + 1, step.get_text()))
    method = " ".join(method)

    url_picture = soup.select("div.hero-wrapper > picture > img")[0]
    url_picture = 'http:'+ url_picture.get('src','')
    print(url_picture)

# allow to get out of script
#     import sys
#     sys.exit(0)


    if len(method) > 0:
        cur.execute(""" INSERT INTO recipes (title , method, url_pictures) VALUES (%s , %s , %s)""",
                    (title, method, url_picture))

        for ingredient in ingredients:
            results = cur.execute ("select count(*) from  ingredients where ing_name = %s", (ingredient,))
            # if len(results) == 0 :
            if results is None:
                cur.execute(""" INSERT INTO ingredients (ing_name) VALUES (%s )""",
                    (ingredient, ))

    if idx % 10 == 0:
        connection.commit()
        cur.close()
        cur = connection.cursor()

count = cur.rowcount
print (count, "Record inserted successfully into mobile table")

#close the cursor
cur.close()

# close
connection.close()









