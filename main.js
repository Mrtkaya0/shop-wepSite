// !htmlden gelenler
const categoryList = document.querySelector('.categories');
const productsList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const basketBtn = document.querySelector('#basket-btn');
const closeBtn = document.querySelector('#close-btn');
const basketList = document.querySelector('#list');
const totalInfo = document.querySelector('#total')
const priceInfo = document.querySelector('#price')




// /! html olay izleyicisi izle !/
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchProducts();
});

/! kategori verilerini alma !/
// 1 istek atma
// 2 gelen veriyi işle 
// 3 ekrana basılacak verileri işle
// 4 hata olursa kullanıcıya bildir

const baseUrl = 'https://fakestoreapi.com'

function fetchCategories() {
    fetch(`${baseUrl}/products/categories`)
        .then((response) => response.json())
        .then(renderCategories)
        .catch((err) => alert('verileri çekerken hata oluştu'))

}


// her bir kategori için kart oluştur
function renderCategories(categories) {
    categories.forEach((category) => {
        // 1 div oluşturma
        const categoryDiv = document.createElement('div');
        //  2 dive Clas ekleme
        categoryDiv.classList.add('category');
        // 3 içeriğini belirleme
        const rndmNo = Math.round(Math.random() * 1000);
        categoryDiv.innerHTML = `
        <img src="https://picsum.photos/640/640?r=${rndmNo}" alt="">
            <h2>${category}</h2>
        </div>
        `;
        // 4 html veriyi gönderip ekranda gösterme
        categoryList.appendChild(categoryDiv);

    })
}
let data;

// ürünler verisin çeken fonksiyon
async function fetchProducts() {

    try {
        // apiye istek at
        const response = await fetch(`${baseUrl}/products`);
        // apiden gelen veriyi json ile işle 
        data = await response.json();
        // ekrana bas
        renderProducts(data)

    } catch (error) {
        alert('ürünleri çekerken hata oluştu')

    }

}

// ürünleri ekrana basma

function renderProducts(products) {
    // her bir ürün için ekrana kart basma

    const cardsHTLM = products.map((product) =>
        `
    <div class="card">
       <div class"img-wrapper">
            <img src="${product.image}" alt="">
            </div>         
         <hr>
            <h4>${product.title}</h4>
            <h4>${product.category}</h4>
            <div class="info">
                <span>${product.price} $ </span>
                <button onclick='addToBasket (${product.id})'>Sepet</button>
            </div>
            </div>
    `
    )
        .join(' ')

    productsList.innerHTML = cardsHTLM;
}


/!Sepet işlemlerini izlemele olayları !/
let basket = [];
let total = 0;

// sepete tıklandığında modala active klasını ekleyip ekrana getirme işlemi
basketBtn.addEventListener('click', () => {
    modal.classList.add('active')
    renderBasket();
});

// çarpı butonuna bastığında ekrana getirmesini sağlayan ac tive klasını modaldan silip ekrandan kaldırma işlemini yap
document.addEventListener('click', (i) => {
    if (
        i.target.classList.contains('modal-wrapper') ||
        i.target.id === 'close-btn'
    ) {
        modal.classList.remove('active')
    }
})

function addToBasket(id) {
    // idisinden yola çıkarak objenin deeerlerini bulma
    const product = data.find((i) => i.id === id)
    // sepete daha önce ürün eklendiyse bul
    const found = basket.find((i) => i.id == id);
    if (found) {
        // sepette varsa miktarını artır
        found.amount++;
    } else {
        // sepete ürüün ekler
        basket.push({ ...product, amount: 1 });
    }
    Toastify({
        text: "Ürün Sepete Eklendi",
        duration: 2000,
        close:true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();

    //   sepeti güncelle
    renderBasket();
}

// sepetteki elemanları listeleme 

function renderBasket() {
    basketList.innerHTML = basket.map(
        (i) => `
          <div class="item">
            <img src="${i.image}" alt="">
            <h3 class="title">${i.title.slice(0, 30) + '...'}</h3>
            <h4 class="price">${i.price}$</h4>
            <p>Miktar: ${i.amount}</p>
            <i onclick='handleDelete(${i.id})' id="delete" class="fa-solid fa-trash-can"></i>
        </div>
        `
    )
        .join(' ');

    calculateTotal();
}


// ürün adet ve fiyatları hesaplama fiyatları foonksiyonu

function calculateTotal() {
    // reduce diziyi döner ve elemanların belirlenen değerlerini toplar

    const total = basket.reduce(
        (sum, i) => sum + i.price * i.amount, 0
    )
    // ürün adetlerinin miktarını toplama fonksiyonu
    const amount = basket.reduce((sum,i) => sum + i.amount, 0);
    totalInfo.innerHTML = `
            Adet:
            <span id="count">${amount}</span>
            Toplam:
            <span id="price">${total.toFixed(2)}$</span>
    `;
}
//sepetteki elemanı silme
function handleDelete(deleteId) {
    // kaldırılacak ürünü diziden çıkarma
    basket = basket.filter((i) => i.id !==deleteId)
    // listeyi güncelle
    renderBasket();
    // toplamı güncelle
    calculateTotal();

}