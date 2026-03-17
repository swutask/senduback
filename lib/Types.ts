export interface TestimonialT {
  _id: string;
  name: string;
  email: string;
  comment: string;
  rating: number; // usually 1–5
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TfAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface ShippingRate {
  _id: string;
  title: string;
  description: string;
  shippingType: "express" | "standard" | string;
  duration: string;
  fromZone: number;
  toZone: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
