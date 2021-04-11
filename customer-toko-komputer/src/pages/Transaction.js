import React from "react"
import Navbar from "../component/Navbar"
import { base_url } from "../Config";
import axios from "axios"
import TransactionList from "../component/TransactionList"

export default class Transaction extends React.Component {
    constructor() {
        super()
        // siapkan state yang dibutuhkan pada halaman transaksi
        this.state = {
            token: "",
            customer: null,
            transaction: []
        }

        // logika percabangan if -> untuk mengecek apakah user yg mengakses telah melakukan
        // login atau belum
        if (localStorage.getItem("token") && localStorage.getItem("customer")) {
            this.state.token = localStorage.getItem("token")
            this.state.customer = JSON.parse(localStorage.getItem("customer"))
        } else {
            window.location = "/login"
        }
    }

    // function header config -> untuk memberikan header berupa 'beare token'
    // sebagai request API sebelum mengakses data
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    // function getTransaction -> untuk mengakses API get transaction
    getTransaction = () => {
        let url = base_url + "/transaksi/" + this.state.customer.customer_id

        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({transaction: response.data})
            console.log(this.state.transaction)
        })
        .catch(error => {
            if(error.response) {
                if(error.response.status) {
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            } else {
                console.log(error);
            }
        })
    }

    // akses fugsi getTransaction pada componentDidMouth
    componentDidMount() {
        this.getTransaction()
    }

    render() {
        return(
            <div>
                <Navbar />
                <div className="container">
                    <h3 className="text-bold text-info mt-2">
                        Transaction List
                    </h3>

                    { this.state.transaction.map(item => (
                        // <h1>{item.transaksi_id}</h1>
                        <TransactionList 
                            key = {item.transaksi_id}
                            transaction_id = {item.transaksi_id}
                            customer_name = {item.customer.name}
                            customer_adress = {item.customer.address}
                            time = {item.waktu}
                            products = {item.detail_transaksi}
                        />
                    ))}
                </div>
            </div>
        )
    }
}