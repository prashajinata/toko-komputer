import React from "react"
import Navbar from "../component/Navbar"
import axios from "axios"
import { base_url } from "../Config";
import $ from "jquery"

class Admin extends React.Component {
    constructor(){
        super()
        /**
         * siapkan state untuk pembuatan halaman admin
         * logika percabangan if -> untuk mengecek apakah user yg mengakses telah melakukan login
            sebagai admin atau belum (karena hal.admin tidak boleh diakses sembarang user)
         */
        this.state = {
            token: "",
            action: "",
            admins: [],
            admin_id: "",
            name: "",
            username: "",
            password: "",
            fillPassword: true
        }

        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
    }

    // function headerConfig -> untuk memberikan header berupa 'bearer token' sebagai request
    // API sebelum mengakses data
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    // function getAdmins -> untuk mengakses API get admin
    getAdmins = () => {
        let url = base_url + "/admin"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({admins: response.data})
        })
        .catch(error => {
            if (error.response) {
                if (error.response.status) {
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            } else {
                console.log(error);
            }
        })
    }

    // akses getAdmins pada componentDidMount
    componentDidMount() {
        this.getAdmins()
    }

    // function Add -> untuk memberikan inisialisasi data dan menampilkan modal untuk menambah data
    Add = () => {
        $("#modal_admin").modal("show")
        this.setState({
            action: "insert",
            admin_id: 0,
            name: "",
            username: "",
            password: "",
            fillPassword: true,
        })
    }

    // function Edit -> untuk memberikan inisialisasi data dan menampilkan modal untuk mengedit data
    Edit = selectedItem => {
        $("#modal_admin").modal("show")
        this.setState({
            action: "update",
            admin_id: selectedItem.admin_id,
            name: selectedItem.name,
            username: selectedItem.username,
            password: "",
            fillPassword: false,
        })
    }

    // function saveAdmin -> untuk menyimpan data pada db dengan mengakses API
    saveAdmin = event => {
        event.preventDefault()
        $("#modal_admin").modal("hide")
        let form = {
            admin_id: this.state.admin_id,
            name: this.state.name,
            username: this.state.username
        }

        if (this.state.fillPassword) {
            form.password = this.state.password
        }

        let url = base_url + "/admin"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getAdmins()
            })
            .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getAdmins()
            })
            .catch(error => console.log(error))
        }
    }

    // function dropAdmin -> untuk menghapus data
    dropAdmin = selectedItem => {
        if (window.confirm("are you sure will delete this item ?")) {
            let url = base_url + "/admin" + selectedItem.admin_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getAdmins()
            })
            .catch(error => console.log(error))
        }
    }

    render(){
        return(
            <div>
                <Navbar />
                <div className="container">
                    <h3 className="text-bold text-info mt-2">Admin List</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.admins.map((item, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.username}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info m-1"
                                        onClick={() => this.Edit(item)}>
                                            Edit
                                        </button>

                                        <button className="btn btn-sm btn-danger m-1"
                                        onClick={() => this.dropAdmin(item)}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                       Add Admin
                    </button>
                    {/* modal admin  */}
                    <div className="modal fade" id="modal_admin">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-info text-white">
                                    <h4>Form Admin</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={ev => this.saveAdmin(ev)}>
                                        Admin Name
                                        <input type="text" className="form-control mb-1"
                                        value={this.state.name}
                                        onChange={ev => this.setState({name: ev.target.value})}
                                        required
                                        />

                                        Username
                                        <input type="text" className="form-control mb-1"
                                        value={this.state.username}
                                        onChange={ev => this.setState({username: ev.target.value})}
                                        required
                                        />

                                        { this.state.action === "update" && this.state.fillPassword === false ? (
                                            <button className="btn btn-sm btn-secondary mb-1 btn-block"
                                            onClick={() => this.setState({fillPassword: true})}>
                                                Change Password
                                            </button>
                                        ) : (
                                            <div>
                                                Password
                                                <input type="password" className="form-control mb-1"
                                                value={this.state.password}
                                                onChange={ev => this.setState({password: ev.target.value})}
                                                required
                                                />
                                            </div>
                                        ) }

                                        <button type="submit" className="btn btn-block btn-success">
                                            Simpan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Admin;