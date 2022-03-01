//import react
import React, { Component } from 'react';

//import component
import Header from "./../../component/Header/Header";
import Footer from "./../../component/Footer/Footer";
import SetPackagingBody from './Body/SetPackagingBody';

class SetPackaging extends Component {

    render() {
        return (
            <div
                style={{
                    backgroundColor: "#E5EEF8"
                }}
            >
                <Header />

                <div
                    style={{
                        backgroundColor: "#E5EEF8",
                        height: "132vh"
                    }}
                >
                    <SetPackagingBody />
                </div>



            </div>
        );
    }
}

export default SetPackaging;