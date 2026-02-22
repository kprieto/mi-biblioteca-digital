const formulario = document.getElementById('formulario-libro');
const contenedor = document.getElementById('lista-libros');

// 1. Función para agregar un libro (POST)
formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const nuevoLibro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        isbn: document.getElementById('isbn').value,
        genero: document.getElementById('genero').value,
        imagenUrl: document.getElementById('imagenUrl').value || undefined,
        disponible: document.getElementById('disponible').checked,
    };

    try {
        const respuesta = await fetch('/api/libros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoLibro)
        });

        if (respuesta.ok) {
            formulario.reset(); // Limpia el formulario
            cargarLibros();    // Recarga la lista para ver el nuevo libro
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// 2. Función para cargar libros (GET)
async function cargarLibros() {
    console.log("Intentando cargar libros...");
    try {
        const respuesta = await fetch('/api/libros');
        const libros = await respuesta.json();
        
        console.log("Datos recibidos de la API:", libros);

        const contenedor = document.getElementById('lista-libros');
        if (!contenedor) {
            console.error("No se encontró el div #lista-libros");
            return;
        }

        contenedor.innerHTML = ""; // Limpiar

        if (libros.length === 0) {
            contenedor.innerHTML = "<p>No hay libros en la base de datos.</p>";
        }

        libros.forEach(libro => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${libro.titulo}</h3>
                <img src="${libro.imagenUrl}" alt="Portada de ${libro.titulo}" class="portada-libro">
                <p><strong>Autor:</strong> ${libro.autor}</p>
                <p><strong>ISBN:</strong> ${libro.isbn}</p>
                <p><strong>Género:</strong> ${libro.genero}</p>
                <p><strong>Estado:</strong> ${libro.disponible ? 
                    '<span style="color: green;">Disponible</span>' : 
                    '<span style="color: red;">Prestado</span>'}
                </p>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error("Error en la petición fetch:", error);
    }
}

// Carga inicial
document.addEventListener('DOMContentLoaded', cargarLibros);