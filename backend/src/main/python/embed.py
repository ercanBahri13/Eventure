# embed.py
import sys
import json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def main():
    text = sys.stdin.read().strip()
    embedding = model.encode(text)()
    print(json.dumps(embedding.tolist))

if __name__ == "__main__":
    main()