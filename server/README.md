# paths
## login
- POST `/register { username, password, contact_number, name, address, is_pcs_admin, is_pet_owner, is_cate_taker }` - `<userObj>`
- GET `/login { username, password }` - `<userObj>`
- userObj : { "username": "qwe", 
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
- POST `/caretaker/part-time/bid/confirm { care_taker_user_id, start_date, end_date, pet_owner_user_id, pet_name }` - `<bid>`
- GET `/caretaker/bid/:care_taker_user_id` - `[<bid>]`
- POST `/caretaker/part-time/available` - `<availability>`
- POST `/caretaker/full-time/leave` - `<availability>`
- DATE should be in `YYYY/MM/DD`
- availabilityStatus : {
    "user_id": "3",
    "start_date": "2020/10/19",
    "end_date": "2020/10/19",
    "is_full_time": true
}
- caretakerStats : {
    "care_taker_user_id": 3,
    "pet_day": "3",
    "total_earnings": "1100",
    "post_60_days_earnings": null,
    "is_full_time": true
}
- bid : {
    "care_taker_user_id": 2,
    "pet_owner_user_id": 1,
    "pet_name": "Sunshine",
    "is_success": true,
    "payment_type": "Visa",
    "transfer_type": "Deliver",
    "total_price": 1000,
    "review": null,
    "rating": null,
    "start_date": "2020-10-11T16:00:00.000Z",
    "end_date": "2020-10-12T16:00:00.000Z",
    "datetime_created": "2020-10-23T05:36:48.921Z"
}
- availability : {
    "care_taker_user_id": 2,
    "available_date": "2021-01-02"
}

## pet owners
- POST `/pet-owner/bid { care_taker_user_id, start_date, end_date, pet_owner_user_id, pet_name, payment_type, transfer_type }` - `<bid>`
- GET `/pet-owner/bid/:pet_owner_user_id` - `[<bid>]`
- GET `/pet-owner/bid/:pet_owner_user_id/:pet_name` - `[<bid>]`
- bid : {
    "care_taker_user_id": 2,
    "pet_owner_user_id": 1,
    "pet_name": "Sunshine",
    "is_success": true,
    "payment_type": "Visa",
    "transfer_type": "Deliver",
    "total_price": 1000,
    "review": null,
    "rating": null,
    "start_date": "2020-10-11T16:00:00.000Z",
    "end_date": "2020-10-12T16:00:00.000Z",
    "datetime_created": "2020-10-23T05:36:48.921Z"
}