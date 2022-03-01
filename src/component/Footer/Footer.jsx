//import react
import React from 'react';

//import css file
import "./css/footer.css";


class Footer extends React.Component {
    render() {
        return (
            // footer section
            <div
                style={{
                    backgroundColor: "white",
                    height: "5vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <p className="copyrightText">
                    Copyright &#169; 2021 <span className="copyrightSpan">BeOne Solution</span>
                </p>
            </div>
        )
    }
}


export default Footer;