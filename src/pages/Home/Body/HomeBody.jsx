//import react
import React, { Component } from 'react';

//import react-activity
import { Dots } from "react-activity";
import "react-activity/dist/Dots.css";

//import css file
import "./css/HomeBody.css";

//import devExtreme
import 'devextreme/dist/css/dx.light.css';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import {
    DataGrid,
    Column,
    Scrolling,
} from 'devextreme-react/data-grid';

import {
    Popup,
    TextBox,
    Button,
    DropDownButton,
} from 'devextreme-react'

//import react-router-dom
import {
    Link,
    withRouter
} from "react-router-dom";

//import baseURL
import { baseURL } from "./../../../utils/config/config"

//import moment
import moment from 'moment';

//import telegram-log
import { TelegramLogger } from 'node-telegram-log';



//setup telegram logger
const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-773570755");

class HomeBody extends Component {
    constructor(props) {
        super(props);

        this.state = {

            //untuk status popup di halaman home
            isLoading: false,
            isClientSideErr: false,
            isServersideError: false,
            isTryCatchErr: false,
            isSort: false,

            //buat tampung errMsg
            errMsg: "",
            tryCatchErrMsg: "",

            //for limit features
            item: [
                { id: 1, text: "5", value: 5 },
                { id: 2, text: "10", value: 10 },
            ],
            activeItem: "5",
            limit: 5,

            //Document Page
            docPage: 0,

            //untuk simpan data tabel dan tampilin ke user
            dataGridPicklist: "",

            //for sort features
            sortItem1: [
                { id: 1, text: 'Nomor Picklist', value: 1 },
                { id: 2, text: 'Pick Date', value: 2 }
            ],
            selectedSortItem1: 'Nomor Picklist',
            selectedSortVal1: 1,
            sortItem2: [
                { id: 1, text: 'A-Z', value: 1 },
                { id: 2, text: 'Z-A', value: 2 }
            ],
            selectedSortItem2: 'Z-A',
            selectedSortVal2: 2,

            //for search features
            searchWord: "",

            //button-attr
            okBtnAttr: {
                class: 'okBtnAttr'
            },
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
            logger.error(`@Gleenald App Error! function disableClientSideErr(), Halaman Home, msg: ${err}`)
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
            logger.error(`@Gleenald App Error! function disableServerSideErr(), Halaman Home, msg: ${err}`)
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
            logger.error(`@Gleenald App Error! function disableTryCatchErr(), Halaman Home, msg: ${err}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }

    enableSort = () => {
        try {
            this.setState({
                isSort: true
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function enableSort(), Halaman Home, msg: ${err}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }
    disableSort = () => {
        try {
            this.setState({
                isSort: false
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function disableSort(), Halaman Home, msg: ${err}`)
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

        const res = await fetch(`${baseURL}/delivery-dummy`, requestOptions)
        const stat = await res.status;
        const data = await res.json()

        console.log(stat)
        console.log(data)

        //logger.log('hore berhasil panggil fetch di retail')

    }


    //function untuk sort
    sort = () => {
        try {
            if (this.state.selectedSortVal1 == 1) {
                this.sortPicklistNum()
            }
            if (this.state.selectedSortVal1 == 2) {
                this.sortPickDate()

            }
        }
        catch (err) {
            console.log(err)
            this.setState({
                isTryCatchErr: true,
                isLoading: false,
                tryCatchErrMsg: err
            })
            logger.error(`@Gleenald Application catch error {function: sort(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    sortPicklistNum = () => {
        this.setState({ docPage: 0 }, async () => {
            try {
                console.log('sort by nomor picklist');

                //loading overlay
                this.setState({ isLoading: true })

                //desc / asc system choose
                let sortType;
                if (this.state.selectedSortVal2 == 1) {
                    sortType = "ASC"
                }
                if (this.state.selectedSortVal2 == 2) {
                    sortType = "DESC"
                }

                console.log(sortType)

                //fetch process begin!
                const Token = localStorage.getItem("UserToken");

                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${Token}`);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Accept", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const res = await fetch(`${baseURL}/picklist?page=${this.state.docPage}&limit=${this.state.limit}&sort_AbsEntry=${sortType}`, requestOptions)
                const stat = await res.status
                const data = await res.json()

                console.log(stat)
                console.log(data)

                if (stat >= 200 && stat <= 300) {
                    let NewArr = [];

                    for (var i in data) {
                        NewArr.push({
                            "No": parseInt(i) + 1,
                            "Picklist Number": data[i].AbsEntry,
                            "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                        })
                    }

                    this.setState({
                        dataGridPicklist: new DataSource({
                            store: new ArrayStore({
                                data: NewArr
                            })
                        }),
                        isLoading: false,
                        isSort: false,
                    })
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isClientSideErr: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: sortPicklistNum(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isServersideError: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ServersideError {function: sortPicklistNum(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }

            }
            catch (err) {
                console.log(err)
                this.setState({
                    isLoading: false,
                    isTryCatchErr: true,
                    tryCatchErrMsg: err
                })
                logger.error(`@Gleenald Application catch error {function: sortPicklistNum(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }

        })
    }
    sortPickDate = () => {
        this.setState({ docPage: 0 }, async () => {
            try {
                console.log('sort by nomor picklist');

                //loading overlay
                this.setState({ isLoading: true })

                //desc / asc system choose
                let sortType;
                if (this.state.selectedSortVal2 == 1) {
                    sortType = "ASC"
                }
                if (this.state.selectedSortVal2 == 2) {
                    sortType = "DESC"
                }

                console.log(sortType)

                //fetch process begin!
                const Token = localStorage.getItem("UserToken");

                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${Token}`);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Accept", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const res = await fetch(`${baseURL}/picklist?page=${this.state.docPage}&limit=${this.state.limit}&sort_AbsEntry=${sortType}`, requestOptions)
                const stat = await res.status
                const data = await res.json()

                console.log(stat)
                console.log(data)

                if (stat >= 200 && stat <= 300) {
                    let NewArr = [];

                    for (var i in data) {
                        NewArr.push({
                            "No": parseInt(i) + 1,
                            "Picklist Number": data[i].AbsEntry,
                            "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                        })
                    }

                    this.setState({
                        dataGridPicklist: new DataSource({
                            store: new ArrayStore({
                                data: NewArr
                            })
                        }),
                        isLoading: false,
                        isSort: false,
                    })
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isClientSideErr: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: sortPickDate(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isServersideError: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ServersideError {function: sortPickDate(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
            }
            catch (err) {
                console.log(err);
                this.setState({
                    isLoading: false,
                    isTryCatchErr: true,
                    tryCatchErrMsg: err
                })
                logger.error(`@Gleenald Application catch error {function: sortPickDate(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }


    //function untuk search
    search = async () => {
        try {
            //for show loading overlay
            this.setState({ isLoading: true })

            //fetch process begin!
            const Token = localStorage.getItem("UserToken");

            let myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Accept", "application/json");

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            const res = await fetch(`${baseURL}/picklist?search=${this.state.searchWord}`, requestOptions)
            const stat = await res.status
            const data = await res.json()

            console.log(stat)
            console.log(data)

            if (stat >= 200 && stat <= 300) {
                let NewArr = [];

                for (var i in data) {
                    NewArr.push({
                        "No": parseInt(i) + 1,
                        "Picklist Number": data[i].AbsEntry,
                        "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                    })
                }

                this.setState({
                    dataGridPicklist: new DataSource({
                        store: new ArrayStore({
                            data: NewArr
                        })
                    }),
                    isLoading: false
                })
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({
                    isClientSideErr: true,
                    isLoading: false,
                    errMsg: data.description
                })
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: search(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
            }
            if (stat >= 500 && stat <= 600) {
                this.setState({
                    isServersideError: true,
                    isLoading: false,
                    errMsg: data.description
                })
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, ServersideError {function: search(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                isLoading: false,
                isTryCatchErr: true,
                tryCatchErrMsg: err
            })
            logger.error(`@Gleenald Application catch error {function: search(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //function untuk limit
    limit = (x) => {
        this.setState({ limit: x.itemData.value, docPage: 0 }, async () => {
            try {
                //for display the num to user & show loading overlay
                this.setState({
                    isLoading: true,
                    activeItem: x.itemData.text
                })

                //fetch process begin!
                const Token = localStorage.getItem("UserToken");

                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${Token}`);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Accept", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const res = await fetch(`${baseURL}/picklist?page=${this.state.docPage}&limit=${this.state.limit}&sort_AbsEntry=DESC`, requestOptions);
                const stat = await res.status;
                const data = await res.json();

                if (stat >= 200 && stat <= 300) {
                    let NewArr = [];

                    for (var i in data) {
                        NewArr.push({
                            "No": parseInt(i) + 1,
                            "Picklist Number": data[i].AbsEntry,
                            "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                        })
                    }

                    this.setState({
                        dataGridPicklist: new DataSource({
                            store: new ArrayStore({
                                data: NewArr
                            })
                        }),
                        isLoading: false
                    })
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isClientSideErr: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: limit(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isServersideError: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error {function: limit(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
            }
            catch (err) {
                console.log(err)
                this.setState({
                    isLoading: false,
                    isTryCatchErr: true,
                    tryCatchErrMsg: err
                })
                logger.error(`@Gleenald Application catch error {function: limit(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }


    //function untuk load more page
    loadNext = () => {
        try {
            if (this.state.selectedSortVal1 == 1) {
                this.loadNextPicklistNum()
                console.log('haha')
            }
            if (this.state.selectedSortVal1 == 2) {
                this.loadNextPickDate()
            }
        }
        catch (err) {
            console.log(err)
            this.setState({
                isLoading: false,
                isTryCatchErr: true,
                tryCatchErrMsg: err
            })
            logger.error(`@Gleenald Application catch error {function: loadNext(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    loadNextPicklistNum = () => {
        this.setState({ docPage: this.state.docPage + 1 }, async () => {
            try {
                console.log('loadNextPicklitNum')
                console.log(this.state.docPage)

                //loading overlay
                this.setState({ isLoading: true })

                //desc / asc system choose
                let sortType;
                if (this.state.selectedSortVal2 == 1) {
                    sortType = "ASC"
                }
                if (this.state.selectedSortVal2 == 2) {
                    sortType = "DESC"
                }

                console.log(sortType)

                //fetch process begin!
                const Token = localStorage.getItem("UserToken");

                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${Token}`);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Accept", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const res = await fetch(`${baseURL}/picklist?page=${this.state.docPage}&limit=${this.state.limit}&sort_AbsEntry=${sortType}`, requestOptions)
                const stat = await res.status
                const data = await res.json()

                console.log(stat)
                console.log(data)

                if (stat >= 200 && stat <= 300) {
                    let NewArr = [];

                    for (var i in data) {
                        NewArr.push({
                            "No": parseInt(i) + 1,
                            "Picklist Number": data[i].AbsEntry,
                            "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                        })
                    }

                    this.setState({
                        dataGridPicklist: new DataSource({
                            store: new ArrayStore({
                                data: NewArr
                            })
                        }),
                        isLoading: false,
                        isSort: false,
                    })
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isClientSideErr: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: loadNextPicklistNum(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isServersideError: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error {function: loadNextPicklistNum(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
            }
            catch (err) {
                console.log(err);
                this.setState({
                    isLoading: false,
                    isTryCatchErr: true
                })
                logger.error(`@Gleenald Application catch error {function: loadNextPicklistNum(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }
    loadNextPickDate = () => {
        this.setState({ docPage: this.state.docPage + 1 }, async () => {
            try {
                console.log('loadNextPickDate')
                console.log(this.state.docPage)

                //loading overlay
                this.setState({ isLoading: true })

                //desc / asc system choose
                let sortType;
                if (this.state.selectedSortVal2 == 1) {
                    sortType = "ASC"
                }
                if (this.state.selectedSortVal2 == 2) {
                    sortType = "DESC"
                }

                console.log(sortType)

                //fetch process begin!
                const Token = localStorage.getItem("UserToken");

                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${Token}`);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Accept", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const res = await fetch(`${baseURL}/picklist?page=${this.state.docPage}&limit=${this.state.limit}&sort_PickDate=${sortType}`, requestOptions)
                const stat = await res.status
                const data = await res.json()

                console.log(stat)
                console.log(data)

                if (stat >= 200 && stat <= 300) {
                    let NewArr = [];

                    for (var i in data) {
                        NewArr.push({
                            "No": parseInt(i) + 1,
                            "Picklist Number": data[i].AbsEntry,
                            "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                        })
                    }

                    this.setState({
                        dataGridPicklist: new DataSource({
                            store: new ArrayStore({
                                data: NewArr
                            })
                        }),
                        isLoading: false,
                        isSort: false,
                    })
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isClientSideErr: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: loadNextPickDate(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isServersideError: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error {function: loadNextPickDate(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
            }
            catch (err) {
                console.log(err);
                this.setState({
                    isLoading: false,
                    isTryCatchErr: true
                })
                logger.error(`@Gleenald Application catch error {function: loadNextPickDate(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }

    loadPrev = () => {
        try {
            if (this.state.selectedSortVal1 == 1) {
                this.loadPrevPicklistNum()
            }
            if (this.state.selectedSortVal1 == 2) {
                this.loadPrevPickDate()
            }
        }
        catch (err) {
            console.log(err)
            this.setState({
                isLoading: false,
                isTryCatchErr: true,
                tryCatchErrMsg: err
            })
            logger.error(`@Gleenald Application catch error {function: loadPrev(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    loadPrevPicklistNum = () => {
        this.setState({ docPage: this.state.docPage - 1 }, async () => {
            try {
                console.log(this.state.docPage)
                console.log('loadPrevPicklistNum')

                this.setState({ isLoading: true })

                let sortType;
                if (this.state.selectedSortVal2 == 1) {
                    sortType = "ASC"
                }
                if (this.state.selectedSortVal2 == 2) {
                    sortType = "DESC"
                }

                console.log(sortType)

                const Token = localStorage.getItem("UserToken");

                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${Token}`);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Accept", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const res = await fetch(`${baseURL}/picklist?page=${this.state.docPage}&limit=${this.state.limit}&sort_AbsEntry=${sortType}`, requestOptions)
                const stat = await res.status
                const data = await res.json()

                console.log(stat)
                console.log(data)

                if (stat >= 200 && stat <= 300) {
                    let NewArr = [];

                    for (var i in data) {
                        NewArr.push({
                            "No": parseInt(i) + 1,
                            "Picklist Number": data[i].AbsEntry,
                            "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                        })
                    }

                    this.setState({
                        dataGridPicklist: new DataSource({
                            store: new ArrayStore({
                                data: NewArr
                            })
                        }),
                        isLoading: false,
                        isSort: false,
                    })
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isClientSideErr: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: loadPrevPicklistNum(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isServersideError: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error {function: loadPrevPicklistNum(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
            }
            catch (err) {
                console.log(err);
                this.setState({
                    isLoading: false,
                    isTryCatchErr: true
                })
                logger.error(`@Gleenald Application catch error {function: loadPrevPicklistNum(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }
    loadPrevPickDate = () => {
        this.setState({ docPage: this.state.docPage - 1 }, async () => {
            try {
                console.log(this.state.docPage)
                console.log('loadPrevPickDate')

                this.setState({ isLoading: true })

                let sortType;
                if (this.state.selectedSortVal2 == 1) {
                    sortType = "ASC"
                }
                if (this.state.selectedSortVal2 == 2) {
                    sortType = "DESC"
                }

                console.log(sortType)

                const Token = localStorage.getItem("UserToken");

                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${Token}`);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Accept", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const res = await fetch(`${baseURL}/picklist?page=${this.state.docPage}&limit=${this.state.limit}&sort_PickDate=${sortType}`, requestOptions)
                const stat = await res.status
                const data = await res.json()

                console.log(stat)
                console.log(data)

                if (stat >= 200 && stat <= 300) {
                    let NewArr = [];

                    for (var i in data) {
                        NewArr.push({
                            "No": parseInt(i) + 1,
                            "Picklist Number": data[i].AbsEntry,
                            "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                        })
                    }

                    this.setState({
                        dataGridPicklist: new DataSource({
                            store: new ArrayStore({
                                data: NewArr
                            })
                        }),
                        isLoading: false,
                        isSort: false,
                    })
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isClientSideErr: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: loadPrevPickDate(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isServersideError: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error {function: loadPrevPickDate(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
            }
            catch (err) {
                console.log(err);
                this.setState({
                    isLoading: false,
                    isTryCatchErr: true
                })
                logger.error(`@Gleenald Application catch error {function: loadPrevPickDate(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }


    //cell render devexpress
    cellRenderNo = (data) => {
        return <div><p style={{ color: 'black' }}>{data.value}</p></div>
    }
    cellRenderPicklistNo = (data) => {
        return <div><Link to={`/setpackaging/${data.value}`}>{data.value}</Link></div>
    }
    cellRenderPickDate = (data) => {
        return <div><a style={{ color: "black" }}>{data.value}</a></div>
    }


    // Fetch untuk dapetin data buat datagrid
    getData = () => {
        this.setState({ docPage: 0, limit: 5 }, async () => {
            try {
                this.setState({
                    isLoading: true
                })

                //fetch process begin
                const Token = localStorage.getItem("UserToken");

                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${Token}`);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Accept", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const res = await fetch(`${baseURL}/picklist?page=${this.state.docPage}&limit=${this.state.limit}&sort_AbsEntry=DESC`, requestOptions)
                const stat = await res.status
                const data = await res.json()


                console.log(stat)
                console.log(data)

                if (stat >= 200 && stat <= 300) {
                    let NewArr = [];

                    for (var i in data) {
                        NewArr.push({
                            "No": parseInt(i) + 1,
                            "Picklist Number": data[i].AbsEntry,
                            "PickDate": moment(data[i].PickDate, "YYYY-MM-DD").format("D MMMM YYYY")
                        })
                    }

                    this.setState({
                        dataGridPicklist: new DataSource({
                            store: new ArrayStore({
                                data: NewArr
                            })
                        }),
                        isLoading: false
                    })
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isClientSideErr: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSideError {function: getData(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isServersideError: true,
                        isLoading: false,
                        errMsg: data.description
                    })
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error {function: getData(), page: Home}, NodeMsg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`);
                }


            }
            catch (err) {
                console.log(err);
                this.setState({
                    isLoading: false,
                    tryCatchErrMsg: err,
                    isTryCatchErr: true
                })
                logger.error(`@Gleenald Application catch error {function: getData(), page: Home}, logMsg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }


    componentDidMount() {
        this.getData()
    }

    render() {

        return (
            <div>
                {/* Title Section */}
                <div className="titleContainer">
                    <p className="titleText">
                        Set Packaging
                        <span className="titleLine">|</span>
                        <span className="titleText2">Set Packages - </span>
                        <span className="titleText3">Picklist Number</span>
                    </p>
                </div>

                {/* Table Container */}
                <div className="tableContainer">

                    <div className='top-option'>

                        <div className="limit-grp">
                            <p
                                className="text1"
                            >
                                Tampilkan
                            </p>

                            <DropDownButton
                                text={this.state.activeItem}
                                height="45"
                                width="70"
                                items={this.state.item}
                                keyExpr='id'
                                displayExpr="text"
                                onItemClick={this.limit}
                            />

                            <p
                                className="text2"
                            >
                                data
                            </p>
                        </div>

                        <div className="search-sort-grp">
                            <Button
                                text="Sort"
                                className="sort-btn"
                                onClick={this.enableSort}
                            />

                            <TextBox
                                placeholder='Cari disini..'
                                className="search-textBar"
                                onValueChange={(y) => { this.setState({ searchWord: y }) }}
                                onEnterKey={this.search}
                            />
                        </div>
                    </div>

                    <DataGrid
                        dataSource={this.state.dataGridPicklist}
                        columnAutoWidth={true}
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        showRowLines={false}
                        showColumnLines={false}
                        showBorders={false}
                    >
                        <Scrolling
                            showScrollbar="never"
                        />

                        <Column
                            dataField="No"
                            dataType="integer"
                            width={100}
                            cssClass="column-number"
                        >

                        </Column>

                        <Column
                            dataField="Picklist Number"
                            dataType="string"
                            width={1250}
                            cssClass="column-picklistNumber"
                            cellRender={this.cellRenderPicklistNo}
                        >

                        </Column>

                        <Column
                            dataField="PickDate"
                            dataType="string"
                            width={750}
                            cssClass="column-picklistNumber"
                            cellRender={this.cellRenderPickDate}
                        >

                        </Column>
                    </DataGrid>

                    <div className="bottom-option">
                        <Button
                            text="<"
                            className="previous-btn"
                            type='normal'
                            stylingMode='contained'
                            height="40"
                            width="50"
                            onClick={this.loadPrev}
                            disabled={(this.state.docPage == 0) ? true : false}
                        />

                        <p
                            className="text"
                        >
                            Halaman {this.state.docPage + 1}
                        </p>

                        <Button
                            text='>'
                            className="next-btn"
                            type='normal'
                            stylingMode='contained'
                            height="40"
                            onClick={this.loadNext}
                        />
                    </div>

                </div>



                {/* SEMUA POPUP YANG ADA DI HALAMAN HOME */}


                {/* Popup yang berhubungan dengan error */}
                {/* Popup Err400 */}
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

                {/* Popup Err500 */}
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

                {/* Popup Try Catch Err */}
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


                {/* Popup Sort */}
                <div>
                    <Popup
                        visible={this.state.isSort}
                        closeOnOutsideClick={true}
                        onHiding={this.disableSort}
                        showTitle={false}
                        width={587}
                        height={350}
                        className="Sort"
                    >
                        <div>
                            <p className="Title">Sort</p>
                        </div>

                        <hr
                            style={{ height: "1px", marginTop: '15px', backgroundColor: "rgba(0, 86, 184, 1.0)", borderColor: "rgba(0, 86, 184, 1.0)" }}
                        />

                        <div>

                            <p>Sort Berdasarkan : </p>

                            <DropDownButton
                                text={this.state.selectedSortItem1}
                                height="45"
                                width="135"
                                items={this.state.sortItem1}
                                keyExpr='id'
                                displayExpr="text"
                                onItemClick={(x) => {
                                    this.setState({
                                        selectedSortItem1: x.itemData.text,
                                        selectedSortVal1: x.itemData.value
                                    })

                                    console.log(this.state.selectedSortItem1)
                                    console.log(this.state.selectedSortVal1)
                                }}
                            />
                        </div>

                        <div>
                            <p>Tipe : </p>

                            <DropDownButton
                                text={this.state.selectedSortItem2}
                                height="45"
                                width="135"
                                items={this.state.sortItem2}
                                keyExpr='id'
                                displayExpr="text"
                                onItemClick={(x) => {
                                    this.setState({
                                        selectedSortItem2: x.itemData.text,
                                        selectedSortVal2: x.itemData.value
                                    })

                                    console.log(this.state.selectedSortItem2)
                                    console.log(this.state.selectedSortVal2)
                                }}
                            />
                        </div>

                        <hr
                            style={{ height: "1px", marginTop: '15px', backgroundColor: "rgba(0, 86, 184, 1.0)", borderColor: "rgba(0, 86, 184, 1.0)" }}
                        />

                        <div
                            className="btn-grp"
                        >
                            <Button
                                text='Batalkan'
                                onClick={this.disableSort}
                            />

                            <Button
                                text='Terapkan'
                                className='apply-btn'
                                onClick={this.sort}
                            />
                        </div>
                    </Popup>
                </div>

            </div>
        );
    }
}

export default HomeBody;