import React from "react"
import Navbar from "../component/Navbar"
import TransactionsList from "../component/TransactionsList"
import { base_url, product_image_url } from "../Config";
import $ from "jquery"
import axios from "axios"

class Transaction extends React.Component {
    constructor(){
        super()
        /**
         * pembuatan state untuk halaman transactions
         * logika percabangan if -> untuk mengecek apakah user yang mengakses telah melakukan login
            sebagai admin atau belum (karena hal.admin tidak bolleh diakses oleh sembarang user)
         */
        this.state = {
            token: "",
            transaction: [],
            selectedItem: null
        }

        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
    }

    // function headerConfig -> untuk memberikan header berupa bearer token sebagai request API
    // sebelum mengakses data
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    // function getTransaction -> untuk mengakses API get transaction
    getTransaction = () => {
        let url = base_url + "/transaksi"

        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({transaction: response.data})
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

    // akses getTransaction pada componentDidMount
    componentDidMount() {
        this.getTransaction()
    }

    render(){
        return (
            <div>
                <Navbar />

                <div className="container">
                    <h3 className="text-bold text-info mt-2">Transactions List</h3>
                    { this.state.transaction.map(item => (
                        <TransactionsList
                        key = {item.transaksi_id}
                        transaction_id = {item.transaksi_id}
                        customer_name = {item.customer.name}
                        customer_address = {item.customer.address}
                        time = {item.waktu}
                        products = {item.detail_transaksi}
                         />
                    )) }
                </div>
            </div>
        )
    }
}
export default Transaction;