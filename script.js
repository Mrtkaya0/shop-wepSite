const url = 'https://jsonplaceholder.typicode.com/users';



// apiye istek atma metodu
fetch(url)
.then((response) => {
    // gelen json verisini kullanılabilir hale getirme i,şlemi
    return response.json();
})
// veri geldikten sonra çalışır
.then(renderUser) 

// veride hata olursa gelmezse çalışırı
.catch((error) => {
    console.log(error);
});


function renderUser(data) {
    data.forEach((user) => document.write(user.name+'<br>'));
}