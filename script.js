
// Personal Greeting
document.getElementById("start-btn").addEventListener("click", function(){
    const userName = document.getElementById("username").value
    const greeting = document.getElementById("greeting")
    if (userName) {
        greeting.textContent = `Hi ${userName}! We have some great gift recs for you right here!`
    } else {
        greeting.textContent = `Welcome to the Barbary Gift Shop ❤️`
    }
})

const reviewForm = document.getElementById("review-form")
const reviewList = document.getElementById("review-list")

reviewForm.addEventListener("submit", function(e){
    e.preventDefault()

    const reviewText = document.getElementById("review-text").value
    const reviewerName = document.getElementById("reviewer-name").value || "Anonymous"

    if (reviewText === "" ){
        alert("Cannot submit empty field!")
        return
    }
    
    // Create new rvw element
    const review = document.createElement("div")
    review.classList.add("review")
    review.innerHTML = `<b>${reviewerName}</b><p>${reviewText}</p>`

    // Append new rvw to list
    reviewList.appendChild(review)

    // Clear form
    reviewForm.reset()
})

const cart = []

const  items = document.querySelectorAll(".item") 

// Increment/decrement
 items.forEach( item => {
    const incrementButton = item.querySelector(".increment") 
    const decrementButton = item.querySelector(".decrement") 
    const quantityElement = item.querySelector(".quantity")
    const itemName = item.querySelector(".item-name").textContent
    const itemPrice = parseFloat(item.querySelector(".item-price").textContent.replace(/[$,]/g, ""))
    
        incrementButton.addEventListener("click", function() {
            let quantity = parseInt(quantityElement.textContent) 
            quantity++ 
            quantityElement.textContent = quantity 
            updateCart(itemName, itemPrice, quantity) 
        })

        decrementButton.addEventListener("click", function() {
            let quantity = parseInt(quantityElement.textContent) 
            if (quantity > 0) {
                quantity-- 
                quantityElement.textContent = quantity 
                updateCart(itemName, itemPrice, quantity) 
            }
        })

})

function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        
    }).format(price)
}

function parsePrice(priceText) {
    return parseFloat(priceText.replace(/[^0-9.]+/g, ""))
}

function updateCart(itemName, itemPrice, quantity) {
    const itemIndex = cart.findIndex(cartItem => cartItem.name === itemName) 
    if (itemIndex !== -1) {
        if (quantity === 0) {
            cart.splice(itemIndex, 1) 
        } else {
            
            cart[itemIndex].quantity = quantity 
        }
    } else if (quantity > 0) {
        cart.push({ name: itemName, quantity, price: itemPrice }) 
    }    
    updateTotalPrice()
    updateCheckoutButtonState()
}

function updateTotalPrice(){
    let totalPrice = 0
    cart.forEach(item => {
        totalPrice += item.price * item.quantity
    })
    const formattedTotalPrice = formatPrice(totalPrice)
    document.getElementById("total-price").textContent = formattedTotalPrice
}

//Quantity validation
function updateCheckoutButtonState() {
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0)
    const checkoutBtn = document.getElementById("checkout-btn")

    if (totalQuantity > 0) {
        checkoutBtn.disabled = false
    } else {
        checkoutBtn.disabled = true
    }
}
    

//Open modal
const modal = document.getElementById("checkout-modal")
document.getElementById("checkout-btn").addEventListener("click", function(){
    modal.style.display = "block"

    const orderItemsDiv = document.getElementById("order-items")
    orderItemsDiv.innerHTML = ""

    let totalPrice = 0
    cart.forEach(item => {
        const itemRow = document.createElement("p")
        const formattedItemPrice = formatPrice(item.price * item.quantity)
        itemRow.textContent = `${item.name} x ${item.quantity} - ${formattedItemPrice}`
        orderItemsDiv.appendChild(itemRow)
        totalPrice += item.price * item.quantity
    })
    document.getElementById("total-price").textContent = formatPrice(totalPrice)
})


// Close modal
document.getElementById("close-modal").addEventListener("click", function(){
    modal.style.display = "none"
    clearPaymentFields()
})



// Validations
document.getElementById("card-name").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, "")
})

document.getElementById("card-number").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "")
})
document.getElementById("cvv").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "")
})
document.getElementById("expiration").addEventListener("input", function (e) {
    const expirationInput = e.target.value.replace(/\D/g, "")
    const errorElement = document.getElementById("expiration-error")

    let formattedInput = expirationInput
    

    if (formattedInput.length > 2) {
        formattedInput = `${formattedInput.slice(0, 2)}/${formattedInput.slice(2)}`
    }
    e.target.value = formattedInput

    if (formattedInput.length === 5) {
        const [month, year] = formattedInput.split("/")
        if (month && (parseInt(month) < 1 || parseInt(month) > 12)) {
        errorElement.textContent = "Month must be between 01 and 12"
        e.target.classList.add("invalid-input")
        } else {
            errorElement.textContent = ""
            e.target.classList.remove("invalid-input")
        }
            
        if (year) {
            const currentYear = new Date().getFullYear() % 100
            const maxYear = currentYear + 10

            if (year && (parseInt(year) < currentYear || parseInt(year) > maxYear)) {
                errorElement.textContent = `Year must be between ${currentYear} and ${maxYear}`
                e.target.classList.add("invalid-input")
                
            } else if (!errorElement.textContent) {
                errorElement.textContent = ""
                e.target.classList.remove("invalid-input")
            }
        }
    }

})

function validateExpirationDate(expirationDate) {
    const [month, year] = expirationDate.split("/")

    if (!month || !year || expirationDate.length !== 5) {
        return false // Invalid format
    }

    const currentYear = new Date().getFullYear() % 100
    const maxYear = currentYear + 10

    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false // Invalid month
    }

    if (parseInt(year) < currentYear || parseInt(year) > maxYear) {
        return false // Invalid year
    }

    return true
}

// Clear input fields function
function clearPaymentFields() {
    document.getElementById("card-name").value = ""
    document.getElementById("card-number").value = ""
    document.getElementById("expiration").value = ""
    document.getElementById("cvv").value = ""
    document.getElementById("expiration-error").textContent = ""

// Form submission
const paymentForm = document.getElementById("payment-form")
const expirationInput = document.getElementById("expiration")
const expirationError = document.getElementById("expiration-error")

paymentForm.addEventListener("submit", function(e) {
    const expirationDate = expirationInput.value.trim()
    const isValid = validateExpirationDate(expirationDate)

    if (!isValid) {
        e.preventDefault()
        expirationError.textContent = "Invalid expiration date. Please enter a valid month and year"
        expirationError.style.color = "red"
        clearPaymentFields()
    }else {
        expirationError.textContent = ""
        e.preventDefault()
        
// Accept payment info


    const cardName = document.getElementById("card-name").value
    const cardNumber = document.getElementById("card-number").value
    const expirationDate = document.getElementById("expiration").value
    const cvv = document.getElementById("cvv")
    

    if (cardName && cardNumber && expirationDate && cvv){
        alert("Payment successful!")
        modal.style.display = "none"
        clearPaymentFields()
    } else {
        alert("Please complete payment information.")
        clearPaymentFields()
    }   

    }
})
}
