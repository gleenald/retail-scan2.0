//import react
import React, { Component } from 'react';

//import component
import Header from "./../../component/Header/Header";
import HomeBody from "./Body/HomeBody";
import Footer from "./../../component/Footer/Footer"



class Home extends Component {
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
                        height: "82vh"
                    }}
                >
                    <HomeBody />
                </div>

                <Footer />

            </div>
        );
    }
}

export default Home;