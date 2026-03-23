
function getUsuarios(){
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(data){
  localStorage.setItem("usuarios", JSON.stringify(data));
}

function getProductos(){
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductos(data){
  localStorage.setItem("productos", JSON.stringify(data));
}

//variable global(no tocar)
let usuarioActual = null;


//las primeras paginas(inicio de sesion (login) y Registro)
function irLogin(){
  registro.classList.add("hidden");
  vistaLogin.classList.remove("hidden");
}

function irRegistro(){
  vistaLogin.classList.add("hidden");
  registro.classList.remove("hidden");
}

function mostrar(seccion){
  inicio.classList.add("hidden");
  admin.classList.add("hidden");
  jsonView.classList.add("hidden");

  document.getElementById(seccion).classList.remove("hidden");

  if(seccion === 'jsonView'){
    verJSON();
  }
}

//Chequeo de que todo esta bien al registrarse 
function registrar(){
  if(regPass.value !== regPass2.value){
    alert("Las contraseñas no coinciden");
    return;
  }

  let reader = new FileReader();

  reader.onload = function(){
    let usuarios = getUsuarios();

    usuarios.push({
      nombre: regNombre.value,
      correo: regCorreo.value,
      pass: regPass.value,
      foto: reader.result,
      admin: false
    });

    guardarUsuarios(usuarios);
    alert("Registro exitoso");
    irLogin();
  }

  if(regFoto.files[0]){
    reader.readAsDataURL(regFoto.files[0]);
  }else{
    alert("Selecciona una imagen");
  }
}

function login(){
  let usuarios = getUsuarios();

  let user = usuarios.find(u =>
    u.correo === logCorreo.value &&
    u.pass === logPass.value
  );

  if(user){
    usuarioActual = user;
    iniciarApp();
  }else{
    alert("Correo o Contraseña incorrecta");
  }
}

function logout(){
  location.reload();
}

//Pagina Inicio 
function iniciarApp(){
  registro.classList.add("hidden");
  vistaLogin.classList.add("hidden");

  app.classList.remove("hidden");
  menu.classList.remove("hidden");

  bienvenida.innerText = "Hola " + usuarioActual.nombre + " :D";
  fotoPerfil.src = usuarioActual.foto;

  actualizarRol();
  cargarProductos();
}

//Cambio de rol dentro del programa :b (principal - no mover)
function toggleRol(){
  let usuarios = getUsuarios();
  let index = usuarios.findIndex(u => u.correo === usuarioActual.correo);

  if(usuarioActual.admin){
    usuarioActual.admin = false;
    alert("Ahora eres visitante");
  }else{
    usuarioActual.admin = true;
    alert("Ahora eres administrador");
  }

  usuarios[index] = usuarioActual;
  guardarUsuarios(usuarios);

  actualizarRol();
}

function actualizarRol(){
  if(usuarioActual.admin){
    btnAdmin.classList.remove("hidden");
    btnJson.classList.remove("hidden");
    btnRol.innerText = "Volverme Visitante";
  }else{
    btnAdmin.classList.add("hidden");
    btnJson.classList.add("hidden");
    btnRol.innerText = "Volverme Administrador";
  }
}

//edicion perfil 
function editarPerfil(){
  let usuarios = getUsuarios();
  let correoOriginal = usuarioActual.correo;
  let reader = new FileReader();

  reader.onload = function(){
    if(editNombre.value) usuarioActual.nombre = editNombre.value;
    if(editCorreo.value) usuarioActual.correo = editCorreo.value;
    if(editPass.value) usuarioActual.pass = editPass.value;
    if(editFoto.files[0]){
      usuarioActual.foto = reader.result;
    } 

    let index = usuarios.findIndex(u => u.correo === correoOriginal);
    
    if(index !==-1){
      usuarios[index] = usuarioActual;
      guardarUsuarios(usuarios);
    }
    else{
      alert("Error al actualizar el usuario");
      return;
    }

    fotoPerfil.src = usuarioActual.foto;
    bienvenida.innerText = "Hola " + usuarioActual.nombre + " :D";

    alert("Perfil actualizado");
  }

  if(editFoto.files[0]){
    reader.readAsDataURL(editFoto.files[0]);
  }else{
    reader.onload();
  }
}

//Subir archivo 
function subirArchivo(){
  let file = archivo.files[0];
  let reader = new FileReader();

  reader.onload = function(){
    let productos = getProductos();

    let nuevo = {
      id: Date.now(),
      titulo: titulo.value,
      descripcion: descripcion.value,
      categoria: categoria.value,
      nombreArchivo: file.name,
      tipo: file.type,
      usuario: usuarioActual.nombre,//
      autor: autor.value,//
      fecha: fecha.value,
      contenido: "Recursos/" + file.name //solo se pueden usar los archivos de la carpeta recuros(para no gastar espacio de local storage)
    };

    productos.push(nuevo);
    guardarProductos(productos);

    cargarProductos();
    alert("Archivo subido");
  }

  if(file){
    reader.readAsDataURL(file);
  }else{
    alert("Selecciona un archivo");
  }
}

function cargarProductos(){
  let lista = getProductos();
  let contenedor = document.getElementById("productos");

  contenedor.innerHTML = "";

  lista.forEach(p => {
    contenedor.innerHTML += `
      <div class="card">
        <h4>${p.titulo || "Sin título"}</h4>
        <p>${p.descripcion || ""}</p>
        <br>
        <small>${p.autor || "Desconocido"} | ${p.fecha || ""}</small><br>
        <br>

        ${p.tipo && p.tipo.startsWith('image') ? `<img src="${p.contenido}" width="450">` : ''}
        ${p.tipo && p.tipo.startsWith('video') ? `<video src="${p.contenido}" width="450" controls></video>` : ''}
        ${p.tipo && p.tipo.startsWith('audio') ? `<audio src="${p.contenido}" controls></audio>` : ''}

      </div>
    `;
  });
}

//json en la pagina pa que se vea asi bien chido >:D
function verJSON(){
  let data = {
    usuarios: getUsuarios(),
    productos: getProductos()
  };

  jsonData.textContent = JSON.stringify(data, null, 2);
}

//resetear json 
function resetearTodo(){
  if(confirm("¿Seguro que quieres borrar todo?")){
    localStorage.clear();
    location.reload();
  }
}