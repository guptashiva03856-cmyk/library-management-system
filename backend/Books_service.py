import requests 
import json

BASE_URL = "http://localhost:8000/Books"

def get_all_books():
    response = requests.get(BASE_URL)
    return response.json() 
def get_book_by_id(book_id):
    response = requests.get(f"{BASE_URL}/{book_id}")
    return response.json()
def add_new_book(book_data):
    headers = {'Content-Type': 'application/json'}
    response = requests.post(BASE_URL, data=json.dumps(book_data), headers=headers)
    return response.json()
def update_book(book_id, book_data):
    headers = {'Content-Type': 'application/json'}
    response = requests.put(f"{BASE_URL}/{book_id}", data=json.dumps(book_data), headers=headers)
    return response.json()
def delete_book(book_id):
    response = requests.delete(f"{BASE_URL}/{book_id}")
    return response.json()
