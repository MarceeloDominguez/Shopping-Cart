import slider from './slider.js'

slider()

document.addEventListener('DOMContentLoaded', getProducts)

const container = document.querySelector('.container')
const cartItems = document.querySelector('.cart-items')
const cartContainer = document.querySelector('.cart-container')
const cartDom = document.querySelector('.cart')
const cartBtn = document.querySelector('.card-btn')
const closeCart = document.querySelector('.close-cart')
const totalPrice = document.querySelector('.total-price')
const contentInCart = document.querySelector('.content-inCart')
const deleteCart = document.querySelector('.delete-cart')

let buttonsDom = []
let cart = []

async function getProducts() {
    let results = await fetch('products.json')
    let data = await results.json()
    let products = data.items

    productsDom(products)
    saveProductsLocalStorage(products)
    mostrarCartenElDom()
    clearCart()
    buttonsDelete()
}

function productsDom(products) {
    let results = ''
    products.forEach(product => {
        results += `
        <div class="image-container">
            <img src=${product.image.url} alt="image" class="img-product">
            <button class="add-cart" data-id=${product.id}><i class="fas fa-shopping-cart"></i>Agregar al carrito</button>
            <figcaption>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </figcaption>
        </div>`
    });

    container.innerHTML = results
    getButtonsProducts()
}

function getButtonsProducts() {
    const buttons = [...document.querySelectorAll('.add-cart')]
    buttonsDom = buttons

    buttons.forEach(button => {
        cart = getCart()
        let id = button.dataset.id
        let inCart = cart.find(item => item.id === id)
        if (inCart) {
            button.innerHTML = 'En el carrito'
            button.classList.add('enCarrito')
            button.disabled = true
        }

        button.addEventListener('click', (e) => {
            e.target.innerHTML = 'En el carrito'
            e.target.classList.add('enCarrito')
            e.target.disabled = true

            let cartItem = { ...getProductsLocalStorage(id), cantidad: 1 }
            cart = [...cart, cartItem]
            saveInCart(cart)
            setCartValuesDom(cart) //this
            addCartItems(cartItem)
        })
    })
}

function setCartValuesDom(cart) {
    let itemTotal = 0
    let precioTotal = 0
    cart.map(item => {
        itemTotal += item.cantidad
        precioTotal += item.price * item.cantidad
    })
    cartItems.innerHTML = itemTotal
    totalPrice.innerHTML = precioTotal
}

function addCartItems(cartItem) {
    const div = document.createElement('div')
    div.classList.add('cart-item')
    div.innerHTML = `
    <img src=${cartItem.image.url} alt="image" class='img-cardItems'>
    <div>
        <h3>${cartItem.title}</h3>
        <h5>$${cartItem.price}</h5>
        <span class="delete-item" data-id=${cartItem.id}>Eliminar</span>
    </div>
    <div>
        <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
        <p class="item-amount">${cartItem.cantidad}</p>
        <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
    </div>
    `
    contentInCart.appendChild(div)
}

function mostrarCartenElDom() {
    cart = getCart()
    setCartValuesDom(cart) //this
    cart.forEach(item => addCartItems(item))
    cartBtn.addEventListener('click', showCart)
    closeCart.addEventListener('click', removeCart)
}

function showCart() {
    cartContainer.classList.add('transparentBcg')
    cartDom.classList.add('showCart')
}

function removeCart() {
    cartContainer.classList.remove('transparentBcg')
    cartDom.classList.remove('showCart')
}

//funciones para eliminar

function clearCart() {
    deleteCart.addEventListener('click', (e) => {
        let cartItems = cart.map(item => item.id)
        cartItems.forEach(id => removeItems(id))

        while (contentInCart.children.length > 0) { //elimina todo, no del local storage
            contentInCart.removeChild(contentInCart.children[0])
        }
    })
}

function removeItems(id) {
    cart = cart.filter(item => item.id !== id) //=== funciona, probar
    setCartValuesDom(cart)
    saveInCart(cart)

    let button = buttonsDom.find(button => button.dataset.id === id)
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>Agregar al carrito`
    button.classList.add('agregarCarrito')
    button.disabled = false
}

function buttonsDelete() {
    contentInCart.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-item')) {
            let deleteItem = e.target
            let id = deleteItem.dataset.id
            contentInCart.removeChild(deleteItem.parentElement.parentElement)
            removeItems(id)
        }
        else if (e.target.classList.contains('fa-chevron-up')) {
            let subirCantidad = e.target
            let id = subirCantidad.dataset.id
            let itemsTotal = cart.find(item => item.id === id)
            itemsTotal.cantidad = itemsTotal.cantidad + 1
            setCartValuesDom(cart)
            subirCantidad.nextElementSibling.innerHTML = itemsTotal.cantidad

            saveInCart(cart)
        }
        else if (e.target.classList.contains('fa-chevron-down')) {
            let bajarCantidad = e.target
            let id = bajarCantidad.dataset.id
            let itemsTotal = cart.find(item => item.id === id)
            itemsTotal.cantidad = itemsTotal.cantidad - 1

            if (itemsTotal.cantidad > 0) {
                bajarCantidad.previousElementSibling.innerHTML = itemsTotal.cantidad
                setCartValuesDom(cart)
                saveInCart(cart)
            } else {
                contentInCart.removeChild(bajarCantidad.parentElement.parentElement)
                removeItems(id)
            }
        }
    })
}

//local storage

function saveProductsLocalStorage(products) {
    localStorage.setItem('products', JSON.stringify(products))
}

function getProductsLocalStorage(id) {
    let products = JSON.parse(localStorage.getItem('products'))
    return products.find(product => product.id === id)
}

function saveInCart(cart) {
    localStorage.setItem('cart2', JSON.stringify(cart))
}

function getCart() {
    return localStorage.getItem('cart2') ? JSON.parse(localStorage.getItem('cart2')) : []
}



