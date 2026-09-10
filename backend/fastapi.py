from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def my_existing_logic():
    return {"status": "success", "message": "Backend code executed"}

@app.get("/api/run")
@app.post("/api/run")
def handle_request():
    return my_existing_logic()
