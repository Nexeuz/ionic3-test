export interface Like {
    like: boolean;
    userId: string;
    cardId: string;
  }
  
  export interface User {
    admin: boolean;
    email: string;
    uid: string;
    name: string;
    avatar: string;
    createdAt: any;
  }
  
  export interface Card {
    id: string;
    category: string;
    description: string;
    title: string;
    url_articulo: string;
    url_img: string;
    source: string;
    date: any;
    likes: number;
  }


  export interface QueryConfig {
    path: string, //  path to collection
    field: string, // field to orderBy
    limit: number, // limit per query
    reverse?: boolean, // reverse order?
    prepend?: boolean // prepend to source?
  }