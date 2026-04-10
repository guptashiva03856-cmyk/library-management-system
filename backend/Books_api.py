from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import Books_service as bs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],              # for dev use; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Books API"} 

@app.get("/books/")
def read_books():
    return bs.get_all_books()   

@app.get("/books/{book_id}")
def read_book(book_id: str):
    return bs.get_book_by_id(book_id)

@app.post("/books/")
def create_book(book_data: dict):
    return bs.add_new_book(book_data)

@app.put("/books/{book_id}")
def update_book(book_id: str, book_data: dict):
    return bs.update_book(book_id, book_data)

@app.delete("/books/{book_id}")
def delete_book(book_id: str):
    return bs.delete_book(book_id)
