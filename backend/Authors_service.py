import requests
import json
Base_URL = "http://localhost:8000/Authors"
def get_all_authors():
    response = requests.get(Base_URL)
    response.raise_for_status()
    return response.json()
def get_author_by_id(author_id):
    respone = requests.get(f"{Base_URL}/{author_id}")
    respone.raise_for_status()
    return respone.json()
def add_new_author(author_data):
    headers = {'Content-Type': 'application/json'}
    response = requests.post(Base_URL, data=json.dumps(author_data), headers=headers)
    response.raise_for_status()
    return response.json()
def update_author(author_id, author_data):
    headers = {'Content-Type': 'application/json'}
    response = requests.put(f"{Base_URL}/{author_id}", data=json.dumps(author_data), headers=headers)
    response.raise_for_status()
    return response.json()
def delete_author(id):
    response = requests.delete(f"{Base_URL}/{id}")
    if response.status_code == 200 or response.status_code == 204:
        return "Author deleted successfully" 
    else:
        return f"Failed to delete. Status: {response.status_code}"