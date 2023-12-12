from fastapi import FastAPI
from routers import router
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3002",
]

app = FastAPI()

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
