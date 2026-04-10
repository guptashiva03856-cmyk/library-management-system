import requests
import json
Base_url = "http://localhost:8000/Members"
def get_all_members():
    response = requests.get(Base_url)
    response.raise_for_status()
    return response.json()
def get_member_by_id(member_id):
    response = requests.get(f"{Base_url}/{member_id}")
    response.raise_for_status()
    return response.json()
def add_new_member(member_data):
    response = requests.post(Base_url, json=member_data)
    if response.ok:
        print("Member added successfully")
    else:
        print(f"Failed to add the member: {response.status_code} {response.text}")
    try:
        return response.json()
    except ValueError:
        return None
def update_member(member_id, member_data):
    response = requests.put(f"{Base_url}/{member_id}", json=member_data)
    response.raise_for_status()
    return response.json()
def delete_member(id): 
    response = requests.delete(f"{Base_url}/{id}")
    
    
    if response.status_code == 200 or response.status_code == 204:
        return "Deleted successfully"
    else:
        return f"Failed to delete. Status: {response.status_code}"