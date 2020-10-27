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
### Insert part time availability from start date to end date of a specific caretaker
POST `/caretakers/availability { user_id, start_date, end_date }` - `<availabilityStatus>`
### Get earnings from start to end date of a specific caretaker
GET `/caretakers/earnings { start_date, end_date }` - `[<caretakerStats>]`
### Confirm an unconfirmed bid under a part time caretaker
POST `/caretakers/part-time/bid/confirm { care_taker_user_id, start_date, end_date, pet_owner_user_id, pet_name }` - `<bid>`
### Get all bids from a specific care taker
GET `/caretakers/:care_taker_user_id/bid` - `[<bid>]`
### Delete a specific date for a full time care taker
POST `/caretakers/full-time/leave { care_taker_user_id, available_date } ` - `<availability>`
### Creates a can take care of with a specified price (if its part time)
POST `/caretakers/categories { care_taker_user_id, category_name, price } ` - `<categoryPrice>`
### Get number of pets taken care by caretaker for a date range (FOR ADMIN)
GET `/caretakers/:care_taker_user_id/pet-care-count/:start_date/:end_date` - `FILL THIS UP`
### Get average caretaker rating per pet category for a given month
GET `/caretakers/categories/satisfaction/:month` - `FILL THIS UP`
### Get month with the highest pet day
GET `/caretakers/highest-pet-care-month` - `FILL THIS UP`
### Get underperforming care takers by month
GET `/caretakers/under-performing/:month` - `FILL THIS UP`
- Get all underperforming Fulltime Care Takers of a given month
    > Number of Pet Days < 60 OR Average rating < 2.5
### Get caretaker average rating
GET `/caretaker/:care_taker_user_id/average-rating` - `FILL THIS UP`
### Get total caretakers total number of pet taken care in month
GET `/caretaker/total-pet-care-by-month` - `FILL THIS UP`
### Appendix
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
- categoryPrice: {
        "care_taker_user_id": 27,
        "category_name": "Cats",
        "daily_price": 2000
}

## pet owners
### Create a new bid
POST `/pet-owners/bid { care_taker_user_id, start_date, end_date, pet_owner_user_id, pet_name, payment_type, transfer_type }` - `<bid>`

### Create a pet
POST `/pet-owners/pets { pet_owner_user_id, pet_name, category_name, special_requirements, image_url}` - `<pet>`
### View all bids from the specific pet owner
GET `/pet-owners/:pet_owner_user_id/bid` - `[<bid>]`
### View all bids from a specific pet from a specific pet owner
GET `/pet-owners/:pet_owner_user_id/pets/:pet_name/bid` - `[<bid>]`
### View all pets owned by pet owner
GET `/pet-owners/:pet_owner_user_id/pets` - `[<petDetails>]`
### View all reviews by owner in the specific category 
GET `/pet-owners/:pet_owner_user_id/categories/:category_name/reviews` - `[<review>]`

### Appendix
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
- review : {
        "review": "best"
    }
- petDetails: {
        "owner": "yumingchen",
        "pname": "Roger",
        "bio": null,
        "pic": null
    }
- pet: {
    "pet_owner_user_id",
    "pet_name",
    "category_name",
    "special_requirements",
    "image_url"
}

## categories
### Get all categories
GET `/categories` - `[<category>]`

### Appendix
- category : {
    "name",
    "full_time_daily_price"
}