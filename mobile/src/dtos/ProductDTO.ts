export type ProductDTO = {
  id: string;
  name: string;
  price: number;
  is_new: boolean;
  is_active: boolean;
  description: string;
  accept_trade: boolean;
  payment_methods: Array<any>;
  product_images?: Array<any>;
  user?: {
    avatar: string;
    name: string;
    tel: string;
  };
}