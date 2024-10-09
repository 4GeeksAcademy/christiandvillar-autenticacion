"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS

# Environment check
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

# Initializing Flask app
app = Flask(__name__)
app.url_map.strict_slashes = False

# JWT configuration (add your secret key)
app.config['JWT_SECRET_KEY'] = 'your-secret-key-here'  # Cambia 'your-secret-key-here' por una clave segura

# Initialize JWTManager
jwt = JWTManager(app)

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initializing database and migration tool
db.init_app(app)
MIGRATE = Migrate(app, db, compare_type=True)

# Initializing Bcrypt for password hashing
bcrypt = Bcrypt(app)

# CORS setup
CORS(app)

# Register admin setup
setup_admin(app)

# Register command line commands
setup_commands(app)

# Registering the API blueprint
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Registration route
@app.route('/register', methods=['POST'])
def register():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({'msg': 'Fields cannot be left empty'}), 400

    email = body.get('email')
    password = body.get('password')

    if not email:
        return jsonify({'msg': 'The email field cannot be empty'}), 400
    if not password:
        return jsonify({'msg': 'The password field cannot be empty'}), 400

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "The user already exists"}), 400

    # Create new user with hashed password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_password, is_active=True)

    db.session.add(new_user)
    db.session.commit()

    # Create access token
    access_token = create_access_token(identity=new_user.id)
    return jsonify({
        "msg": "Usuario registrado con éxito",
        "access_token": access_token
    }), 200

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Search for user by email
    user = User.query.filter_by(email=email).first()

    # Verify password
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Correo o contraseña incorrectos"}), 401

    # Create access token
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

# Protected route
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user.email), 200

# Serve static files
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# Run the application
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)