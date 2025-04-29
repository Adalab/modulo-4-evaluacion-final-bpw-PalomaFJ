📚API DE LIBROS

Esta API permite gestionar una colección de libros, realizando operaciones de lectura, inserción, actualización y eliminación sobre una base de datos remota.

He desarrollado el proyecto usando:

- Node.js
- Express.js
- MySQL (con conexión a Aiven)
- Postman para realizar las pruebas

📋FUNCIONALIDADES DE LA API (la API ofrece las siguientes operaciones)

METODO -> GET // ENDPOINT -> /api/libros // DESCRIPCION -> Listar todos los libros
METODO -> GET // ENDPOINT -> /api/libros/:id // DESCRIPCION -> Obtener un libro concreto por su ID
METODO -> POST // ENDPOINT -> /api/libros // DESCRIPCION -> Añadir un libro nuevo
METODO -> PUT // ENDPOINT -> /api/libros/:id // DESCRIPCION -> Actualizar un libro existente
METODO -> DELETE // ENDPOINT -> /api/libros/:id // DESCRIPCION -> Eliminar un libro por su ID

📋ESTRUCTURA DE UN LIBRO
   Cada libro tiene:
   . id (número entero, autoincremental)
   . titulo (texto)
   . autor (texto)
   . leído (booleano -> true o false)
    
    *EJEMPLO:
    
  "titulo": "La revolución por el tejado",
  "autor": "Lucio Urtubia",
  "leido": true

🚀 CÓMO ARRANCAR EL PROYECTO

1. Clona el repositorio
2. Instalar dependencias (npm install)
3. Lanzar el servidor (npm run dev)
4. El servidor se ejecuta en http://localhost:4000

🛠️CONEXIÓN CON LA BASE DE DATOS

La API se conecta a una base de datos MySQL alojada en Aiven.
Los datos de conexión (host, user, password, database y port) están configurados directamente en el index.js.

¿Por qué uso rejectUnauthorized: false en la conexión? 
Cuando me conecto a Aiven, necesito usar un certificado SSL.
Por defecto, Node.js rechazba los certificados que no son de una autoridad reconocida (self-signed certificates).
Como Aiven usa un certificado propio para la conexión segura, he tenido que añadir esta configuración en la conexión.
Con eso, le digo a Node.js que acepte el certifcado de Aiven aunque no sea oficial, y así la conexión es segura y he podido trabajar sin errores de autenticación SSL. Esto me llevó un buen rato la verdad porque no contaba con Aiven ni con tener que usar la autenticación, pero ahora ya sé algo más y aunque me haya llevado un rato, todo ha merecido la pena para poder desarrollar mi API y poder probarla sin errores.

PRUEBAS CON POSTMAN

Para probar la API puedes:

- Hacer un GET para ver todos los libros.

- Hacer un POST para insertar un libro.

- Hacer un PUT para actualizar un libro.

- Hacer un DELETE para eliminar un libro.

Todas las rutas siguen la estructura http://localhost:4000/api/libros.


