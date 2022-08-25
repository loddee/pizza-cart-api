document.addEventListener('alpine:init', () => {

    Alpine.data('pizzaCartWithAPIWidget', function() {
        return {
            init() {
                axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                    .then((result) => {

                        this.pizzas = result.data.pizzas
                    })
                    .then(() => {
                        return this.createCart();
                    })
                    .then((result) => {
                        console.log(result.data);
                        this.cartId = result.data.cart_code;
                    });

            },
            createCart() {
                return axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
            },
            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
                axios
                    .get(url)

                .then((result) => {
                    this.cart = result.data;
                });
            },
            pizzaImage(pizza) {
                return `img/${pizza.size}.png`
            },
            message: 'Loddy Eating pizza',
            username: 'Loddee ',
            cartId: '',
            pizzas: [],
            cart: {},
            cart: { total: 0 },
            paymentMessage: '',
            paymentAmount: 0,


            add(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => this.message = "pazza added to cart")
                    .catch(err => alert(err));
                this.message = "pizza added to cart"
                this.showCart();

            },

            remove(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                    .then(() => {
                        this.message = "Pizza removed from cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));
            },


            pay() {
                const params = {
                    cart_code: this.cartId,
                }
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                    .then(() => {
                        if (!this.paymentAmount) {
                            this.paymentMessage = 'No amount entered!'
                        } else if (this.paymentAmount >= this.cart.total.toFixed(2)) {
                            this.paymentMessage = 'Payment Sucessful!'
                            this.message = this.username + " Paid!"
                            setTimeout(() => {
                                this.cart.total = 0;
                                this.paymentAmount = 0;
                                this.paymentMessage = '';
                                this.message = '';
                            }, 3000);
                        } else {
                            this.paymentMessage = 'You do not have enough money!'
                            setTimeout(() => {
                                this.cart.total = '';
                            }, 3000);
                        }
                    })
                    .catch(err => alert(err));
            },
        }
    });
})