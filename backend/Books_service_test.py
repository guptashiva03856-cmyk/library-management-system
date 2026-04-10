import Books_service as bs
print("all_books:",bs.get_all_books())
print("book_by_id:",bs.get_book_by_id("B007"))
new_book = {
        "Title": "level up your life",
      "Author": "john doe",
      "Year": 1940,
      "Genre": "Self-help",
      "id": "B007"
}
print("add_new_book:",bs.add_new_book(new_book))
updated_book = {
        "Title": "level- Updated",
        "Author": " doe",
        "Year": 1950,
        "Genre": "Seeelf-help",
        "id": "B015"
}
print("update_book:",bs.update_book("B015", updated_book)) 
print("delete_book:",bs.delete_book("B007"))

