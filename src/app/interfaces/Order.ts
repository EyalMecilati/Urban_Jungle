export interface Order{
    _id:string,
    user_id:string,
    cart_id:string,
    city_for_delivery:string,
    street_for_delivery:string,
    date_of_order:Date,
    date_for_delivery:Date,
    total_sum:number,
    last_digit_credit_card:string
}