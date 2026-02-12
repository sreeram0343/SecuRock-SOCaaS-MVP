from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, auth, database
from .database import engine, get_db
from shared.schemas import UserCreate, User

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SecuRock Auth Service")

@app.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = auth.get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return auth.create_user(db=db, user=user)

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
def read_users_me(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token")), db: Session = Depends(get_db)):
    # Simple verification logic, in real microservice need to decode token
    username = auth.verify_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    return auth.get_user(db, username=username)
