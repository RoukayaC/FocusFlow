import { Hono } from "hono";
import products from "./products";
const app = new Hono().route("/products", products);
export default app;
