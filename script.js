const apiKey = "eed985a4";
const apiUrl = "https://www.omdbapi.com/";

window.onload = () => {
    document.getElementById("searchForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("searchInput").value;
        try {
            const data = await searchMovie(title);
            const movieInfo = `
                <h2>${data.Title}</h2>
                <p><strong>Год выпуска:</strong> ${data.Year}</p>
                <p><strong>Жанр:</strong> ${data.Genre}</p>
                <p><strong>Режиссер:</strong> ${data.Director}</p>
                <p><strong>Актеры:</strong> ${data.Actors}</p>
                <p><strong>Описание:</strong> ${data.Plot}</p>
                <img src="${data.Poster}" alt="${data.Title} poster">
                <button id="addToFavorites">Добавить в избранное</button>`; // избранное

            document.getElementById("movieInfo").innerHTML = movieInfo;
            document.getElementById("addToFavorites").addEventListener("click", () => {
                addToFavorites(data).then(() => {
                    alert("Фильм добавлен в избранное.");
                }).catch(error => {
                    alert("Произошла ошибка при добавлении в избранное: " + error.message);
                });
            });
            } catch (error) {
            document.getElementById("movieInfo").innerHTML = `<p>Ошибка: ${error.message}</p>`;
        }
    });

};
function searchMovie(title) {
    return new Promise((resolve, reject) => {
        fetch(`${apiUrl}?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Возникла ошибка при получении данных");
                }
                return response.json();
            })
            .then(data => {
                if (data.Response === "False") {
                    throw new Error(data.Error);
                }
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}
function addToFavorites(movieData) {
    return new Promise((resolve, reject) => {
        try {
                // Возьмем текущий список избранного из localStorage или пустой массив, если ничего нет
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                // Добавим новый фильм
            favorites.push(movieData);
                // Сохраним обновленный список обратно в localStorage
            localStorage.setItem("favorites", JSON.stringify(favorites));
            resolve();
        } catch (error) {
            reject(error);
        }
    });

}
