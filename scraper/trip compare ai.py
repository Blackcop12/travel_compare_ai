from flask import Flask, request, jsonify

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "comparex-ai-scraper"})


@app.get("/scrape")
def scrape():
    query = request.args.get("query", "")
    if not query:
        return jsonify({"results": []})

    # This is a simulation endpoint for local development.
    demo = [
        {
            "name": query,
            "platform": "Amazon",
            "price": 999,
            "rating": 4.2,
            "etaMinutes": 1440,
            "redirectUrl": "https://www.amazon.in",
        },
        {
            "name": query,
            "platform": "Flipkart",
            "price": 949,
            "rating": 4.1,
            "etaMinutes": 1320,
            "redirectUrl": "https://www.flipkart.com",
        },
    ]
    return jsonify({"results": demo})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
