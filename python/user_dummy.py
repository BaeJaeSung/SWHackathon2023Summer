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

hiki_ids = [
'mXwRPu7096', 'xrBkSv7632', 'IuAnpN7633', 'mQygLs2184', 'sucdLd8189',
'YcKAvM6164', 'HjEdDi2016', 'psQumw2916', 'tuCuci2445', 'FfaWid6826',
'NUeihx1139', 'DNpSWu3061', 'fsNZZH6367', 'lcKIvI6510', 'FYYEih7007',
'AlWorf8556', 'QaVWbn8299', 'MAHzZg7780'
]

company_ids = [
'didfodms2', 'CiNftk7044', 'jHRAtj3087', 'jqiqjD2622', 'lrSMSv2494',
'irMKwS6286', 'QARgYu5308', 'QSSSHU2027', 'bJYRFz6985', 'nVEIaL4100',
'BvYFYu4101', 'vGaPJm0103', 'MFJvHb8439'
]

univs = ['한국과학기술원', '성균관대학교', '제주대학교', '이화여자대학교', '인하대학교', '고려대학교', '선문대학교', '배재대학교', '충남대학교']
companies = ['삼성카페', '카카오카페', '카카오스타일카페', '구름카페', '클라썸도넛', '네이번', 'azit카페']
periods = ['3일', '1주일', '2주일', '1개월', '3개월', '6-12개월']
regions = ['서울', '대전', '천안', '부산', '대구', '제주', '인천', '경기', '강원', '전라']
datetimes = ['2023-07-01T18:00:00', '2023-07-03T19:00:00', '2023-07-02T15:00:00', '2023-07-04T18:00:00']

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

def insert_hiki_profile():
    for hiki_id in hiki_ids:
        uid = hiki_id
        info = '안녕하세요? ' + hiki_id + '입니다. 잘 부탁 드립니다.'
        study_career = random.choice(univs)
        user_query = f"INSERT INTO youth_profile(uid, info, study_career) VALUES ('{uid}', '{info}', '{study_career}')"
        print(hiki_id, user_query)
        cursor.execute(user_query)
    connection.commit()

def insert_hiki_career():
    for hiki_id in hiki_ids:
        uid = hiki_id
        company_name = random.choice(companies)
        period = random.choice(periods)
        experience = '안녕하세요? ' + uid + '입니다. 저는 ' + company_name + '에서 ' + period + ' 동안 일했습니다.'
        user_query = f"INSERT INTO youth_career(uid, company_name, period, experience) VALUES ('{uid}', '{company_name}', '{period}', '{experience}')"
        print(hiki_id, user_query)
        cursor.execute(user_query)
    connection.commit()

def insert_company_profile():
    for company_id in company_ids:
        uid = company_id
        name = random.choice(companies)
        num1 = generate_random_number(4)
        num2 = generate_random_number(4)
        phone_number = '010-' + num1 + '-' + 'num2'
        intro = '안녕하세요? ' + name + '회사 입니다. 직원을 구합니다.'
        employee_count = generate_random_number(2)
        c_type = '카페'
        representative = name
        
        user_query = f"INSERT INTO company_profile(uid, name, phone_number, intro, employee_count, type, representative) VALUES ('{uid}', '{name}', '{phone_number}', '{intro}', '{employee_count}', '{c_type}', '{representative}')"
        print(company_id, user_query)
        cursor.execute(user_query)
    connection.commit()

def insert_company_employment():
    for company_id in company_ids:
        uid = company_id
        c_type = '카페'
        salary = int(generate_random_number(3)) + 100
        start_time = 9 + random.randrange(2)
        end_time = 18 + random.randrange(2)
        region = random.choice(regions)
        end_date = random.choice(datetimes)
        
        user_query = f"INSERT INTO company_employment(uid, type, salary, start_time, end_time, region, end_date) VALUES ('{uid}', '{c_type}', '{salary}', '{start_time}', '{end_time}', '{region}', '{end_date}')"
        print(company_id, user_query)
        cursor.execute(user_query)
    connection.commit()
#insert_hiki_profile()
insert_company_employment()