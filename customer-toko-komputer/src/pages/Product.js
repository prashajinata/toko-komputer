import React from "react"
import Navbar from "../component/Navbar"
import ProductList from "../component/ProductList"
import { base_url, product_image_url } from "../Config";
import axios from "axios"

export default class Product extends React.Component {
    constructor() {
        super()
        // pembuatan state yang dibutuhkan untuk halaman product
        this.state = {
            products: [],
            token: ""
        }

        // logika percabangan if -> untuk mengecek apakah user yg mengakses telah
        // melakukan login sebagai admin atau belum
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }

        this.headerConfig.bind(this)
    }

    // tambahkan function header config -> untuk memberikan header berupa 'beare token'
    // sebagai request API sebelum mengakses data
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    // function getProduct -> untuk mengakses API get product
    getProduct = () => {
        let url = base_url + "/product"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({products: response.data})
        })
        .catch(error => {
            if (error.response) {
                if(error.response.status) {
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            } else {
                console.log(error);
            }
        })
    }

    // akses fungsi getProduct pada componentDidMount
    componentDidMount() {
        this.getProduct()
    }

    // function addToCart -> untuk menambahkan produk yg dipilih pada keranjang yg disimpan
    // pada local storage
    addToCart = (selectedItem) => {
        // membuat sebuah variabel untuk menampung cart sementara
        let tempCart = []

        // cek eksistensi dari data cart pada localStorage
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
            // JSON.parse() -> untuk mengkonversi dari string ke array object
        }

        // cek data yg dipilih user ke keranjang belanja
        let existItem = tempCart.find(item => item.product_id === selectedItem.product_id)

        if(existItem) {
            // jika item yg dipilih ada pada keranjang belanja
            window.alert(`Anda telah memilih ${selectedItem.name}`)
        }else {
            // user diminta memasukkan jumlah item yg dibeli
            let promptJumlah = window.prompt(`Memasukkan jumlah ${selectedItem.name} yang dibeli`, "")

            if (promptJumlah !== null && promptJumlah !== "") {
                // jika user memasukkan jumlah item yg dibeli
                // menambahkan properti "jumlahBeli" pada item yg dipilih
                selectedItem.qty = promptJumlah

                // memasukkan item yg dipilih ke dalam carrt
                tempCart.push(selectedItem)

                // simpan array tempCart ke localStorage
                localStorage.setItem("cart", JSON.stringify(tempCart))
            }
        }
    }

    render() {
        return(
            <div>
                <Navbar />
                <div className="container">
                    <h3 className="text-bold text-info mt-2">Product List</h3>
                    <div className="row">
                        { this.state.products.map( item => (
                            <ProductList
                                key = {item.product_id}
                                name = {item.name}
                                price = {item.price}
                                stock = {item.stock}
                                image = {product_image_url + "/" + item.image}
                                onCart = {() => this.addToCart(item)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}