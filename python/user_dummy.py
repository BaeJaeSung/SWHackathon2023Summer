import time
import random
import string
import mysql.connector

# 데이터베이스 연결 설정
connection = mysql.connector.connect(
    host="3.39.72.59",
    user="root2",
    password="root2",
    database="hiki"
)
cursor = connection.cursor()


def generate_random_string(length):
    letters = string.ascii_lowercase + string.ascii_uppercase
    random_string = ''.join(random.choice(letters) for _ in range(length))
    return random_string
    
def generate_random_number(length):
    numbers = string.digits
    random_number = ''.join(random.choice(numbers) for _ in range(length))
    return random_number

def random_choice():
    if random.random() < 0.1:
        return 1
    else:
        return 0

def insert_user():
    for i in range(100):
        user_id = generate_random_string(6) + generate_random_number(4)
        user_pw = user_id
        nickname = user_id
        user_type = random_choice()
        user_age = '35'
        user_query = f"INSERT INTO user(id, pw, nickname, type, age) VALUES ('{user_id}', '{user_pw}', '{nickname}', {user_type}, {user_age})"
        print(i, user_query)
        cursor.execute(user_query)
    connection.commit()
insert_user()