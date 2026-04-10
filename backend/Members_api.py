from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import Members_service as msrv

app = FastAPI()

# <<< ADDED: CORS middleware >>>
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # dev only; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Members API"}

@app.get("/members/")
def read_members():
    return msrv.get_all_members()

@app.get("/members/{member_id}")
def read_member(member_id: str):
    return msrv.get_member_by_id(member_id)

@app.post("/members/")
def create_member(member_data: dict):
    return msrv.add_new_member(member_data)

@app.put("/members/{member_id}")
def update_member(member_id: str, member_data: dict):
    return msrv.update_member(member_id, member_data)

@app.delete("/members/{member_id}")
def delete_member(member_id: str):
    return msrv.delete_member(member_id)
