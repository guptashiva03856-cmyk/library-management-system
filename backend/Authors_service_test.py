import Authors_service as ats
print("get all authors:",ats.get_all_authors())
print("get author by id 1:",ats.get_author_by_id("d4f3"))
new_author = {"Name": "kingle",
      "Nationality": "india",
      "Born": 1922,
      "id": "abb8"}
added_author = ats.add_new_author(new_author)
print("added new author:", added_author)
updated_author = { 
        "Name": "George oo Orwell",
        "Nationality": "British",
        "Born": 1903,
        "id": "e6a0"
    },
print("update author id 1:", ats.update_author("e6a0", updated_author))
print("delete author id 1:", ats.delete_author("abb8"))

