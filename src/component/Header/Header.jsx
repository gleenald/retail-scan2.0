//import React
import React, { Component } from 'react';

//import image
import OndaLogo from "./../../utils/img/ONDA-LOGO3.png";

//import css file
import "./css/Header.css";

//import devExtreme
import 'devextreme/dist/css/dx.light.css';
import {
    Button,
    Popup
} from 'devextreme-react';

//import rect-router-dom
import { withRouter } from 'react-router-dom';

//import telegram-log
import { TelegramLogger } from 'node-telegram-log';



//setup telegram logger
const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-773570755");


class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {

            //untuk status popup di header component
            isLogout: false,
            isTryCatchErr: false,

            //button-attributes devextreme
            buttonAttributes: {
                class: 'myClass'
            },

            //untuk simpan pesan error
            tryCatchErrMsg: "",

        }
    }

    //FUNCTION SET STATE POPUP STATUS
    enableLogout = () => {
        try {
            this.setState({ isLogout: true })
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald App Error! function enableLogout(), Header Component msg: ${err}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }
    disableLogout = () => {
        try {
            this.setState({
                isLogout: false
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function disableLogout(), Header Component msg: ${err}`)
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
            console.log(err);
            logger.error(`@Gleenald App Error! function disableTryCatchErr(), Header Component msg: ${err}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }


    //FUNCTION LOGOUT
    logout = () => {
        try {
            this.props.history.push({
                pathname: '/'
            })
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald App Error! function logout(), Header Component msg: ${err}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }

    render() {
        return (
            <div
                style={{
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    height: "9vh"
                }}
            >
                {/* Logo Section */}
                <img
                    src={OndaLogo}
                    className="img"
                />

                {/* Left ButtonGroup Section */}
                <div
                    style={{
                        backgroundColor: "white",
                        height: "100%",
                        width: "70%",
                        marginTop: "-13px",
                        display: "flex",
                        alignItems: "center"
                    }}
                >


                </div>

                {/* Right ButtonGroup Section */}
                <div
                    style={{
                        backgroundColor: "white",
                        height: "100%",
                        width: "10%",
                        marginTop: "-13px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Button
                        text="Logout"
                        stylingMode='text'
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                        }}
                        disabled={false}
                        onClick={this.enableLogout}
                    />
                </div>



                {/* SEMUA POPUP YANG ADA DI COMPONENT HEADER */}
                {/* Popup Logout */}
                <div>
                    <Popup
                        visible={this.state.isLogout}
                        closeOnOutsideClick={true}
                        width={450}
                        height={230}
                        showTitle={false}
                        onHiding={this.disableLogout}
                    >
                        <h2>Akun</h2>
                        <p>Apakah anda ingin keluar ?</p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-end',
                                marginTop: 35
                            }}
                        >
                            <Button
                                text={'Tidak'}
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableLogout}
                                elementAttr={this.state.buttonAttributes}
                            />
                            <Button
                                text={'Ya'}
                                width='80'
                                style={{
                                    marginLeft: 20
                                }}
                                type="default"
                                onClick={this.logout}
                                elementAttr={this.state.buttonAttributes}
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
        );
    }
}

export default withRouter(Header);