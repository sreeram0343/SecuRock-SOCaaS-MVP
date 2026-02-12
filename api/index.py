import os
import sys

# Add the 'backend' directory to sys.path so that 'app' can be imported as a top-level package
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.main import app
