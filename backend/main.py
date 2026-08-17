from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any
import random
import json
from database import get_db_connection

app = FastAPI(title="RapidFeast API", version="1.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic validation models
class OrderItem(BaseModel):
    id: int
    name: str
    price: float
    qty: int = 1

class CreateOrderRequest(BaseModel):
    customerName: str
    phone: str
    address: str
    items: List[OrderItem]
    totalAmount: float

# 1. Place Order API
@app.post("/api/orders")
def create_order(order: CreateOrderRequest):
    order_id = f"RF-{random.randint(100000, 999999)}"
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = """
            INSERT INTO orders (order_id, customer_name, phone, address, items, total_amount)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *;
        """
        cursor.execute(query, (
            order_id,
            order.customerName,
            order.phone,
            order.address,
            json.dumps([item.dict() for item in order.items]),
            order.totalAmount
        ))
        new_order = cursor.fetchone()
        conn.commit()
        return {"success": True, "order": new_order}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# 2. Track Order API
@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM orders WHERE order_id = %s;", (order_id,))
    order = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"success": True, "order": order}

# Health check
@app.get("/")
def home():
    return {"status": "RapidFeast Backend is Live"}