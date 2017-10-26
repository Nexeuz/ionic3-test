export interface Like {
    like: boolean;
    userId: string;
    idcard: string;
  }
  
  export interface User {
    admin: boolean;
    email: string;
    id: string;
    name: string;
  }
  
  export interface Card {
    category: string;
    description: string;
    title: string;
    url_articulo: string;
    url_img: string;
    source: string;
    date: any;
  }