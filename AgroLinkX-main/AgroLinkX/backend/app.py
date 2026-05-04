from flask import Flask, request, jsonify
from flask_cors import CORS   # 🔥 ADD THIS
import sqlite3

app = Flask(__name__)
CORS(app)   # 🔥 VERY IMPORTANT

# Create database
def init_db():
    conn = sqlite3.connect('agrolinkx.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS products
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT,
                  price TEXT,
                  quantity TEXT)''')
    conn.commit()
    conn.close()

init_db()

# Add product API
@app.route('/add-product', methods=['POST'])
def add_product():
    data = request.json
    print("Received:", data)   # 🔥 DEBUG

    conn = sqlite3.connect('agrolinkx.db')
    c = conn.cursor()

    c.execute("INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)",
              (data['name'], data['price'], data['quantity']))

    conn.commit()
    conn.close()

    return jsonify({"message": "Product added successfully"})

# Get products API
@app.route('/get-products', methods=['GET'])
def get_products():
    conn = sqlite3.connect('agrolinkx.db')
    c = conn.cursor()

    c.execute("SELECT * FROM products")
    rows = c.fetchall()

    conn.close()

    products = []
    for row in rows:
        products.append({
            "id": row[0],
            "name": row[1],
            "price": row[2],
            "quantity": row[3]
        })

    return jsonify(products)

# DELETE API

@app.route('/delete-product/<int:id>', methods=['DELETE'])
def delete_product(id):
    conn = sqlite3.connect('agrolinkx.db')
    c = conn.cursor()

    c.execute("DELETE FROM products WHERE id=?", (id,))

    conn.commit()
    conn.close()

    return jsonify({"message": "Product deleted successfully"})

# Run server
if __name__ == '__main__':
    app.run(debug=True)