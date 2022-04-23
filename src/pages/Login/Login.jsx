//import react
import React, { Component } from 'react'

//import image yang dibutuhkan
import BG from "./../../utils/img/LoginWallpaper.png"
import BeOneLogo from "./../../utils/img/BEONE-LOGO2.png";
import OndaLogo from "./../../utils/img/ONDA-LOGO2.png";

//import baseURL
import { baseURL } from "./../../utils/config/config";

//import css
import "./Login.css"

//import react-activity
import { Dots } from "react-activity";
import "react-activity/dist/Dots.css";


//import devExtreme
import {
    TextBox,
    Button,
    Popup
} from 'devextreme-react';

//import node-telegram-log
import { TelegramLogger } from 'node-telegram-log';

//import react-router-dom
import { withRouter } from 'react-router-dom';



//setup telegram logger
const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-773570755");


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {

            //untuk status popup di halaman login
            isLoading: false,
            isClientSideErr: false,
            isServersideError: false,
            isTryCatchErr: false,

            //status alert user/pass salah
            wrongAlert: "none",

            //user value di textinput
            usernameVal: "",
            passwordVal: "",

            //button-attributes devextreme
            buttonAttributes: {
                class: 'myClass'
            },

            //buat simpen msg err
            errMsg: "",
            tryCatchErrMsg: "",
        }
    }

    //FUNCTION SET STATE POPUP STATUS
    disableClientSideErr = () => {
        try {
            this.setState({
                isClientSideErr: false
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function disableClientSideErr(), Halaman Login, msg: ${err}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }

    disableServerSideErr = () => {
        try {
            this.setState({
                isServersideError: false
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function disableServerSideErr(), Halaman Login, msg: ${err}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }

    disableTryCatchErr = () => {
        try {
            this.setState({
                isTryCatchErr: false
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function disableTryCatchErr(), Halaman Login, msg: ${err}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }


    //TESTING FETCH FUNCTION
    fetchTest = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBULiBTSU5BUiBBU0lBIEpBWUEiLCJ1c2VyaWQiOiJDT05CLTAwNzctMDAwMCIsImVtYWlsIjoic3VwcGx5Y2hhaW4wMy5vbmRhQGdtYWlsLmNvbSIsImlhdCI6MTY0NTUwNDgzMSwiZXhwIjoxNjQ2NzE0NDMxfQ.RHXT-4jIGT_grtPVCWyXI3AH8d5MAdcT5tjLqcOzb7A");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "TransNo": "1640057548905",
            "AbsEntry": "12553",
            "DeliveryDetails": [
                {
                    "ItemCode": "FODPLUPL03-0001001",
                    "Qty": 1
                },
                {
                    "ItemCode": "FOESANPL02-0005204",
                    "Qty": 1
                }
            ]
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const res = await fetch(`${baseURL}/delivery`, requestOptions)
        const stat = await res.status;
        const data = await res.json()

        console.log(stat)
        console.log(data)

        //logger.log('hore berhasil panggil fetch di retail')

    }


    //FUNCTION LOGIN
    login = async () => {
        try {
            //nyalain popup loading
            this.setState({ isLoading: true })

            //fetch
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9uZGEiLCJpYXQiOjE2MzUyMzE4MDksImV4cCI6MTYzNjQ0MTQwOX0.LUJyq4di-BG8SlR-q90JxsCaBW_dAB__rN3eblNbspI");
            myHeaders.append("Access-Control-Allow-Origin", "*")

            var raw = JSON.stringify({
                "Username": this.state.usernameVal,
                "Password": this.state.passwordVal
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/login`, requestOptions)
            const stat = await res.status
            const data = await res.json()

            console.log(stat)
            console.log(data)

            if (stat >= 200 && stat <= 300) {
                //masukin token dan username ke internal db
                localStorage.setItem('UserToken', data.token)
                localStorage.setItem('Username', this.state.usernameVal)

                //lanjut ke page berikutnya
                this.props.history.push({
                    pathname: "/home"
                })

                //matiin popup loading
                this.setState({ isLoading: false })

                //logger-telegram keluar
                logger.log(`username ${window.localStorage.getItem("Username")} login ke retail scan`)
            }
            if (stat >= 400 && stat <= 500) {

                //console keluar
                console.log(data.description)

                //alert error keluar utk user
                this.setState({
                    errMsg: data.description,
                    isLoading: false,
                    isClientSideErr: true
                })

                //logger-telegram keluar
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function login() halaman Login, msg: ${data.description}`)
            }
            if (stat >= 500 && stat <= 600) {

                //console keluar
                console.log(data.description)

                //alert error keluar utk user
                this.setState({
                    errMsg: data.description,
                    isLoading: false,
                    isServersideError: true
                })

                //logger-telegram keluar
                logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function login() halaman Login, msg: ${data.description}`)
            }
        }
        catch (err) {

            //console keluar
            console.log(err)

            //alert error keluar utk user
            this.setState({
                isLoading: false,
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })

            //logger-telegram keluar
            logger.error(`@Gleenald App Error! function login() halaman Login msg: ${err}`)

        }
    }



    render() {
        return (
            <div
                style={{
                    backgroundImage: `url(${BG})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    height: "100vh",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {/* White Box Section */}
                <div
                    style={{
                        backgroundColor: "white",
                        height: 550,
                        width: 887,
                        borderRadius: 50,
                        borderStyle: "solid",
                        borderWidth: "10px",
                        borderColor: "rgba(224, 224, 224, 1)",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >

                    {/* Logo Section */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginTop: '50px'
                        }}
                    >
                        <img src={BeOneLogo} style={{ width: "192px", height: "108px" }} />
                        <img src={OndaLogo} style={{ width: "192px", height: "108px", marginTop: '15px', marginLeft: '50px' }} />
                    </div>


                    {/* TextBox Section */}
                    <div>
                        <p>Username : </p>
                        <TextBox

                            placeholder="masukkan username anda disini"
                            width={675}
                            height={50}
                            style={{
                                borderRadius: 15,
                            }}
                            onValueChange={
                                (y) => {
                                    this.setState({ usernameVal: y })
                                }
                            }
                        >

                        </TextBox>
                    </div>

                    <div>
                        <p>Password : </p>
                        <TextBox
                            mode={'password'}
                            placeholder="masukkan password anda disini"
                            width={675}
                            height={50}
                            style={{
                                borderRadius: 15,
                            }}
                            onValueChange={
                                (y) => {
                                    this.setState({ passwordVal: y })
                                }
                            }
                            onEnterKey={this.login}
                        >

                        </TextBox>
                    </div>

                    {/* Alert Username / Password Salah */}
                    <p
                        style={{
                            color: 'red',
                            display: `${this.state.wrongAlert}`

                        }}
                    >
                        Username / Password yang anda masukkan salah !
                    </p>

                    {/* Bottom Button Section */}
                    <div
                        style={{
                            marginTop: "40px",

                        }}
                    >
                        <Button
                            text="Login"
                            type="default"
                            stylingMode="contained"
                            width={200}
                            height={55}
                            elementAttr={this.state.buttonAttributes}
                            style={{
                                fontSize: 24,
                                borderRadius: 10,
                                // backgroundColor: 'rgba(0, 86, 184, 1)'
                            }}
                            onClick={this.login}
                        />

                    </div>



                    {/* SEMUA POPUP YANG ADA DI HALAMAN LOGIN */}
                    {/* Popup loading */}
                    <div>
                        <Popup
                            visible={this.state.isLoading}
                            showTitle={false}
                            width={100}
                            height={100}
                        >
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Dots />
                                <p>Loading</p>
                            </div>
                        </Popup>
                    </div>

                    {/* Popup Err 400 */}
                    <div>
                        <Popup
                            visible={this.state.isClientSideErr}
                            closeOnOutsideClick={true}
                            onHiding={this.disableClientSideErr}
                            showTitle={false}
                            width={587}
                            height={220}
                            className="PopupServersideError"
                        >
                            <div>
                                <p className="MainTitle">
                                    Error!
                                </p>
                            </div>

                            <div>
                                <p className="msg">
                                    Oops.., Err HTTP Stat:400! {this.state.errMsg}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginTop: 30
                                }}
                            >
                                <Button
                                    text='Ok'
                                    stylingMode='contained'
                                    type='default'
                                    width={100}
                                    elementAttr={this.state.okBtnAttr}
                                    onClick={this.disableClientSideErr}

                                />
                            </div>
                        </Popup>
                    </div>

                    {/* Popup Err 500 */}
                    <div>
                        <Popup
                            visible={this.state.isServersideError}
                            closeOnOutsideClick={true}
                            onHiding={this.disableServerSideErr}
                            showTitle={false}
                            width={587}
                            height={220}
                            className="PopupServersideError"
                        >
                            <div>
                                <p className="MainTitle">
                                    Error!
                                </p>
                            </div>

                            <div>
                                <p className="msg">
                                    Oops.., Err HTTP Stat:500! {this.state.errMsg}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginTop: 30
                                }}
                            >
                                <Button
                                    text='Ok'
                                    stylingMode='contained'
                                    type='default'
                                    width={100}
                                    elementAttr={this.state.okBtnAttr}
                                    onClick={this.disableServerSideErr}
                                />
                            </div>
                        </Popup>
                    </div>

                    {/* Popup TryCatch Err */}
                    <div>
                        <Popup
                            visible={this.state.isTryCatchErr}
                            closeOnOutsideClick={true}
                            onHiding={this.disableTryCatchErr}
                            showTitle={false}
                            width={587}
                            height={220}
                            className="PopupServersideError"
                        >
                            <div>
                                <p className="MainTitle">
                                    Error!
                                </p>
                            </div>

                            <div>
                                <p className="msg">
                                    Oops.., Aplikasi Error! {this.state.tryCatchErrMsg}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginTop: 30
                                }}
                            >
                                <Button
                                    text='Ok'
                                    stylingMode='contained'
                                    type='default'
                                    width={100}
                                    elementAttr={this.state.okBtnAttr}
                                    onClick={this.disableTryCatchErr}
                                />
                            </div>
                        </Popup>
                    </div>

                </div>
            </div>
        );
    }
}

export default withRouter(Login);