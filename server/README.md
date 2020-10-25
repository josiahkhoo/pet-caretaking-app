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
- GET `/petOwner/currentPetCountForCaretaker/:cid/:start_date/:end_date`
    - Get current number of pets taken care by caretaker with UID for date range
    - Inputs: `cid` caretaker's id, `start_date`, `end_date`

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
}
- GET `/caretaker/avgRating/:cid`
    - Get average rating of a caretaker
    - Inputs: `cid` caretaker's id

## PC admins
- GET `/pcadmin/totalPetTakenCare`
    - Get the total number of pet taken care of per month
    - Input: -
- GET `/pcadmin/satisfaction/:month`
    - Get the average satisfaction per pet category for a given month
    - Input: `month`
- GET `/pcadmin/highestPetDaysMonth`
    - Get the month with the highest number of jobs -> the highest number of petdays
    - Input: -
- GET `/pcadmin/underPerformingCaretaker/:month`
    - Get all underperforming Fulltime Care Takers of a given month
        > Number of Pet Days < 60 OR Average rating < 2.5
    - Input: `month`

