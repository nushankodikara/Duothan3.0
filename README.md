Here are the API endpoints to manage this application.

### Medicine Endpoints ( Only for Admin )

- **GET /medicines**: Get a list of all medicines
- **POST /medicine**: Create a new medicine
- **GET /medicine/{medID}**: Get details about a specific medicine
- **PUT /medicine/{medID}**: Update an existing medicine
- **DELETE /medicine/{medID}**: Delete a medicine

### Pharmacy Endpoints

- **POST /newPharmacy**: Create a new pharmacy ( Pharmacy )
- **GET /newPharmacies**: Get pharmacies to be approved ( Admin )
- **GET /pharmacies/{pharmID}**: Get details about a specific pharmacy ( All users )
- **POST /pharmacies/{pharmID}/approve**: Approve Created Pharmacy ( Admin )
- **PUT /pharmacies/{pharmID}**: Update an existing pharmacy ( Admin and Pharmacy )
- **DELETE /pharmacies/{pharmID}**: Delete a pharmacy ( Admin )
- **GET /pharmacies**: Get a list of all pharmacies ( All users )

### Available Medicine Endpoints

- **POST /medicines/{medID}/pharmacies/{pharmID}**: Add a new batch of a medicine to a specific pharmacy ( Pharmacy )
- **GET /medicines/{medID}/pharmacies/{pharmID}**: Get all details of medicine’s batches in a pharmacy ( Pharmacy )
- **GET /medicines/{medID}/pharmacies/{pharmID}/{batchID}**: Get the quantity of a specific batch of a medicine at a specific pharmacy ( Pharmacy )
- **PUT /medicines/{medID}/pharmacies/{pharmID}/{batchID}**: Update the quantity of a specific batch of a medicine at a specific pharmacy ( Pharmacy )
- **DELETE /medicines/{medID}/pharmacies/{pharmID}/{batchID}**: Remove a specific batch of a medicine from a specific pharmacy ( Pharmacy )
- **GET /medicines/{medID}/pharmacies**: Get a list of all pharmacies that carry a specific medicine ( All users )
- **GET /pharmacies/{pharmID}/medicines**: Get a list of all medicines available at a specific pharmacy ( All users )

### Primary User Endpoints

- **POST /signup**: Signup for a new account ( Admin and Pharmacy )
- **POST /login**: Login to an existing account ( Admin and Pharmacy )
- **GET /users/{userID}**: Get details about a specific user ( Admin and Pharmacy )
- **PUT /users/{userID}**: Update an existing user ( Admin and Pharmacy )
- **DELETE /users/{userID}**: Delete a user ( Admin ) - BUGGED AT DELETE AUTH