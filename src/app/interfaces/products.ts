export interface Product {
    _id: number,
    prdouct_name: string,
    price: number,
    img_url: string,
    category_id: {
        _id: string,
        category_name: string,
        __v: number
    }
}