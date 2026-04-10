from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import Authors_service as asrv

app = FastAPI()

# <<< ADDED: CORS middleware >>>
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Authors API"}
@app.get("/authors/")
def read_authors():
    return asrv.get_all_authors()
@app.get("/authors/{author_id}")
def read_author(author_id: str):
    return asrv.get_author_by_id(author_id)
@app.post("/authors/")
def create_author(author_data: dict):
    return asrv.add_new_author(author_data)
@app.put("/authors/{author_id}")
def update_author(author_id: str, author_data: dict):
    return asrv.update_author(author_id, author_data)
@app.delete("/authors/{author_id}")
def delete_author(author_id: str):
    return asrv.delete_author(author_id)
