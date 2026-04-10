import Members_service as ms
print("All members:", ms.get_all_members())
print("Member with ID M001:", ms.get_member_by_id("c4b5"))
new_member = {
             "name": "nirwant singh",
                "member_id": "M004",
                "join_date": "2023-04-15",          
                "id": "f41f"

        }
added_member = ms.add_new_member(new_member)
print("Added member:", added_member)
updated_member = {
            "name": "nirmala devi",     
            "member_id": "M003",
            "join_date": "2023-03-10",          
            "id": "dc95"
        }
print("deleted_memberd:",ms.delete_member("c4b5"))

