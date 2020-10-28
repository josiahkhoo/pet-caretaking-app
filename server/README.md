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
    "salary": 1000.0
}

## Availablility
- Can sort by any number of these params below
- Endpoint: "/available/"
- GET `localhost:5000/available/?name=&start=2020-10-01&end=2020-10-31&category=Do&price=100&rating=0`
- Possible Params to sort by {name, start, end, category, price ,rating}` - availablilty under parameters given
- DATE should be in `YYYY/MM/DD`
Example:
- Query Params Inputs on postman: {
        "name": null
        "start": "2020-10-01"
        "end": "2020-10-31"
        "price": 100,
        "category": "Do"
        "rating": 3.6
  }
- Availablity: [
    {
        "userid": 2,
        "named": "Josiah Khoo",
        "contact": "98669989",
        "price": 100,
        "category": "Dogs",
        "round": "4.00"
    }
]

Caretakers Salary:
- Endpoint: "/caretakers/salary/"
- Optional Parameters Start/End (default is full range of dates)
- GET `localhost:5000/caretakers/salary?start=2020-10-01&end=2020-10-31`
- Possible Params to set {start, end}` - availablilty under parameters given
- Query Params Inputs on postman: {
        "start": "2020-10-01"
        "end": "2020-10-31"
  }
- Expected Salary: [
        {
            "care_taker_user_id": 2,
            "pet_day": "7",
            "total_earnings": "21099",
            "post_60_days_earnings": null,
            "is_full_time": false,
            "salary": "10549.500"
        },
        {
            "care_taker_user_id": 3,
            "pet_day": "4",
            "total_earnings": "3300",
            "post_60_days_earnings": null,
            "is_full_time": true,
            "salary": "1000"
        }
    ]