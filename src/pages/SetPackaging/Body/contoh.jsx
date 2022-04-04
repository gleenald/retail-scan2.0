if (this.state.print["ItemList"].length >= 28) {
    const item_list_len = this.state.print["ItemList"].length
    const len_page_one = item_list_len - 10;
    const modulus = len_page_one % 15

    if (modulus == 0) {
        const total_page = (len_page_one / 18) + 2;
        //buat display status
        let displayArr = [];

        for (var i = 0; i < total_page; i++) {
            if (i == 0) {
                displayArr.push('block')
            }
            if (i != 0) {
                displayArr.push('none')
            }
        }

        this.setState({ displayPrint4: displayArr }, () => {
            console.log(this.state.displayPrint4)
        })
        //buat dropdown
        let dropDown = []

        for (var i = 0; i < total_page; i++) {
            dropDown.push({
                id: i,
                text: `Halaman ${i + 1}`
            })
        }

        this.setState({ dropDown4: dropDown }, () => {
            console.log(this.state.dropDown4)
        })

        //buat idx slice
        let count = total_page - 2;
        let result = [];
        let awal = [10];
        let akhir = [];

        for (var i = 0; i < count; i++) {
            result.push(i)
        }

        for (var i = 0; i < count; i++) {
            awal.push(awal[i] + 18)
        }

        for (var i = 0; i < count; i++) {
            if (akhir.length == 0) {
                akhir.push(10 + 18)
            }
            if (akhir.length != 0) {
                akhir.push(akhir[i] + 18)
            }
        }

        this.setState({
            result: result,
            awal: awal,
            akhir: akhir
        }, () => { console.log(`${this.state.result}, ${this.state.awal}, ${this.state.akhir}`) })
    }
    if (modulus != 0) {
        const total_page = Math.floor(len_page_one / 15) + 3;

        let displayArr = [];

        for (var i = 0; i < total_page; i++) {
            if (i == 0) {
                displayArr.push('block')
            }
            if (i != 0) {
                displayArr.push('none')
            }
        }

        this.setState({ displayPrint4: displayArr }, () => {
            console.log(this.state.displayPrint4)
        })

        //buat dropdown
        let dropDown = [];

        for (var i = 0; i < total_page; i++) {
            dropDown.push({
                id: i,
                text: `Halaman ${i + 1}`
            })
        }

        this.setState({ dropDown4: dropDown }, () => {
            console.log(this.state.dropDown4)
        })

        //buat idx slice
        let count = total_page - 3;
        let result = [];
        let awal = [];
        let akhir = [];
        console.log(`count ${count}`)
        for (var i = 0; i < count; i++) {
            result.push(i)
        }

        for (var i = 0; i < count; i++) {
            if (i == 0) {
                awal.push(10)
            }
            if (i != 0) {
                awal.push(awal[i - 1] + 15)
            }
        }

        for (var i = 0; i < count; i++) {
            if (i == 0) {
                akhir.push(10 + 15)
            }
            if (i != 0) {
                akhir.push(akhir[i - 1] + 15)
            }
        }

        this.setState({
            result: result,
            awal: awal,
            akhir: akhir
        }, () => { console.log(`${this.state.result}, ${this.state.awal}, ${this.state.akhir}`) })

    }
}

// if (item_list_len >= 28) {
//     const len_page_one = item_list_len - 10
//     const modulus = len_page_one % 15

//     if (modulus == 0) {
//         let last = this.state.displayPrint4.length - 1
//         return (
//             <div>
//                 {/* halaman 1 (header + tabel 10 biji) */}
//                 <div
//                     style={{
//                         border: "2px solid black",
//                         height: "55.2vh",
//                         width: "50vw",
//                         backgroundColor: "white",
//                         display: this.state.displayPrint4[0]
//                     }}
//                 >
//                     {/* Package Name Section */}
//                     <div>
//                         <p
//                             style={{
//                                 fontWeight: "800",
//                                 marginLeft: "2px",
//                                 fontSize: 16,
//                                 marginTop: "0.5vh"
//                             }}
//                         >
//                             {this.state.print['PackageName'].toUpperCase()}
//                         </p>
//                     </div>

//                     {/* Alert barang mudah pecah */}
//                     <div
//                         style={{
//                             borderBottom: "2px solid black",
//                             display: "flex",
//                             flexDirection: "row",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             marginTop: "-3.0vh",
//                         }}
//                     >
//                         <p
//                             style={{
//                                 fontWeight: "800",
//                                 fontSize: 18,
//                                 marginBottom: "-0.01vh"
//                             }}
//                         >
//                             JANGAN DITERIMA BILA PEMBUNGKUS / SEAL RUSAK
//                         </p>
//                     </div>

//                     {/* Info1 Section */}
//                     <div
//                         style={{
//                             marginTop: "-0.7vh",
//                             marginBottom: "-0.7vh"
//                         }}
//                     >
//                         <p
//                             style={{
//                                 marginLeft: "2px",
//                                 fontWeight: "800",
//                                 fontSize: 15,
//                             }}
//                         >
//                             CUSTOMER&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["CustomerName"].toUpperCase()}
//                         </p>

//                         <div
//                             style={{
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 marginTop: "-2.7vh",
//                                 marginLeft: "2px",
//                                 height: "7.3vh"
//                             }}
//                         >
//                             <p
//                                 style={{
//                                     fontWeight: "800",
//                                     fontSize: 15,
//                                 }}
//                             >
//                                 NOTICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
//                             </p>
//                             <div>
//                                 <p
//                                     style={{
//                                         fontWeight: "800",
//                                         fontSize: 15,
//                                     }}
//                                 >
//                                     {this.state.print["Notice"].toUpperCase()}
//                                 </p>
//                             </div>
//                         </div>

//                         <p
//                             style={{
//                                 marginLeft: "2px",
//                                 fontWeight: "800",
//                                 marginTop: "-0.5vh",
//                                 fontSize: 15,
//                             }}
//                         >
//                             PICK&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["PickNo"]}
//                         </p>
//                         <p
//                             style={{
//                                 marginLeft: "2px",
//                                 fontWeight: "800",
//                                 marginTop: "-1vh",
//                                 fontSize: 15,
//                             }}
//                         >
//                             REF&nbsp;/&nbsp;PO&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["PONo"]}
//                         </p>

//                     </div>

//                     {/* Table Section */}
//                     <div
//                         style={{
//                             display: "flex",
//                             flexDirection: "row",
//                             justifyContent: 'center'
//                         }}
//                         className="print-table"
//                     >
//                         <table
//                             style={{
//                                 width: "750px",
//                                 borderCollapse: "collapse",
//                                 //borderBottom: "2px solid black"
//                             }}
//                         >
//                             <tr>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         borderLeft: "0px",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     NO
//                                 </th>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     NAMA BARANG
//                                 </th>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         borderRight: "0px",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     QTY PCS
//                                 </th>
//                             </tr>

//                             {item_list.slice(0, 10).map((element, y, z) => {
//                                 return (
//                                     <tr>
//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 height: "2.82vh",
//                                                 borderBottom: "0px"
//                                             }}
//                                         >
//                                             {item_list.slice(0, 10)[y].No}
//                                         </th>

//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 textAlign: "left",
//                                                 height: "2.82vh",
//                                                 borderBottom: "0px"
//                                             }}
//                                         >
//                                             {item_list.slice(0, 10)[y].ItemName}
//                                         </th>

//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 borderRight: "0px",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 borderBottom: "0px",
//                                                 height: "2.82vh",
//                                             }}
//                                         >
//                                             {item_list.slice(0, 10)[y].Qty}
//                                         </th>
//                                     </tr>
//                                 )
//                             })}

//                         </table>
//                     </div>

//                 </div>

//                 {/* halaman tabel item 18 biji */}
//                 {this.state.result.map((element, idx) => {
//                     return (
//                         <div
//                             style={{
//                                 border: "2px solid white",
//                                 height: "55.2vh",
//                                 width: "50vw",
//                                 backgroundColor: "white",
//                                 display: this.state.displayPrint4[idx + 1],
//                             }}
//                         >
//                             <div>
//                                 <table
//                                     style={{
//                                         width: "49.8vw",
//                                         borderCollapse: "collapse",
//                                         border: "2px solid black"
//                                     }}
//                                 >
//                                     <tr>
//                                         <th
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 border: "2px solid black",
//                                                 borderTop: "0px",
//                                                 borderLeft: "0px",
//                                                 height: "3.0vh"
//                                             }}
//                                         >
//                                             NO
//                                         </th>

//                                         <th
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 border: "2px solid black",
//                                                 height: "3.0vh",
//                                                 borderTop: "0px",
//                                             }}
//                                         >
//                                             NAMA BARANG
//                                         </th>

//                                         <th
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 border: "2px solid black",
//                                                 borderRight: "0px",
//                                                 height: "3.0vh",
//                                                 borderTop: "0px",
//                                             }}
//                                         >
//                                             QTY PCS
//                                         </th>


//                                     </tr>

//                                     {item_list.slice(this.state.awal[idx], this.state.akhir[idx]).map((element, index, self) => {

//                                         return (
//                                             <tr>
//                                                 <th
//                                                     style={{
//                                                         border: "2px solid black",
//                                                         fontSize: 14,
//                                                         fontWeight: "800",
//                                                         height: "2.67vh",
//                                                         //borderBottom: "0px"
//                                                     }}
//                                                 >
//                                                     {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["No"]}
//                                                 </th>

//                                                 <th
//                                                     style={{
//                                                         border: "2px solid black",
//                                                         fontSize: 14,
//                                                         fontWeight: "800",
//                                                         textAlign: "left",
//                                                         height: "2.67vh",
//                                                         //borderBottom: "0px"
//                                                     }}
//                                                 >
//                                                     {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["ItemName"]}
//                                                 </th>

//                                                 <th
//                                                     style={{
//                                                         border: "2px solid black",
//                                                         borderRight: "0px",
//                                                         fontSize: 14,
//                                                         fontWeight: "800",
//                                                         height: "2.67vh",
//                                                     }}
//                                                 >
//                                                     {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["Qty"]}
//                                                 </th>
//                                             </tr>
//                                         )
//                                     })}
//                                 </table>
//                             </div>

//                         </div>
//                     )
//                 })}

//                 {/* halaman terakhir (footer packer) */}
//                 <div
//                     style={{
//                         border: "2px solid white",
//                         height: "55.2vh",
//                         width: "50vw",
//                         backgroundColor: "white",
//                         display: this.state.displayPrint4[last]
//                     }}
//                 >
//                     {/* Info2 & Alert 2 Section */}
//                     <div
//                         style={{
//                             marginTop: "-1.25vh",
//                             border: "2px solid black"
//                         }}
//                     >
//                         <div
//                             style={{
//                                 borderBottom: "2px solid black",
//                                 height: "5.5vh"
//                             }}
//                         >
//                             <p
//                                 style={{
//                                     marginLeft: "2px",
//                                     fontWeight: "800",
//                                     fontSize: 15,
//                                 }}
//                             >
//                                 PACKER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {this.state.print["Packer"].toUpperCase()}
//                             </p>
//                             <p
//                                 style={{
//                                     marginLeft: "2px",
//                                     fontWeight: "800",
//                                     fontSize: 15,
//                                     marginTop: "-1.25vh"
//                                 }}
//                             >
//                                 TANGGAL&nbsp;PACKING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {this.state.print["PackingDate"]}
//                             </p>
//                         </div>

//                         <div
//                             style={{
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 justifyContent: "flex-start",
//                                 height: "4vh"
//                             }}
//                         >
//                             <p
//                                 style={{
//                                     fontWeight: "800",
//                                     fontSize: 16,
//                                     marginLeft: "2px"
//                                 }}
//                             >
//                                 JANGAN&nbsp;DIBANTING&nbsp;!&nbsp;BARANG&nbsp;MUDAH&nbsp;PECAH&nbsp;!
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
//     if (modulus != 0) {
//         let last = this.state.displayPrint4.length - 1
//         return (
//             <div>
//                 {/* halaman 1 (header + tabel 10 biji) */}
//                 <div
//                     style={{
//                         border: "2px solid black",
//                         height: "55.2vh",
//                         width: "50vw",
//                         backgroundColor: "white",
//                         display: this.state.displayPrint4[0]
//                     }}
//                 >
//                     {/* Package Name Section */}
//                     <div>
//                         <p
//                             style={{
//                                 fontWeight: "800",
//                                 marginLeft: "2px",
//                                 fontSize: 16,
//                                 marginTop: "0.5vh"
//                             }}
//                         >
//                             {this.state.print['PackageName'].toUpperCase()}
//                         </p>
//                     </div>

//                     {/* Alert barang mudah pecah */}
//                     <div
//                         style={{
//                             borderBottom: "2px solid black",
//                             display: "flex",
//                             flexDirection: "row",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             marginTop: "-3.0vh",
//                         }}
//                     >
//                         <p
//                             style={{
//                                 fontWeight: "800",
//                                 fontSize: 18,
//                                 marginBottom: "-0.01vh"
//                             }}
//                         >
//                             JANGAN DITERIMA BILA PEMBUNGKUS / SEAL RUSAK
//                         </p>
//                     </div>

//                     {/* Info1 Section */}
//                     <div
//                         style={{
//                             marginTop: "-0.7vh",
//                             marginBottom: "-0.7vh"
//                         }}
//                     >
//                         <p
//                             style={{
//                                 marginLeft: "2px",
//                                 fontWeight: "800",
//                                 fontSize: 15,
//                             }}
//                         >
//                             CUSTOMER&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["CustomerName"].toUpperCase()}
//                         </p>

//                         <div
//                             style={{
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 // backgroundColor:"green",
//                                 marginTop: "-2.7vh",
//                                 marginLeft: "2px",
//                                 height: "7.3vh"
//                             }}
//                         >
//                             <p
//                                 style={{
//                                     fontWeight: "800",
//                                     fontSize: 15,
//                                 }}
//                             >
//                                 NOTICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
//                             </p>
//                             <div>
//                                 <p
//                                     style={{
//                                         fontWeight: "800",
//                                         fontSize: 15,
//                                     }}
//                                 >
//                                     {this.state.print["Notice"].toUpperCase()}
//                                 </p>
//                             </div>
//                         </div>

//                         <p
//                             style={{
//                                 marginLeft: "2px",
//                                 fontWeight: "800",
//                                 marginTop: "-0.5vh",
//                                 fontSize: 15,
//                             }}
//                         >
//                             PICK&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["PickNo"]}
//                         </p>
//                         <p
//                             style={{
//                                 marginLeft: "2px",
//                                 fontWeight: "800",
//                                 marginTop: "-1vh",
//                                 fontSize: 15,
//                             }}
//                         >
//                             REF&nbsp;/&nbsp;PO&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["PONo"]}
//                         </p>

//                     </div>

//                     {/* Table Section */}
//                     <div
//                         style={{
//                             display: "flex",
//                             flexDirection: "row",
//                             justifyContent: 'center'
//                         }}
//                         className="print-table"
//                     >
//                         <table
//                             style={{
//                                 width: "750px",
//                                 borderCollapse: "collapse",
//                             }}
//                         >
//                             <tr>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         borderLeft: "0px",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     NO
//                                 </th>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     NAMA BARANG
//                                 </th>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         borderRight: "0px",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     QTY PCS
//                                 </th>
//                             </tr>

//                             {item_list.slice(0, 10).map((element, y, z) => {
//                                 return (
//                                     <tr>
//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 height: "2.82vh",
//                                                 borderBottom: "0px"
//                                             }}
//                                         >
//                                             {item_list.slice(0, 10)[y].No}
//                                         </th>

//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 textAlign: "left",
//                                                 height: "2.82vh",
//                                                 borderBottom: "0px"
//                                             }}
//                                         >
//                                             {item_list.slice(0, 10)[y].ItemName}
//                                         </th>

//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 borderRight: "0px",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 height: "2.82vh",
//                                                 borderBottom: "0px"
//                                             }}
//                                         >
//                                             {item_list.slice(0, 10)[y].Qty}
//                                         </th>
//                                     </tr>
//                                 )
//                             })}

//                         </table>
//                     </div>
//                 </div>

//                 {/* halaman tabel item 18 biji */}
//                 {this.state.result.map((element, idx) => {
//                     return (
//                         <div
//                             style={{
//                                 border: "2px solid white",
//                                 height: "55.2vh",
//                                 width: "50vw",
//                                 backgroundColor: "white",
//                                 display: this.state.displayPrint4[idx + 1],
//                             }}
//                         >
//                             <div>
//                                 <table
//                                     style={{
//                                         width: "49.8vw",
//                                         borderCollapse: "collapse",
//                                         border: "2px solid black"
//                                     }}
//                                 >
//                                     <tr>
//                                         <th
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 border: "2px solid black",
//                                                 borderTop: "0px",
//                                                 borderLeft: "0px",
//                                                 height: "3.0vh"
//                                             }}
//                                         >
//                                             NO
//                                         </th>

//                                         <th
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 border: "2px solid black",
//                                                 height: "3.0vh",
//                                                 borderTop: "0px",
//                                             }}
//                                         >
//                                             NAMA BARANG
//                                         </th>

//                                         <th
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 border: "2px solid black",
//                                                 borderRight: "0px",
//                                                 height: "3.0vh",
//                                                 borderTop: "0px",
//                                             }}
//                                         >
//                                             QTY PCS
//                                         </th>


//                                     </tr>

//                                     {item_list.slice(this.state.awal[idx], this.state.akhir[idx]).map((element, index, self) => {

//                                         return (
//                                             <tr>
//                                                 <th
//                                                     style={{
//                                                         border: "2px solid black",
//                                                         fontSize: 14,
//                                                         fontWeight: "800",
//                                                         height: "2.67vh",
//                                                         //borderBottom: "0px"
//                                                     }}
//                                                 >
//                                                     {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["No"]}
//                                                 </th>

//                                                 <th
//                                                     style={{
//                                                         border: "2px solid black",
//                                                         fontSize: 14,
//                                                         fontWeight: "800",
//                                                         textAlign: "left",
//                                                         height: "2.67vh",
//                                                         //borderBottom: "0px"
//                                                     }}
//                                                 >
//                                                     {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["ItemName"]}
//                                                 </th>

//                                                 <th
//                                                     style={{
//                                                         border: "2px solid black",
//                                                         borderRight: "0px",
//                                                         fontSize: 14,
//                                                         fontWeight: "800",
//                                                         height: "2.67vh",
//                                                     }}
//                                                 >
//                                                     {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["Qty"]}
//                                                 </th>
//                                             </tr>
//                                         )
//                                     })}
//                                 </table>
//                             </div>

//                         </div>
//                     )
//                 })}

//                 {/* halaman untuk sisa table item */}
//                 <div
//                     style={{
//                         border: "2px solid white",
//                         height: "55.2vh",
//                         width: "50vw",
//                         backgroundColor: "white",
//                         display: this.state.displayPrint4[last],
//                     }}
//                 >
//                     {/* Table Section */}
//                     <div
//                         style={{
//                             display: "flex",
//                             flexDirection: "row",
//                             justifyContent: 'center'
//                         }}
//                         className="print-table"
//                     >
//                         <table
//                             style={{
//                                 width: "750px",
//                                 borderCollapse: "collapse",
//                             }}
//                         >
//                             <tr>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     NO
//                                 </th>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     NAMA BARANG
//                                 </th>
//                                 <th
//                                     style={{
//                                         fontSize: 14,
//                                         fontWeight: "800",
//                                         border: "2px solid black",
//                                         height: "3.0vh"
//                                     }}
//                                 >
//                                     QTY PCS
//                                 </th>
//                             </tr>

//                             {item_list.slice(item_list_len - modulus, item_list_len).map((element, y, z) => {
//                                 return (
//                                     <tr>
//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 height: "2.82vh",
//                                                 //borderBottom: "0px"
//                                             }}
//                                         >
//                                             {item_list.slice(item_list_len - modulus, item_list_len)[y].No}
//                                         </th>

//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 textAlign: "left",
//                                                 height: "2.82vh",
//                                                 //borderBottom: "0px"
//                                             }}
//                                         >
//                                             {item_list.slice(item_list_len - modulus, item_list_len)[y].ItemName}
//                                         </th>

//                                         <th
//                                             style={{
//                                                 border: "2px solid black",
//                                                 fontSize: 14,
//                                                 fontWeight: "800",
//                                                 //borderBottom: "0px",
//                                                 height: "2.82vh",
//                                             }}
//                                         >
//                                             {item_list.slice(item_list_len - modulus, item_list_len)[y].Qty}
//                                         </th>
//                                     </tr>
//                                 )
//                             })}
//                         </table>
//                     </div>

//                 </div>

//                 {/* halaman terakhir (footer packer) */}
//                 <div
//                     style={{
//                         border: "2px solid white",
//                         height: "55.2vh",
//                         width: "50vw",
//                         backgroundColor: "white",
//                         display: this.state.displayPrint4[last]
//                     }}
//                 >
//                     {/* Info2 & Alert 2 Section */}
//                     <div
//                         style={{
//                             marginTop: "-1.25vh",
//                             border: "2px solid black"
//                         }}
//                     >
//                         <div
//                             style={{
//                                 borderBottom: "2px solid black",
//                                 height: "5.5vh"
//                             }}
//                         >
//                             <p
//                                 style={{
//                                     marginLeft: "2px",
//                                     fontWeight: "800",
//                                     fontSize: 15,
//                                 }}
//                             >
//                                 PACKER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {this.state.print["Packer"].toUpperCase()}
//                             </p>
//                             <p
//                                 style={{
//                                     marginLeft: "2px",
//                                     fontWeight: "800",
//                                     fontSize: 15,
//                                     marginTop: "-1.25vh"
//                                 }}
//                             >
//                                 TANGGAL&nbsp;PACKING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {this.state.print["PackingDate"]}
//                             </p>
//                         </div>

//                         <div
//                             style={{
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 justifyContent: "flex-start",
//                                 height: "4vh"
//                             }}
//                         >
//                             <p
//                                 style={{
//                                     fontWeight: "800",
//                                     fontSize: 16,
//                                     marginLeft: "2px"
//                                 }}
//                             >
//                                 JANGAN&nbsp;DIBANTING&nbsp;!&nbsp;BARANG&nbsp;MUDAH&nbsp;PECAH&nbsp;!
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }