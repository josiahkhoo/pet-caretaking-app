# paths
## login
- POST `/register { username, password, contact_number, name, address, is_pcs_admin, is_pet_owner, is_cate_taker }` - `<userObj>`
- GET `/login { username, password }` - `<userObj>`
- <userObj> : { "username": "qwe", 
    "password" : "123", 
    "contact_number" : "123", 
    "name": "Alex", 
    "address" : "nus", 
    "is_pcs_admin" : false, 
    "is_pet_owner" : true,
    "is_care_taker": false 
}

## caretakers
- POST `/caretakers/availability { user_id, start_date, end_date }` - `<availabilityStatus>`
- GET `/caretakers/earnings { start_date, end_date }` - `[<caretakerStats>]`
- DATE should be in `YYYY/MM/DD`
- <availabilityStatus> : {
    "user_id": "3",
    "start_date": "2020/10/19",
    "end_date": "2020/10/19",
    "is_full_time": true
}
- <caretakerStats> : {
    "care_taker_user_id": 3,
    "pet_day": "3",
    "total_earnings": "1100",
    "post_60_days_earnings": null,
    "is_full_time": true
}
