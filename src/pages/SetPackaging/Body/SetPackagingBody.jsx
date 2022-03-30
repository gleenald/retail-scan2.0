//import react
import React, { Component } from 'react';

//import react-activity
import { Dots } from "react-activity";
import "react-activity/dist/Dots.css";

//import cdd files
import "./css/SetPackagingBody.css"

//import devextreme
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import {
    DataGrid,
    Column,
    SearchPanel,
    Paging,
    Sorting,
    Pager,
    Scrolling,
    Editing
} from 'devextreme-react/data-grid';

import {
    Button,
    Popup,
    TextBox,
    DropDownButton,
} from 'devextreme-react';

//import react-router-dom
import { withRouter } from 'react-router-dom';

//import baseURL
import { baseURL } from '../../../utils/config/config';

//import moment
import moment from 'moment';

//import pdfmake
//import jsPDF from "jspdf";

//import telegram-logger
import { TelegramLogger } from 'node-telegram-log';

//import pdfmake
import jsPDF from "jspdf";



//setup telegram logger
const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-773570755");

class SetPackagingBody extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //untuk status popup di halaman setpackaging
            isLoading: false,
            isClientSideErr: false,
            isNotYetFinish: false,
            isServersideError: false,
            isTryCatchErr: false,
            isAddNewPackage: false,
            isPackageNameSame: false,
            isEditPackageName: false,
            isDeletePackage: false,
            isItemNotFound: false,
            isEditQtyItem: false,
            isQtyZero: false,
            isBoxEmpty: false,
            isScanItemFinish: false,
            isScanSuccess: false,
            isEditItemFinish: false,
            isEditItemSuccess: false,
            isDeleteItem: false,
            isCancel: false,
            isCancelandDelete: false,
            isCancelSuccess: false,
            isTypeItemLess: false,
            isDeliveryItemNull: false,
            isQtyLess: false,
            isQtyMore: false,
            isQtyMatch: false,
            isDeliverySuccess: false,
            isPrint: false,
            isPrintDisplay: false,
            isSuperUserEditPackage: false,
            isSuperUserDeletePackage: false,
            isSuperUserEditQtyItem: false,
            isSuperUserDeleteItem: false,
            isSuperUserEnableEdit: false,

            //buat simpen msg err
            errMsg: "",
            tryCatchErrMsg: "",

            //buat simpen nama package yang user input
            PackageName: "",

            //buat simpen superuser pass
            superUserPass: "",

            //buat simpen error msg saat add new package
            addNewPackageAlert: '',

            //simpan data Package beserta detialnya di satu ABSENTRY
            PackageList: [],

            //simpan nama package saat user mau do actions ke package itu
            editTitle: "",

            //untuk simpan kode item yang di scan user
            scanItem: "",

            //saat user edit qty item, masukin data detil item kesini
            itemName: "",
            itemNo: "",
            itemQty: "",

            //untuk simpen data yang ditampilin datagrid-devextreme
            //TABLE 1 - validation table
            validList: "",
            //TABLE 2 - package tabke
            dataGridPackage: "",
            //TABLE 3 - item table
            dataGridItem: "",
            //PAGE SIZE array
            allowedPageSizes: [5, 10],

            //button-attributes
            buttonAttributes: {
                class: 'myClass'
            },

            buttonAttributes2: {
                class: 'myClass2'
            },

            //buat tampung selectedindex, dan selectedpackagename
            selectedIndex: 0,
            selectedTitle: "",

            //state detect tiap status
            PackageStatus: "",

            //untuk status on/off tiap element di page setpackaging
            //disabled status button collection
            canAddPackage: true,
            finishScanBtn: false,
            enableEditBtn: true,
            //status display tabel3
            table3: 'none',
            //status textbox di tabel3
            textBoxStat: false,
            //status display kumpulan tombol edit 
            canEnableEdit: "block",
            canFinishEdit: "none",

            //untuk nampung data yang akan di print
            selectedPrint: '',
            print: {
                "PackageName": '',
                "CustomerName": "",
                "Notice": "",
                "PickNo": "",
                "PONo": "",
                "ItemList": [],
                "Packer": "",
                "PackingDate": ""
            },

            displayPrint1: ['block'],
            displayPrint2: ['block', 'none'],
            displayPrint3: ['block', 'none', 'none'],
            displayPrint4: [],

            dropDown2: [
                { id: 0, text: "Page 1" },
                { id: 1, text: "Page 2" }
            ],
            dropDown3: [
                { id: 0, text: "Page 1" },
                { id: 1, text: "Page 2" },
                { id: 2, text: "Page 3" }
            ],
            dropDown4: [],

            result: [],
            awal: [],
            akhir: [],
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
            logger.error(`@Gleenald App Error! function disableClientSideErr() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
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
            logger.error(`@Gleenald App Error! function disableServerSideErr() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }

    disableTryCatchErr = async () => {
        try {
            this.setState({
                isTryCatchErr: false,
                isLoading: true
            })
            //fetch
            const Token = window.localStorage.getItem("UserToken")

            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);

            let raw = JSON.stringify({
                "IsLocked": false
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/lock-picklist/${this.props.match.params.picklistnumber}`)
            const stat = await res.status
            const data = await res.json()

            console.log(stat)
            console.log(data)

            if (stat >= 200 && stat <= 300) {
                this.props.history.push({
                    pathname: '/home'
                })
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({
                    isLoading: false,
                    isClientSideErr: true,
                    errMsg: data.description
                })
                console.log('cancel gagal')
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function disableTryCatchErr() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
            if (stat >= 500 && stat <= 600) {
                this.setState({
                    isLoading: false,
                    isServersideError: true,
                    errMsg: data.description
                })
                console.log('cancel gagal');
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function disableTryCatchErr() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function disableTryCatchErr() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }

    disableAddNewPackage = () => {
        try {
            this.setState({
                isAddNewPackage: false
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function disableAddNewPackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }
    enableAddNewPackage = () => {
        try {
            this.setState({
                isAddNewPackage: true
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function enableAddNewPackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }

    disablePackageNameSame = () => {
        try {
            this.setState({
                isPackageNameSame: false
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function disablePackageNameSame() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }
    enablePackageNameSame = () => {
        try {
            this.setState({
                isPackageNameSame: true
            })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald App Error! function enablePackageNameSame() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
        }
    }

    disableEditPackageName = () => {
        try {
            this.setState({
                isEditPackageName: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableEditPackageName() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableDeletePackage = () => {
        try {
            this.setState({
                isDeletePackage: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableDeletePackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableItemNotFound = () => {
        try {
            this.setState({
                isItemNotFound: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableItemNotFound() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableEditQtyItem = () => {
        try {
            this.setState({
                isEditQtyItem: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableEditQtyItem() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableQtyZero = () => {
        try {
            this.setState({
                isQtyZero: false
            })
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableQtyZero() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableBoxEmpty = () => {
        try {
            this.setState({
                isBoxEmpty: false
            })
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableBoxEmpty() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    enableFinishScan = () => {
        try {
            //siapin bahan2nya
            const PackageLocalStorage = localStorage.getItem('PackageList');
            const parse = JSON.parse(PackageLocalStorage);;

            if (parse[this.state.selectedIndex].ItemList.length == 0) {
                this.setState({ isBoxEmpty: true })
            }
            if (parse[this.state.selectedIndex].ItemList.length > 0) {
                this.setState({ isScanItemFinish: true })
            }
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function enableFinishScan() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    disableFinishScan = () => {
        try {
            this.setState({
                isScanItemFinish: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableFinishScan() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableScanSuccess = () => {
        try {
            this.setState({
                isScanSuccess: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableScanSuccess() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableFinishEdit = () => {
        try {
            this.setState({
                isEditItemFinish: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableFinishEdit() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    enableFinishEdit = () => {
        try {
            this.setState({
                isEditItemFinish: true
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function enableFinishEdit() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableEditItemSuccess = () => {
        try {
            this.setState({
                isEditItemSuccess: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableEditItemSuccess() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableDeleteItem = () => {
        try {
            this.setState({
                isDeleteItem: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableDeleteItem() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableCancel = () => {
        try {
            this.setState({
                isCancel: false
            })
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableCancel() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableCancelAndDelete = () => {
        try {
            this.setState({
                isCancelandDelete: false
            })
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableCancelAndDelete() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableCancelSuccess = () => {
        try {
            this.setState({
                isCancelSuccess: false
            })
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableCancelSuccess() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableTypeItemLess = () => {
        try {
            this.setState({
                isTypeItemLess: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableTypeItemLess() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableDeliveryNull = () => {
        try {
            this.setState({
                isDeliveryItemNull: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableDeliveryNull() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableQtyLess = () => {
        try {
            this.setState({
                isQtyLess: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableQtyLess() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableQtyMore = () => {
        try {
            this.setState({
                isQtyMore: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableQtyMore() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableQtyMatch = () => {
        try {
            this.setState({
                isQtyMatch: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableQtyMatch() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableDeliverySuccess = () => {
        try {
            this.setState({
                isDeliverySuccess: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableDeliverySuccess() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    enableDeliverySuccess = () => {
        try {
            this.setState({
                isDeliverySuccess: true
            })
            this.props.history.push({
                pathname: '/home'
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableDeliverySuccess() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disablePrint = () => {
        try {
            this.setState({
                isPrint: false
            })
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disablePrint() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disablePrintDisplay = () => {
        try {
            this.setState({
                isPrintDisplay: false,
                isPrint: false
            })
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disablePrintDisplay() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableNotYetFinish = () => {
        try {
            this.setState({
                isNotYetFinish: false
            })
            this.props.history.push({
                pathname: '/home'
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableNotYetFinish() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableSuperUserEditPackage = () => {
        try {
            this.setState({
                isSuperUserEditPackage: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableSuperUserEditPackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableSuperUserDeletePackage = () => {
        try {
            this.setState({
                isSuperUserDeletePackage: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableSuperUserDeletePackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableSuperUserEditQtyItem = () => {
        try {
            this.setState({
                isSuperUserEditQtyItem: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableSuperUserEditQtyItem() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableSuperUserDeleteItem = () => {
        try {
            this.setState({
                isSuperUserDeleteItem: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableSuperUserDeleteItem() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }

    disableSuperUserEnableEdit = () => {
        try {
            this.setState({
                isSuperUserDeleteItem: false
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function disableSuperUserEnableEdit() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //function buat testing fetch
    fetchTest = async () => {

        // const token = window.localStorage.getItem("UserToken")

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


    //Semua Function yang berhubungan dengan PackageData
    AddNewPackage = () => {
        try {
            const PackageList = localStorage.getItem('PackageList');

            if (PackageList == null) {
                if (this.state.PackageName == '') {
                    this.setState({ addNewPackageAlert: 'Harap isi nama package terlebih dahulu!' })
                }
                if (this.state.PackageName !== '') {
                    this.state.PackageList.push({
                        "ID": Date.now().toString(),
                        "PackagingName": `Package No. ${this.state.PackageName.toUpperCase()}`,
                        "PackageNo": 'NaN',
                        "ItemList": [],
                        "Status": "NewBox",
                        "No": 1
                    })

                    // for (var i in this.state.PackageList) {
                    //     this.state.PackageList[i].No = parseInt(i) + 1
                    // }

                    localStorage.setItem('PackageList', JSON.stringify(this.state.PackageList))

                    let result = localStorage.getItem('PackageList');

                    let y = JSON.parse(result)

                    console.log('Package List Data :')
                    console.log(y)

                    this.setState({
                        dataGridPackage: new DataSource({
                            store: new ArrayStore({
                                data: y
                            })
                        }),
                        PackageName: ""
                    })

                    this.setState({ isAddNewPackage: false })
                    this.setState({ canAddPackage: true })
                }
            }
            if (PackageList !== null) {
                if (this.state.PackageName == '') {
                    this.setState({ addNewPackageAlert: 'Harap isi nama package terlebih dahulu!' })
                }
                if (this.state.PackageName !== '') {
                    const PackageList = localStorage.getItem('PackageList');

                    const parse = JSON.parse(PackageList)

                    const userEntry = `Package ${this.state.PackageName.toUpperCase()}`

                    const result = parse.filter(x => x.PackagingName === userEntry)

                    console.log(result.length)

                    if (result.length >= 1) {
                        this.setState({ isPackageNameSame: true })
                    }
                    if (result.length == 0) {
                        const PackageList = localStorage.getItem('PackageList');

                        const parse = JSON.parse(PackageList)

                        parse.push({
                            "ID": Date.now().toString(),
                            "PackagingName": `Package No. ${this.state.PackageName.toUpperCase()}`,
                            "PackageNo": 'NaN',
                            "ItemList": [],
                            "Status": "NewBox",
                            "No": 0
                        })

                        for (var i in parse) {
                            parse[i]["No"] = parseInt(i) + 1
                        }

                        localStorage.setItem('PackageList', JSON.stringify(parse))
                        let result = localStorage.getItem('PackageList');

                        let y = JSON.parse(result)

                        console.log('Package List Data :')
                        console.log(y)

                        this.setState({
                            dataGridPackage: new DataSource({
                                store: new ArrayStore({
                                    data: y
                                }),
                                PackageName: ""
                            })

                        })

                        this.setState({ isAddNewPackage: false })
                        this.setState({ canAddPackage: true })

                    }


                }
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function AddNewPackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    EditPackage = () => {
        try {
            console.log('edit package name');

            //siapin data yang dibutuhkan
            const local = JSON.parse(localStorage.getItem('PackageList'));
            const userInputVal = 'Package No.' + " " + this.state.titleAfterEdit.toUpperCase();
            const firstTitle = this.state.editTitle;

            //detect ada engga kardus yang namanya sama
            const result = local.filter(x => x.PackagingName === userInputVal);

            // console.log(userInputVal)
            // console.log(result)

            //jika nama sama
            if (result.length >= 1) {
                this.setState({ isPackageNameSame: true })
            }
            //jika nama tidak sama
            if (result.length == 0) {

                //proses ubah nama
                function isSame(y) {
                    return y.PackagingName === firstTitle
                }
                const selectedBox = local.find(isSame)
                local[local.indexOf(selectedBox)]["PackagingName"] = userInputVal;

                //save to localStorage
                localStorage.setItem('PackageList', JSON.stringify(local))

                //display table
                this.setState({
                    dataGridPackage: new DataSource({
                        store: new ArrayStore({
                            data: local
                        })
                    })
                })

                //ubah selectedtitle
                this.setState({ selectedTitle: local[local.indexOf(selectedBox)]["PackagingName"] })
                this.setState({ isEditPackageName: false })

                //kasih tau lewat log
                console.log('nama kardus diubah!');
                console.log(local);
            }

        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function EditPackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    DeletePackage = async () => {
        try {
            //siapin data 
            const local = JSON.parse(localStorage.getItem('PackageList'));
            const selectedPackage = this.state.editTitle;
            function isSame(y) {
                return y.PackagingName === selectedPackage
            }
            const result = local.find(isSame);

            //jika data belum POST Packaging
            if (result.PackageNo == "NaN") {
                //delete just in local storage
                for (var i in local) {
                    if (local[i].ID === result.ID) {
                        local.splice(i, 1);
                    }
                }
                //save to localStorage
                localStorage.setItem('PackageList', JSON.stringify(local))
                //display table
                this.setState({
                    dataGridPackage: new DataSource({
                        store: new ArrayStore({
                            data: local
                        })
                    })
                })
                //atur status html element di halaman user
                this.setState({
                    canAddPackage: false,
                    isDeletePackage: false,
                    table3: "none"
                })
                //tampilin data ke console
                console.log('data package sudah dihapus!')
                console.log(local)
            }
            //jika data sudah POST Packaging
            if (result.PackageNo !== "NaN") {
                //siapin data yang dibutuhkan
                const Token = localStorage.getItem('UserToken');
                const AbsEntry = this.props.match.params.picklistnumber;
                const PackageNo = result.PackageNo;
                const validList = JSON.parse(localStorage.getItem("ValidList"));

                //untuk mengurangi data registered qty yang sudah terdaftar
                for (var i in result.ItemList) {
                    function isSame(y) {
                        return y.ItemCode == result.ItemList[i].ItemCode
                    }

                    console.log(validList.find(isSame).RegisteredQty)
                    console.log(result.ItemList[i].Qty)

                    validList.find(isSame).RegisteredQty = validList.find(isSame).RegisteredQty - result.ItemList[i].Qty;
                }

                //simpan data validasi yang paling baru
                localStorage.setItem("ValidList", JSON.stringify(validList))

                //tampilkan data validasi terbaru
                this.setState({
                    validList: new DataSource({
                        store: new ArrayStore({
                            data: validList
                        })
                    })
                })

                //fetch delete dimulai
                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${Token}`);

                var requestOptions = {
                    method: 'DELETE',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/packaging/${AbsEntry}/${PackageNo}`, requestOptions);
                const stat = await res.status;
                const data = await res.json();

                if (stat >= 200 && stat <= 300) {
                    //delete data in local
                    for (var i in local) {
                        if (local[i].ID === result.ID) {
                            local.splice(i, 1);
                        }
                    }
                    //save to localStorage
                    localStorage.setItem('PackageList', JSON.stringify(local))
                    //display data ke user
                    this.setState({
                        dataGridPackage: new DataSource({
                            store: new ArrayStore({
                                data: local
                            })
                        })
                    })
                    //atur status html element di halaman user
                    this.setState({
                        canAddPackage: false,
                        isDeletePackage: false,
                        table3: "none"
                    })
                    //tampilin data ke console
                    console.log('data package sudah dihapus!')
                    console.log(local)
                }
                if (stat >= 400 && stat <= 500) {
                    console.log(data.description);
                    this.setState({
                        errMsg: data.description,
                        isLoading: false,
                        isClientSideErr: true
                    })
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function deletePackage() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                }
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function DeletePackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //Semua function yang berhubungan dengan item
    EditQtyItem = () => {
        try {
            if (this.state.itemQty == "") {
                this.setState({ isQtyZero: true })
            }
            if (this.state.itemQty) {
                //siapin bahan nya
                const listPackaging = localStorage.getItem('PackageList');
                const packagingParse = JSON.parse(listPackaging);
                const selectedItemList = packagingParse[this.state.selectedIndex]["ItemList"];
                const itemNo = this.state.itemNo

                //ubah qty sesuai dengan item yang dituju
                function isSame(y) {
                    return y.No == itemNo
                }
                selectedItemList.find(isSame).Qty = parseInt(this.state.itemQty)

                //save ke internal db
                let string = JSON.stringify(packagingParse);
                localStorage.setItem('PackageList', string);

                //tampilin ke user
                this.setState({
                    dataGridItem: new DataSource({
                        store: new ArrayStore({
                            data: selectedItemList
                        })
                    }),
                    isEditQtyItem: false
                })

                //tampilin di console
                console.log('data qty item telah dirubah:')
                console.log(packagingParse)
            }

        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function EditQtyItem() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    DeleteItem = () => {
        try {
            //siapin bahan yang diperlikan
            const listPackaging = localStorage.getItem('PackageList');
            const packagingParse = JSON.parse(listPackaging);
            const itemNo = this.state.itemNo
            const selectedItemList = packagingParse[this.state.selectedIndex]['ItemList']

            //get the target item yang bener
            function isSame(y) {
                return y.No == itemNo
            }

            let result = selectedItemList.find(isSame);

            if (packagingParse[this.state.selectedIndex]["Status"] == "NewBox") {
                //remove it from list
                for (var i in selectedItemList) {
                    if (selectedItemList[i].No == result.No) {
                        const remove = selectedItemList.splice(i, 1);
                    }
                }
                //save to internal db
                localStorage.setItem('PackageList', JSON.stringify(packagingParse));
                //display to user
                this.setState({
                    dataGridItem: new DataSource({
                        store: new ArrayStore({
                            data: selectedItemList
                        })
                    })
                })
                //tutup popup
                this.setState({ isDeleteItem: false })
                //tampilin hasil di console
                console.log('hasil:')
                console.log(packagingParse)
            }
            if (packagingParse[this.state.selectedIndex]["Status"] == "EnableEditBox") {
                //siapin bahannya
                const validList = localStorage.getItem("ValidList");
                const validParse = JSON.parse(validList);
                //hapus barang terdaftar di register qty
                function isSame(y) {
                    return y.ItemCode == result.ItemCode
                }
                validParse.find(isSame)["RegisteredQty"] = validParse.find(isSame)["RegisteredQty"] - result.Qty
                //save di internal db
                localStorage.setItem("ValidList", JSON.stringify(validParse));
                //tampilin ke user
                this.setState({
                    validList: new DataSource({
                        store: new ArrayStore({
                            data: validParse
                        })
                    })
                })
                //hapus dari list item
                for (var i in selectedItemList) {
                    if (selectedItemList[i].No == result.No) {
                        const remove = selectedItemList.splice(i, 1);
                    }
                }
                //save di internal db
                localStorage.setItem('PackageList', JSON.stringify(packagingParse));
                //tampilin ke user
                this.setState({
                    dataGridItem: new DataSource({
                        store: new ArrayStore({
                            data: selectedItemList
                        })
                    })
                })
                //tutup popup deletenya
                this.setState({ isDeleteItem: false })
                //tampilin hasil ke console
                console.log('hasil:')
                console.log(packagingParse)
            }
        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function DeleteItem() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    FinishScan = async () => {
        try {
            console.log('finish scan')

            //set loading state to true
            this.setState({
                isLoading: true
            })
            //siapin bahan2nya
            const PackageList = localStorage.getItem('PackageList');
            const parse = JSON.parse(PackageList);
            const Token = localStorage.getItem('UserToken');
            //ubah value yang dibutuhkan
            parse[this.state.selectedIndex].PackageNo = Date.now().toString();
            parse[this.state.selectedIndex].Status = "FinishScanBox";
            parse[this.state.selectedIndex].PackingDate = moment().format("YYYY-MM-DD");
            //save di localstorage
            localStorage.setItem('PackageList', JSON.stringify(parse))
            //setup data buat body
            let y = [];
            let item = [];
            for (var i in parse[this.state.selectedIndex]["ItemList"]) {
                item.push({
                    "ItemCode": parse[this.state.selectedIndex]["ItemList"][i]["ItemCode"],
                    "ItemName": parse[this.state.selectedIndex]["ItemList"][i]["ItemName"],
                    "Qty": parse[this.state.selectedIndex]["ItemList"][i]["Qty"]
                })
            }
            y.push({
                "PackageNo": parse[this.state.selectedIndex]['PackageNo'],
                "PackageName": parse[this.state.selectedIndex]['PackagingName'],
                "PackingDate": parse[this.state.selectedIndex]["PackingDate"],
                "PackagingDetails": item,
                "Additional": {
                    "ID": parse[this.state.selectedIndex]["ID"],
                    "No": parse[this.state.selectedIndex]["No"],
                    "Status": parse[this.state.selectedIndex]["Status"]
                }
            })
            //POST Packaging fetch
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Access-Control-Allow-Origin", "*");

            var raw = JSON.stringify({
                "TransNo": localStorage.getItem("TransNo"),
                "AbsEntry": this.props.match.params.picklistnumber,
                "Packagings": y
            })

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/packaging`, requestOptions)
            const stat = await res.status
            const data = await res.json()

            //tampilin hasil ke console
            console.log('data yang ku submit ke POST Packaging:')
            console.log(raw)
            console.log('res dari be:')
            console.log(stat)
            console.log(data)
            console.log('data di local')
            console.log(parse)

            if (stat >= 200 && stat <= 300) {
                //siapin bahan2nya
                const userParse = parse[this.state.selectedIndex]["ItemList"];
                const validParse = JSON.parse(localStorage.getItem("ValidList"));

                //update registered qty di list validasi
                for (var i in userParse) {
                    function isItemDetected(y) {
                        return y.ItemCode == userParse[i].ItemCode
                    }
                    validParse[validParse.indexOf(validParse.find(isItemDetected))]["RegisteredQty"] = validParse[validParse.indexOf(validParse.find(isItemDetected))]["RegisteredQty"] + userParse[i].Qty;
                }

                //save di internal database
                localStorage.setItem("ValidList", JSON.stringify(validParse))

                //setstate loading, button, overlay, tabel validlist, table item
                this.setState({
                    isLoading: false,
                    table3: "none",
                    isScanItemFinish: false,
                    isScanSuccess: true,
                    canAddPackage: false,
                    enableEditBtn: false,
                    validList: new DataSource({
                        store: new ArrayStore({
                            data: validParse
                        })
                    }),
                    dataGridPackage: new DataSource({
                        store: new ArrayStore({
                            data: parse
                        })
                    })
                })

                console.log('post packaging berhasil')
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({
                    isLoading: false,
                    isScanItemFinish: false,
                    isClientSideErr: true,
                    errMsg: data.description
                })
                console.log('post packaging gagal')
                console.log(data.description)
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function FinishScan() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
            if (stat >= 500 && stat <= 600) {
                this.setState({
                    isLoading: false,
                    isScanItemFinish: false,
                    isServersideError: true,
                    errMsg: data.description
                })
                console.log('post packaging gagal')
                console.log(data.description)
                logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function FinishScan() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                isLoading: false,
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function FinishScan() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //enableEdit function
    enableEdit = async () => {
        try {
            console.log('enable edit');
            //set loading ke on 
            this.setState({
                isLoading: true
            })
            //siapin bahan
            const parse = JSON.parse(localStorage.getItem("PackageList"));
            const Token = localStorage.getItem("UserToken")
            //cari target
            const result = parse[this.state.selectedIndex]
            //siapin data utk kebutuhan body
            let y = {
                "PackageNo": result.PackageNo,
                "PackageName": result.PackagingName,
                "PackingDate": result.PackingDate,
                "PackagingDetails": [],
                "Additional": {
                    "ID": result.ID,
                    "No": result.No,
                    "Status": "EnableEditBox"
                }
            }
            for (var i in result.ItemList) {
                y.PackagingDetails.push({
                    "ItemCode": result.ItemList[i].ItemCode,
                    "ItemName": result.ItemList[i].ItemName,
                    "Qty": parseInt(result.ItemList[i].Qty)
                })
            }
            //Fetch process
            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify(y);

            let requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            }

            const res = await fetch(`${baseURL}/packaging/${this.props.match.params.picklistnumber}/${y.PackageNo}`, requestOptions);
            const stat = await res.status
            const data = await res.json()

            console.log('data yang ku submit ke PUT Packaging:')
            console.log(JSON.parse(raw))

            console.log('res dari be:')
            console.log(stat)
            console.log(data)

            if (stat >= 200 && stat <= 300) {
                //ubah data di localstorage
                parse[this.state.selectedIndex]["Status"] = "EnableEditBox"
                localStorage.setItem("PackageList", JSON.stringify(parse))
                //display data package ke user
                this.setState({
                    dataGridPackage: new DataSource({
                        store: new ArrayStore({
                            data: parse
                        })
                    })
                })
                //tampilin ke console
                console.log('data internal db & backend sudah berhasil dirubah')
                console.log(parse)
                //setstate html element
                this.setState({
                    canUserEdit: true,
                    canEnableEdit: "none",
                    canFinishEdit: "block",
                    textBoxStat: false,
                    canAddPackage: true,
                    PackageStatus: "EnableEditBox",
                    isLoading: false
                })
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({
                    isLoading: false,
                    isClientSideErr: true,
                    errMsg: data.description
                })
                console.log('enable edit gagal')
                console.log(data.description)
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function enableEdit() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
            if (stat >= 500 && stat <= 600) {
                this.setState({
                    isLoading: false,
                    isServersideError: true,
                    errMsg: data.description
                })
                console.log('put packaging gagal')
                console.log(data.description)
                logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function enableEdit() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                isLoading: false,
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function enableEdit() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //finish edit function
    finishEdit = async () => {
        try {
            console.log('finish edit');
            //set loading on && closepopup
            this.setState({
                isLoading: true
            })
            //siapin bahan
            const parse = JSON.parse(localStorage.getItem("PackageList"));
            const selectedBox = this.state.selectedTitle;
            const Token = localStorage.getItem("UserToken");
            function isSame(y) {
                return y.PackagingName === selectedBox
            }
            const result = parse.find(isSame);
            //setup body
            let y = {
                "PackageNo": result.PackageNo,
                "PackageName": result.PackagingName,
                "PackingDate": result.PackingDate,
                "PackagingDetails": [],
                "Additional": {
                    "ID": result.ID,
                    "No": result.No,
                    "Status": "FinishScanBox"
                }
            }
            for (var i in result.ItemList) {
                y.PackagingDetails.push({
                    "ItemCode": result.ItemList[i].ItemCode,
                    "ItemName": result.ItemList[i].ItemName,
                    "Qty": parseInt(result.ItemList[i].Qty)
                })
            }
            //fetch 
            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify(y);

            let requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            }

            const res = await fetch(`${baseURL}/packaging/${this.props.match.params.picklistnumber}/${y.PackageNo}`, requestOptions);
            const stat = await res.status
            const data = await res.json()

            //tampilin di console
            console.log('data yang ku submit ke PUT Packaging:')
            console.log(JSON.parse(raw))

            console.log('res dari be:')
            console.log(stat)
            console.log(data)

            if (stat >= 200 && stat <= 300) {
                //ganti status box
                parse.find(isSame).Status = "FinishScanBox";
                //save di internal db
                localStorage.setItem("PackageList", JSON.stringify(parse))

                //update register Qty (kalau ada waktu tolong rapiin ya)
                const validParse = JSON.parse(localStorage.getItem("ValidList"));
                let p = [];
                for (var i in parse) {
                    for (var u in parse[i].ItemList) {
                        p.push(parse[i].ItemList[u])
                    }
                }
                let itemCodeArr = [];
                for (var u in p) {
                    itemCodeArr.push(p[u].ItemCode)
                }
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }
                var unique = itemCodeArr.filter(onlyUnique);
                let resultArr = [];
                for (var g in unique) {
                    const result = p.filter(x => x.ItemCode == unique[g])
                    console.log('begin')
                    console.log(result)
                    console.log('end')
                    let arrQty = [];
                    for (var idx in result) {
                        arrQty.push(result[idx].Qty)
                    }
                    resultArr.push(arrQty.reduce((x, y) => x + y))
                }
                let z = [];
                for (var g in unique) {
                    function isSame(y) {
                        return y.ItemCode == unique[g]
                    }
                    z.push({
                        "ItemCode": unique[g],
                        "Qty": resultArr[g]
                    })
                }
                for (var h in z) {
                    function isSame(y) {
                        return y.ItemCode == z[h].ItemCode
                    }
                    validParse.find(isSame).RegisteredQty = z[h].Qty
                }
                localStorage.setItem('ValidList', JSON.stringify(validParse));

                //setstate html element
                this.setState({
                    validList: new DataSource({
                        store: new ArrayStore({
                            data: validParse
                        })
                    }),
                    canAddPackage: false,
                    isLoading: false,
                    isEditItemFinish: false,
                    isEditItemSuccess: true,
                    table3: "none",
                    dataGridPackage: new DataSource({
                        store: new ArrayStore({
                            data: parse
                        })
                    })
                })
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({
                    isLoading: false,
                    isClientSideErr: true,
                    errMsg: data.description
                })
                console.log('finish edit gagal');
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function finishEdit() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
            if (stat >= 500 && stat <= 600) {
                this.setState({
                    isLoading: false,
                    isServersideError: true,
                    errMsg: data.description
                })
                console.log('finish edit gagal');
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function finishEdit() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
        }
        catch (err) {
            console.log(err)
            this.setState({
                isLoading: false,
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function finishEdit() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //function for cancel process
    cancel = async () => {
        try {
            //set on loading 
            this.setState({ isLoading: true })
            //fetch
            const Token = localStorage.getItem("UserToken");

            let myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Accept", "application/json");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            const res = await fetch(`${baseURL}/packaging/${this.props.match.params.picklistnumber}`, requestOptions)
            const stat = await res.status
            const data = await res.json()

            console.log(stat)
            console.log(data)

            if (stat >= 200 && stat <= 300) {
                if (data.Packagings.length == 0) {
                    this.setState({
                        isCancel: true,
                        isLoading: false
                    })
                }
                if (data.Packagings.length > 0) {
                    this.setState({
                        isCancelandDelete: true,
                        isLoading: false
                    })
                }
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({
                    isLoading: false,
                    isClientSideErr: true,
                    errMsg: data.description
                })
                console.log('cancel gagal')
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function cancel() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
            if (stat >= 500 && stat <= 600) {
                this.setState({
                    isLoading: false,
                    isServersideError: true,
                    errMsg: data.description
                })
                console.log('cancel gagal');
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function cancel() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
        }
        catch (err) {
            console.log(err)
            this.setState({
                isLoading: false,
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function cancel() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    cancel1 = async () => {
        try {
            //set loading on
            this.setState({
                isLoading: true
            })
            //siapin data yang diperlukan
            const Token = localStorage.getItem("UserToken")

            //fetch
            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "IsLocked": false
            })

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/lock-picklist/${this.props.match.params.picklistnumber}`, requestOptions);
            const stat = await res.status
            const data = await res.json()

            console.log('res dari be:')
            console.log(stat)
            console.log(data)

            if (stat >= 200 && stat <= 300) {
                //hapus semua data validasi dan package di local
                window.localStorage.removeItem("PackageList");
                window.localStorage.removeItem("ValidList");
                window.localStorage.removeItem("AbsEntry");
                window.localStorage.removeItem("TransNo")

                console.log('data local sudah dihapus')

                this.setState({
                    isLoading: false,
                    isCancelSuccess: true
                })
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({
                    isLoading: false,
                    isClientSideErr: true,
                    errMsg: data.description
                })
                console.log('cancel gagal')
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function cancel1() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
            if (stat >= 500 && stat <= 600) {
                this.setState({
                    isLoading: false,
                    isServersideError: true,
                    errMsg: data.description
                })
                console.log('cancel gagal');
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function cancel1() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                isLoading: false,
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function cancel1() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    cancel2 = async (cb) => {
        try {
            //siapin data yang diperlukan
            const Token = localStorage.getItem("UserToken");
            //fetch
            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "IsLocked": false
            })

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/lock-picklist/${this.props.match.params.picklistnumber}`, requestOptions);
            const stat = await res.status
            const data = await res.json()

            console.log('res dari be:')
            console.log(stat)
            console.log(data)

            if (cb) {
                cb(stat, data)
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                isLoading: false,
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function cancel2() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    cancel2AndDelete = () => {
        this.cancel2(async (stat, data) => {
            try {
                //set on loading
                this.setState({ isLoading: true })

                if (stat >= 200 && stat <= 300) {
                    //tampilin di console
                    console.log('lock-picklist berhasil');

                    //delete internal db
                    window.localStorage.removeItem("PackageList");
                    window.localStorage.removeItem("ValidList");
                    window.localStorage.removeItem("AbsEntry");
                    window.localStorage.removeItem("TransNo");

                    //delete data in be
                    const Token = localStorage.getItem("UserToken");

                    let myHeaders = new Headers();
                    myHeaders.append('Authorization', `Bearer ${Token}`);
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Accept", "application/json");

                    let requestOptions = {
                        method: 'DELETE',
                        headers: myHeaders,
                        redirect: 'follow',
                    };

                    const res = await fetch(`${baseURL}/packaging/${this.props.match.params.picklistnumber}`, requestOptions);
                    const status = await res.status;
                    const info = await res.json();

                    console.log('res dari be:')
                    console.log(status)
                    console.log(info)

                    if (status >= 200 && status <= 300) {
                        console.log('data di be berhasil dihapus')
                        this.setState({
                            isLoading: false,
                            isCancelandDelete: false,
                            isCancelSuccess: true
                        })
                    }
                    if (status >= 400 && status <= 500) {
                        this.setState({
                            isLoading: false,
                            isClientSideErr: true,
                            errMsg: data.description
                        })
                        console.log('cancel and delete gagal')
                        console.log(data.description);
                        logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function cancel2AndDelete() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                    }
                    if (status >= 500 && status <= 600) {
                        this.setState({
                            isLoading: false,
                            isServersideError: true,
                            errMsg: data.description
                        })
                        console.log('cancel and delete gagal');
                        console.log(data.description);
                        logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function cancel2AndDelete() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                    }
                }
                if (stat >= 400 && stat <= 500) {
                    this.setState({
                        isLoading: false,
                        isClientSideErr: true,
                        errMsg: data.description
                    })
                    console.log('cancel gagal')
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function cancel2() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                }
                if (stat >= 500 && stat <= 600) {
                    this.setState({
                        isLoading: false,
                        isServersideError: true,
                        errMsg: data.description
                    })
                    console.log('cancel gagal');
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function cancel2() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                }
            }
            catch (err) {
                console.log(err);
                this.setState({
                    isLoading: false,
                    tryCatchErrMsg: err,
                    isTryCatchErr: true
                })
                logger.error(`@Gleenald App Error! function cancel2AndDelete() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }

    //function buat scan item
    scanBarcode = () => {
        try {
            this.setState({ isLoading: true })
            //siapin bahan
            const DataValidasi = JSON.parse(window.localStorage.getItem("ValidList"));
            const UserInput = this.state.scanItem;
            const DataPackaging = JSON.parse(window.localStorage.getItem("PackageList"))
            const selectedIndex = this.state.selectedIndex
            //cari itemnya
            let TargetItem = {};
            for (var i in DataValidasi) {
                for (var id in DataValidasi[i]["Barcode"]) {
                    if (DataValidasi[i]["Barcode"][id] == UserInput) {
                        TargetItem.Barcode = DataValidasi[i]["Barcode"]
                        TargetItem.ItemCode = DataValidasi[i]["ItemCode"]
                        TargetItem.ItemName = DataValidasi[i]["ItemName"]
                        TargetItem.Qty = 1
                        break;
                    }
                }
            }
            //jika item ga ketemu
            if (Object.keys(TargetItem).length == 0) {
                this.setState({
                    isLoading: false,
                    isItemNotFound: true
                })
            }
            //jika item ketemu
            if (Object.keys(TargetItem).length !== 0) {
                //jika bukan item pertama box
                if (DataPackaging[selectedIndex]["ItemList"].length !== 0) {
                    //cari item apa udah ada di box apa belum
                    function isSame(y) {
                        return y.ItemCode == TargetItem.ItemCode
                    }
                    //jika item udah ada
                    if (DataPackaging[selectedIndex]["ItemList"].find(isSame) !== undefined) {
                        //proses jumlah item terjadi
                        const target = DataPackaging[selectedIndex]["ItemList"].find(isSame)
                        DataPackaging[selectedIndex]["ItemList"][DataPackaging[selectedIndex]["ItemList"].indexOf(target)]["Qty"] = DataPackaging[selectedIndex]["ItemList"][DataPackaging[selectedIndex]["ItemList"].indexOf(target)]["Qty"] + 1
                        //save ke internaldb
                        window.localStorage.setItem("PackageList", JSON.stringify(DataPackaging))
                        //tampilin ke user
                        this.setState({
                            dataGridItem: new DataSource({
                                store: new ArrayStore({
                                    data: DataPackaging[selectedIndex]["ItemList"]
                                })
                            }),
                            isLoading: false,
                            scanItem: ""
                        })
                        //tampilin di console
                        console.log('scan berhasil & item berhasil dijumlahkan')
                        console.log(DataPackaging)
                    }
                    //jika item belum ada
                    if (DataPackaging[selectedIndex]["ItemList"].find(isSame) == undefined) {
                        //setup data
                        DataPackaging[selectedIndex]["ItemList"].push({
                            "ItemCode": TargetItem.ItemCode,
                            "ItemName": TargetItem.ItemName,
                            "Qty": 1,
                            "No": DataPackaging[selectedIndex]["ItemList"].length + 1
                        })
                        //save ke internal db
                        window.localStorage.setItem('PackageList', JSON.stringify(DataPackaging));
                        //tampilin data ke user
                        this.setState({
                            dataGridItem: new DataSource({
                                store: new ArrayStore({
                                    data: DataPackaging[selectedIndex]["ItemList"]
                                })
                            }),
                            scanItem: "",
                            isLoading: false
                        })
                        console.log('scan item berhasil')
                        console.log(DataPackaging)
                    }
                }
                //jika ini item pertama di box
                if (DataPackaging[selectedIndex]["ItemList"].length == 0) {
                    //setup data
                    DataPackaging[selectedIndex]["ItemList"].push({
                        "ItemCode": TargetItem.ItemCode,
                        "ItemName": TargetItem.ItemName,
                        "Qty": 1,
                        "No": 1
                    })
                    //simpan ke db internal
                    window.localStorage.setItem('PackageList', JSON.stringify(DataPackaging));
                    //tampilin ke user
                    this.setState({
                        dataGridItem: new DataSource({
                            store: new ArrayStore({
                                data: DataPackaging[selectedIndex]["ItemList"]
                            })
                        }),
                        scanItem: "",
                        isLoading: false
                    })
                    //tampilin di console
                    console.log('scan pertama di box ini berhasil')
                    console.log(DataPackaging)
                }

            }



        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function scanBarcode() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    scanItemCode = () => {
        try {
            //siapin data yang dibutuhkan
            const listValidasi = localStorage.getItem('ValidList');
            const parseValidasi = JSON.parse(listValidasi);
            const barcode = this.state.scanItem;

            //detect ada engga itemcode yang dicari
            function isSame(y) {
                return y.ItemCode == barcode
            }
            //jika item tidak ketemu
            if (parseValidasi.find(isSame) == undefined) {
                this.setState({ isItemNotFound: true })
            }
            //jika item ketemu
            if (parseValidasi.find(isSame) !== undefined) {
                //siapin data yang dibutuhkan
                const listPackaging = localStorage.getItem('PackageList');
                const packagingParse = JSON.parse(listPackaging);
                const index = this.state.selectedIndex;

                if (packagingParse[index]['ItemList'].length !== 0) {

                    //detect sudah ada belum item di kardus itu
                    function isItemSame(y) {
                        return y.ItemCode == barcode
                    }
                    if (packagingParse[index]['ItemList'].find(isItemSame) !== undefined) {

                        console.log('penjumlahan item');
                        //ilangin apa yang diinput user
                        this.setState({ scanItem: "" })
                        //proses jumlahin item 
                        const target = packagingParse[index]['ItemList'].find(isItemSame)
                        packagingParse[index]['ItemList'][packagingParse[index]['ItemList'].indexOf(target)]["Qty"] = packagingParse[index]['ItemList'][packagingParse[index]['ItemList'].indexOf(target)]["Qty"] + 1;
                        //save ke internal db
                        localStorage.setItem("PackageList", JSON.stringify(packagingParse))
                        //tampilin data ke user
                        this.setState({
                            dataGridItem: new DataSource({
                                store: new ArrayStore({
                                    data: packagingParse[index]['ItemList']
                                })
                            })
                        })
                    }
                    //jika belum ada jenis item itu
                    if (packagingParse[index]['ItemList'].find(isItemSame) == undefined) {

                        //susun data utk dimasukin ke internal db
                        packagingParse[index]['ItemList'].push({
                            "ItemCode": parseValidasi.find(isSame).ItemCode,
                            "ItemName": parseValidasi.find(isSame).ItemName,
                            "Qty": 1,
                            "No": packagingParse[index]['ItemList'].length + 1
                        })
                        //save ke internal db
                        let string = JSON.stringify(packagingParse);
                        localStorage.setItem('PackageList', string);
                        //tampilin data ke user yang terbaru
                        this.setState({
                            dataGridItem: new DataSource({
                                store: new ArrayStore({
                                    data: packagingParse[index]['ItemList']
                                })
                            })
                        })
                        //ilangin apa yang diinput user
                        this.setState({ scanItem: "" })
                        //tampilin di console
                        console.log('item telah masuk ke database:')
                        console.log(packagingParse)
                    }
                }
                //jika di kardus belum ada barangnya 
                if (packagingParse[index]['ItemList'].length == 0) {

                    //susun data utk dimasukin ke internal db
                    packagingParse[index]['ItemList'].push({
                        "ItemCode": parseValidasi.find(isSame).ItemCode,
                        "ItemName": parseValidasi.find(isSame).ItemName,
                        "Qty": 1,
                        "No": packagingParse[index]['ItemList'].length + 1
                    })
                    //save data ke internal db
                    let string = JSON.stringify(packagingParse);
                    localStorage.setItem('PackageList', string);
                    //tampilin user data terbaru
                    this.setState({
                        dataGridItem: new DataSource({
                            store: new ArrayStore({
                                data: packagingParse[index]['ItemList']
                            })
                        })
                    })
                    //ilangin apa yang diinput user
                    this.setState({ scanItem: "" })
                    //keluarin di console
                    console.log('item telah masuk ke database:')
                    console.log(packagingParse)

                }
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function scanItemCode() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //function create delivery
    createDelivery1 = () => {
        try {
            //siapin bahan yang dibutuhkan
            const packageList = localStorage.getItem("PackageList");
            const packageParse = JSON.parse(packageList);
            const validList = localStorage.getItem("ValidList");
            const validParse = JSON.parse(validList);

            console.log(packageParse)

            //jika user ga pernah daftarin barang sama sekali
            if (!packageParse) {
                this.setState({ isDeliveryItemNull: true })
            }
            if (packageParse) {
                //push itemcode ke arr result
                let result = [];
                for (var i in packageParse) {
                    for (var a in packageParse[i].ItemList) {
                        result.push(packageParse[i].ItemList[a].ItemCode)
                    }
                }
                if (result.length < validParse.length) {
                    this.setState({ isTypeItemLess: true })
                }
                if (result.length == validParse.length) {
                    console.log('jumlah item sudah sama');

                    //jalanin proses membandingkan
                    let perbandingan = [];
                    for (var i in validParse) {
                        if (validParse[i].PickQty == validParse[i].RegisteredQty) {
                            perbandingan.push('sama')
                        }
                        if (validParse[i].RegisteredQty < validParse[i].PickQty) {
                            perbandingan.push('kurang')
                        }
                        if (validParse[i].RegisteredQty > validParse[i].PickQty) {
                            perbandingan.push('lebih')
                        }
                    }
                    function same(x) {
                        return x == 'sama'
                    }
                    function more(y) {
                        return y == 'lebih'
                    }
                    function less(z) {
                        return z == 'kurang'
                    }
                    if (perbandingan.some(more)) {
                        console.log('gagal kebanyakan soalnya')
                        this.setState({ isQtyMore: true })
                        return;
                    }
                    if (perbandingan.some(less)) {
                        if (perbandingan.some(more)) {
                            console.log('gagal kebanyakan soalnya');
                            this.setState({ isQtyMore: true })
                            return;
                        }
                        if (perbandingan.some(same) || perbandingan.some(less)) {
                            this.setState({ isQtyLess: true })
                            console.log('berhasil')
                            return;
                        }
                    }
                    if (perbandingan.some(same)) {
                        if (perbandingan.some(more)) {
                            console.log('gagal kebanyakan soalnya')
                            this.setState({ isQtyMore: true })
                            return;
                        }
                        if (perbandingan.some(less)) {
                            this.setState({ isQtyLess: true })
                            console.log('berhasil')
                            return;
                        }
                        if (perbandingan.some(same)) {
                            this.setState({ isQtyMatch: true })
                            console.log('berhasil')
                            return;
                        }
                    }
                }
            }

        }
        catch (err) {
            console.log(err)
            this.setState({
                tryCatchErrMsg: "",
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function createDelivery1() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    createDelivery2 = async () => {
        try {
            this.setState({ isLoading: true })
            //siapin bahannya
            //const token = window.localStorage.getItem("UserToken");
            const validParse = JSON.parse(window.localStorage.getItem("ValidList"))

            let y = [];
            for (var i in validParse) {
                y.push({
                    "ItemCode": validParse[i].ItemCode,
                    "Qty": validParse[i].RegisteredQty
                })
            }

            //fetch
            let myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBULiBTSU5BUiBBU0lBIEpBWUEiLCJ1c2VyaWQiOiJDT05CLTAwNzctMDAwMCIsImVtYWlsIjoic3VwcGx5Y2hhaW4wMy5vbmRhQGdtYWlsLmNvbSIsImlhdCI6MTY0NTUwNDgzMSwiZXhwIjoxNjQ2NzE0NDMxfQ.RHXT-4jIGT_grtPVCWyXI3AH8d5MAdcT5tjLqcOzb7A");
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                // "TransNo": window.localStorage.getItem("TransNo"),
                "AbsEntry": window.localStorage.getItem("AbsEntry"),
                "DeliveryDetails": y
            })

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

            console.log(`data yang kusubmit di be: ${raw}`)

            if (stat >= 200 && stat <= 300) {
                this.setState({
                    isDeliverySuccess: true,
                    isLoading: false,
                    isTypeItemLess: false,
                    isQtyLess: false,
                    isQtyMatch: false
                })

                //hapus semua yang ada di internal
                window.localStorage.removeItem("PackageList");
                window.localStorage.removeItem("ValidList");
                window.localStorage.removeItem("AbsEntry");
                window.localStorage.removeItem("TransNo")

                //munculin hasil di log
                console.log('aplikasi berhasil post delivery')
                console.log('res dari be:')
                console.log(data.description)

                //munculin hasil di telegram
                logger.log(`aplikasi berhasil post delivery absentry:${window.localStorage.getItem("AbsEntry")}`);;
                logger.log(`response dari be: ${data.description}`)
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({
                    isLoading: false,
                    isTypeItemLess: false,
                    isQtyLess: false,
                    isQtyMatch: false,
                    isClientSideErr: true,
                    errMsg: data.description
                })
                console.log('gagal post delivery')
                console.log(data.description)
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function createDelivery() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
            if (stat >= 500 && stat <= 600) {
                this.setState({
                    isLoading: false,
                    isTypeItemLess: false,
                    isQtyLess: false,
                    isQtyMatch: false,
                    isServersideError: true,
                    errMsg: data.description
                })
                console.log('gagal post delivery')
                console.log(data.description)
                logger.error(`@Gleenald HTTP Stat: ${stat}, serverside Error, function createDelivery() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: "",
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function createDelivery2() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //superUserPass Function
    EditPackageSuperUser = () => {
        try {
            if (this.state.superUserPass == "ds2022") {
                console.log('superuser password benar')
                this.setState({
                    isEditPackageName: true,
                    superUserPass: "",
                    isSuperUserEditPackage: false
                })
            }
            else {
                console.log('superuser password salah')
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    DeletePackageSuperUser = () => {
        try {
            if (this.state.superUserPass == "ds2022") {
                console.log('super user password benar')
                this.setState({
                    isDeletePackage: true,
                    isSuperUserDeletePackage: false
                })
            }
            else {
                console.log('password superuser salah')
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    EditQtyItemSuperUser = () => {
        try {
            if (this.state.superUserPass == "ds2022") {
                console.log('super user password benar')
                this.setState({
                    isEditQtyItem: true,
                    isSuperUserEditQtyItem: false
                })
            }
            else {
                console.log('super user password salah')
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    DeleteItemSuperUser = () => {
        try {
            if (this.state.superUserPass == "ds2022") {
                console.log('super user password benar')
                this.setState({
                    isDeleteItem: true,
                    isSuperUserDeleteItem: false
                })
            }
            else {
                console.log('super user password salah')
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    EnableEditSuperUser = () => {
        try {
            if (this.state.superUserPass == "ds2022") {
                console.log('super user password benar')
                this.enableEdit()
                this.setState({ isSuperUserEnableEdit: false })
            }
            else {
                console.log('super user password salah')
            }
        }
        catch (err) {
            console.log(err)
        }
    }


    //function buat print
    print = async () => {
        try {
            console.log('print')
            //set on loading
            this.setState({
                isLoading: false
            })
            console.log(this.state.selectedPrint)
            //siapin bahan bahannya
            const token = window.localStorage.getItem("UserToken");
            const AbsEntry = window.localStorage.getItem("AbsEntry");
            const name = this.state.selectedPrint
            //fetch
            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            }

            const res = await fetch(`${baseURL}/packaging/${AbsEntry}`, requestOptions)
            const stat = await res.status
            const data = await res.json()

            console.log(stat);
            console.log(data);

            if (stat >= 200 && stat <= 300) {
                function isSame(y) {
                    return y.PackageName == name
                }

                let ItemList = data.Packagings.find(isSame).PackagingDetails;
                for (var i in ItemList) {
                    ItemList[i].No = parseInt(i) + 1
                }

                if (ItemList.length < 6) {
                    let count = 6 - ItemList.length

                    for (let i = 0; i < count; i++) {
                        ItemList.push({ ItemName: "empty" })
                    }
                }

                console.log(ItemList);

                //console.log(data.Packagings.find(isSame))
                this.state.print["PackageName"] = data.Packagings.find(isSame).PackageName
                this.state.print["CustomerName"] = "PT. Catur Mitra Sejati Sentosa" //masih null
                this.state.print["Notice"] = "Kirim K M10 Teluk Jambe EXPO PO 04 MEI 2022 (22/03/2022). JANGAN LUPA INI PACKERNYA SALMAN" //masih null
                this.state.print["PickNo"] = "35754" //untuk pickno ini ambil properties yang mana ya?
                this.state.print["PONo"] = "220007503" //ini ambil dari PONo dari properties apa ya?
                this.state.print["Packer"] = "Salman" //ini ambil dari properties username ya?
                this.state.print["PackingDate"] = moment(data.Packagings.find(isSame).PackingDate).format("YYYY/MM/D")
                this.state.print["ItemList"] = ItemList


                this.setState({
                    isLoading: false,
                    isPrint: true,
                    isPrintDisplay: true
                })

                if (this.state.print["ItemList"].length >= 28) {
                    const item_list_len = this.state.print["ItemList"].length
                    const len_page_one = item_list_len - 10;
                    const modulus = len_page_one % 18

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
                                text: `Page ${i + 1}`
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
                        const total_page = Math.floor(len_page_one / 18) + 2;

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
                                text: `Page ${i + 1}`
                            })
                        }

                        this.setState({ dropDown4: dropDown }, () => {
                            console.log(this.state.dropDown4)
                        })

                        //buat idx slice
                        let count = total_page - 2;
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
                                awal.push(awal[i - 1] + 18)
                            }
                        }

                        for (var i = 0; i < count; i++) {
                            if (i == 0) {
                                akhir.push(10 + 18)
                            }
                            if (i != 0) {
                                akhir.push(akhir[i - 1] + 18)
                            }
                        }

                        this.setState({
                            result: result,
                            awal: awal,
                            akhir: akhir
                        }, () => { console.log(`${this.state.result}, ${this.state.awal}, ${this.state.akhir}`) })

                    }
                }

            }
            if (stat >= 400 && stat <= 500) {
                //keluarin alert buat user
                this.setState({
                    isLoading: false,
                    isClientSideErr: true,
                    errMsg: data.description
                })
                //keluarin di console
                console.log('gagal print')
                console.log(data.description)
                //keluarin di telegram
                logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function print() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
            if (stat >= 500 && stat <= 600) {
                //keluarin alert buat user
                this.setState({
                    isLoading: false,
                    isServersideError: true,
                    errMsg: data.description
                })
                //keluarin di console
                console.log('gagal print')
                console.log(data.description)
                //keluarin di telegram
                logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function print() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
            }
        }
        catch (err) {
            console.log(err);
            this.setState({
                isLoading: false,
                tryCatchErrMsg: "",
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function print() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    generatePDF = () => {
        try {
            var doc = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [173.64, 260.477]
            })

            doc.html(document.querySelector("#print2"), {
                callback: function (pdf) {
                    pdf.save('myfile.pdf');
                }
            })
        }
        catch (err) {
            console.log(err);
            this.setState({
                tryCatchErrMsg: "",
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function generatePDF() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }


    //cellrender function
    cellRenderPackagingName = (data) => {
        return <div>
            <a
                style={{
                    fontWeight: '400'
                }}
                onClick={() => {
                    //munculin tabel barang
                    this.setState({ table3: "block" })

                    //dapetin data box yang dipilih user
                    const PackageLocalStorage = localStorage.getItem('PackageList');
                    const parse = JSON.parse(PackageLocalStorage)

                    function isSelectedData(e) {
                        return e['PackagingName'] === data.value
                    }
                    const n = parse.find(isSelectedData)

                    //simpen index box dan nama box ke state
                    this.setState({
                        selectedIndex: parse.indexOf(n),
                        selectedTitle: parse[parse.indexOf(n)]['PackagingName']
                    })

                    //display item list ke table 3
                    this.setState({
                        dataGridItem: new DataSource({
                            store: new ArrayStore({
                                data: parse[parse.indexOf(n)].ItemList
                            })
                        })
                    })

                    //setup element html sesuai status box nya
                    if (data.row.data.Status === "NewBox") {
                        this.setState({
                            textBoxStat: false,
                            finishScanBtn: false,
                            canEnableEdit: "block",
                            canFinishEdit: "none",
                            enableEditBtn: true,
                            PackageStatus: data.row.data.Status
                        })
                    }
                    if (data.row.data.Status === "FinishScanBox") {
                        this.setState({
                            textBoxStat: true,
                            finishScanBtn: true,
                            canEnableEdit: "block",
                            canFinishEdit: "none",
                            enableEditBtn: false,
                            PackageStatus: data.row.data.Status
                        })
                    }
                    if (data.row.data.Status === "EnableEditBox") {
                        this.setState({
                            textBoxStat: false,
                            finishScanBtn: true,
                            canEnableEdit: "none",
                            canFinishEdit: "block",
                            enableEditBtn: true,
                            PackageStatus: data.row.data.Status
                        })
                    }
                }}
            >
                {data.value}
            </a>
        </div>
    }
    cellRenderPackageAction = (data) => {
        if (data.row.data.Status === "NewBox") {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={
                        () => {
                            this.setState({ editTitle: data.values[1] }, () => {
                                this.setState({ isSuperUserEditPackage: true })
                            })
                        }
                    }
                >
                    <u>Edit</u>
                </p>

                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={
                        () => {
                            this.setState({ editTitle: data.values[1] }, () => {
                                this.setState({ isSuperUserDeletePackage: true })
                            })
                        }
                    }
                >
                    <u>Delete</u>
                </p>

                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        color: "#BEBEBE",
                        fontWeight: "400",
                        pointerEvents: "none"
                    }}
                    onClick={
                        () => {
                            console.log(data.values[1])
                            this.setState({ editTitle: data.values[1] }, () => {
                                console.log('print')
                            })
                        }
                    }
                >
                    <u>Print</u>
                </p>
            </div>
        }
        if (data.row.data.Status === "FinishScanBox") {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#BEBEBE",
                        fontWeight: "400",
                        pointerEvents: "none"
                    }}
                    onClick={
                        () => {
                            this.setState({ editTitle: data.values[1] }, () => {
                                this.setState({ isSuperUserEditPackage: true })
                            })
                        }
                    }
                >
                    <u>Edit</u>
                </p>

                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#BEBEBE",
                        fontWeight: "400",
                        pointerEvents: "none"
                    }}
                    onClick={
                        () => {
                            this.setState({ editTitle: data.values[1] }, () => {
                                this.setState({ isSuperUserDeletePackage: true })
                            })
                        }
                    }
                >
                    <u>Delete</u>
                </p>

                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={() => {
                        this.setState({ selectedPrint: data.values[1] }, () => {
                            this.print()
                        })
                    }}
                >
                    <u>Print</u>
                </p>
            </div>
        }
        if (data.row.data.Status === "EnableEditBox") {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={
                        () => {
                            this.setState({ editTitle: data.values[1] }, () => {
                                this.setState({ isEditPackageName: true })
                            })
                        }
                    }
                >
                    <u>Edit</u>
                </p>

                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={
                        () => {
                            this.setState({ editTitle: data.values[1] }, () => {
                                this.setState({ isDeletePackage: true })
                            })
                        }
                    }
                >
                    <u>Delete</u>
                </p>

                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        color: "#bebebe",
                        fontWeight: "400",
                        pointerEvents: "none"
                    }}
                    onClick={
                        () => {
                            console.log(data.values[1])
                            this.setState({ editTitle: data.values[1] }, () => {
                                console.log('print')
                            })
                        }
                    }
                >
                    <u>Print</u>
                </p>
            </div>
        }
    }
    cellRenderItemAction = (data) => {
        if (this.state.PackageStatus === "NewBox") {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={
                        () => {
                            this.setState({
                                isSuperUserEditQtyItem: true,
                                itemName: data.data.ItemName,
                                itemQty: data.data.Qty,
                                itemNo: data.data.No
                            })
                        }
                    }
                >
                    <u>Edit</u>
                </p>
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={
                        () => {
                            this.setState({
                                isSuperUserDeleteItem: true,
                                itemName: data.data.ItemName,
                                itemQty: data.data.Qty,
                                itemNo: data.data.No
                            })
                        }

                    }
                >
                    <u>Delete</u>
                </p>
            </div>
        }
        if (this.state.PackageStatus === "FinishScanBox") {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#BEBEBE",
                        fontWeight: "400",
                        pointerEvents: "none"
                    }}
                    onClick={
                        () => {
                            this.setState({
                                isSuperUserEditQtyItem: true,
                                itemName: data.data.ItemName,
                                itemQty: data.data.Qty,
                                itemNo: data.data.No
                            })
                        }
                    }
                >
                    <u>Edit</u>
                </p>
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#BEBEBE",
                        fontWeight: "400",
                        pointerEvents: "none"
                    }}
                    onClick={
                        () => {
                            this.setState({
                                isSuperUserDeleteItem: true,
                                itemName: data.data.ItemName,
                                itemQty: data.data.Qty,
                                itemNo: data.data.No
                            })
                        }

                    }
                >
                    <u>Delete</u>
                </p>
            </div>
        }
        if (this.state.PackageStatus === "EnableEditBox") {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={
                        () => {
                            this.setState({
                                isEditQtyItem: true,
                                itemName: data.data.ItemName,
                                itemQty: data.data.Qty,
                                itemNo: data.data.No
                            })
                        }
                    }
                >
                    <u>Edit</u>
                </p>
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "#4b85bb",
                        fontWeight: "400",
                        pointerEvents: "auto"
                    }}
                    onClick={
                        () => {
                            this.setState({
                                isDeleteItem: true,
                                itemName: data.data.ItemName,
                                itemQty: data.data.Qty,
                                itemNo: data.data.No
                            })
                        }

                    }
                >
                    <u>Delete</u>
                </p>
            </div>
        }
    }
    cellRenderValidList = (data) => {
        if (data.values[4] < data.values[3]) {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "orange",
                        fontWeight: "400",
                    }}
                >
                    {data.value}
                </p>
            </div>
        }
        if (data.values[4] > data.values[3]) {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "red",
                        fontWeight: "500",
                    }}
                >
                    {data.value}
                </p>
            </div>
        }
        if (data.values[4] == data.values[3]) {
            return <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 25
                }}
            >
                <p
                    style={{
                        position: "relative",
                        bottom: "10px",
                        marginRight: "10px",
                        color: "green",
                        fontWeight: "400",
                    }}
                >
                    {data.value}
                </p>
            </div>
        }
    }



    //function buat dapetin data validasi dan data package
    getValid = async (cb) => {
        try {
            //fetch process begin!
            const Token = localStorage.getItem("UserToken");

            let myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Accept", "application/json");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            const res = await fetch(`${baseURL}/picklist/${this.props.match.params.picklistnumber}`, requestOptions);
            const stat = await res.status;
            const data = await res.json();

            if (cb) {
                cb(stat, data)
            }
        }
        catch (err) {
            console.log(err)
            this.setState({
                isLoading: false,
                tryCatchErrMsg: err,
                isTryCatchErr: true
            })
            logger.error(`@Gleenald App Error! function getValid() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
        }
    }
    getValidAndPackage = () => {
        this.getValid(async (stat, data) => {
            try {
                if (stat >= 200 && stat <= 300) {
                    //siapin data validasi buat ditampilin ke user
                    let ValidArr = [];

                    for (var i in data.PicklistDetails) {
                        ValidArr.push({
                            "Barcode": data.PicklistDetails[i].Barcode,
                            "ItemCode": data.PicklistDetails[i].ItemCode,
                            "ItemName": data.PicklistDetails[i].ItemName,
                            "PickQty": data.PicklistDetails[i].PickQty,
                            "No": parseInt(i) + 1,
                            "RegisteredQty": 0
                        })
                    }

                    //masukin validasi data barang ke local storage
                    let stringValidData = JSON.stringify(ValidArr);
                    localStorage.setItem('ValidList', stringValidData);

                    //fetch process untuk dapetin data package di db node js
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

                    const res = await fetch(`${baseURL}/packaging/${this.props.match.params.picklistnumber}`, requestOptions);
                    const status = await res.status;
                    const info = await res.json();

                    if (status >= 200 && status <= 300) {
                        if (info.Packagings.length == 0) {
                            //generate new transno & masukin transno ke localStorage
                            if (window.localStorage.getItem("TransNo")) {
                                console.log(`TransNo : ${window.localStorage.getItem("TransNo")}`)
                            }
                            if (!window.localStorage.getItem("TransNo")) {
                                console.log('tidak ada transno')
                                window.localStorage.setItem("TransNo", Date.now().toString());

                                console.log(`TransNo sudah dibuat : ${window.localStorage.getItem("TransNo")}`)
                            }

                            //masukin no absEntry ke localstorage
                            if (window.localStorage.getItem("AbsEntry")) {
                                console.log(`AbsEntry : ${window.localStorage.getItem("AbsEntry")}`)
                            }
                            if (!window.localStorage.getItem("AbsEntry")) {
                                console.log('tidak ada AbsEntry')
                                window.localStorage.setItem("AbsEntry", this.props.match.params.picklistnumber)

                                console.log(`AbsEntry sudah dibuat : ${window.localStorage.getItem('AbsEntry')}`)
                            }

                            //remove packagelist data
                            window.localStorage.removeItem("PackageList")

                            this.setState({
                                validList: new DataSource({
                                    store: new ArrayStore({
                                        data: ValidArr
                                    })
                                }),
                                isLoading: false,
                            })

                            const validList = localStorage.getItem("ValidList");
                            const validParse = JSON.parse(validList);

                            console.log('data validasinya adalah: ')
                            console.log(validParse)
                        }
                        if (info.Packagings.length > 0) {
                            //generate new transno & masukin transno ke localStorage
                            if (window.localStorage.getItem("TransNo")) {
                                console.log(`TransNo : ${window.localStorage.getItem("TransNo")}`)
                            }
                            if (!window.localStorage.getItem("TransNo")) {
                                console.log('tidak ada transno')
                                window.localStorage.setItem("TransNo", Date.now().toString());

                                console.log(`TransNo sudah dibuat : ${window.localStorage.getItem("TransNo")}`)
                            }

                            //masukin no absEntry ke localstorage
                            if (window.localStorage.getItem("AbsEntry")) {
                                console.log(`AbsEntry : ${window.localStorage.getItem("AbsEntry")}`)
                            }
                            if (!window.localStorage.getItem("AbsEntry")) {
                                console.log('tidak ada AbsEntry')
                                window.localStorage.setItem("AbsEntry", this.props.match.params.picklistnumber)

                                console.log(`AbsEntry sudah dibuat : ${window.localStorage.getItem('AbsEntry')}`)
                            }

                            //replace data package dari be ke internal fe
                            let Data = [];

                            for (var i in info.Packagings) {
                                let ItemList = info.Packagings[i].PackagingDetails;

                                for (var id in ItemList) {
                                    ItemList[id].No = parseInt(id) + 1
                                }

                                Data.push({
                                    "ID": info.Packagings[i].Additional.ID,
                                    "ItemList": ItemList,
                                    "No": info.Packagings[i].Additional.No,
                                    "PackageNo": info.Packagings[i].PackageNo,
                                    "PackingDate": moment(info.Packagings[i].PackingDate).format("YYYY-MM-DD"),
                                    "Status": info.Packagings[i].Additional.Status,
                                    "PackagingName": info.Packagings[i].PackageName
                                })
                            }

                            window.localStorage.setItem('PackageList', JSON.stringify(Data));

                            console.log('hasil replace data package dari backend:')
                            console.log(JSON.parse(window.localStorage.getItem('PackageList')))

                            console.log('list validasi :')
                            console.log(JSON.parse(window.localStorage.getItem('ValidList')))

                            // //masukin registerqty
                            const DataPackaging = JSON.parse(window.localStorage.getItem("PackageList"))
                            const DataValidasi = JSON.parse(window.localStorage.getItem("ValidList"))

                            let itemCollection = [];
                            for (var i in DataPackaging) {
                                for (var a in DataPackaging[i]["ItemList"]) {
                                    itemCollection.push(DataPackaging[i]["ItemList"][a])
                                }
                            }
                            for (var i in itemCollection) {
                                function isSame(y) {
                                    return y.ItemCode == itemCollection[i].ItemCode
                                }
                                if (DataValidasi.find(isSame).RegisteredQty > 0) {
                                    console.log('dijumlahin');
                                    DataValidasi.find(isSame).RegisteredQty = itemCollection[i].Qty + DataValidasi.find(isSame).RegisteredQty
                                }
                                if (DataValidasi.find(isSame).RegisteredQty == 0) {
                                    console.log('asdf')
                                    DataValidasi.find(isSame).RegisteredQty = itemCollection[i].Qty
                                }

                            }
                            console.log(DataValidasi)

                            let stringValidData = JSON.stringify(DataValidasi);
                            localStorage.setItem('ValidList', stringValidData);

                            this.setState({
                                validList: new DataSource({
                                    store: new ArrayStore({
                                        data: JSON.parse(window.localStorage.getItem("ValidList"))
                                    })
                                }),
                                isLoading: false,
                                dataGridPackage: new DataSource({
                                    store: new ArrayStore({
                                        data: JSON.parse(window.localStorage.getItem('PackageList'))
                                    })
                                })
                            })
                        }
                    }
                    if (status >= 400 && status <= 500) {
                        console.log(data.description);

                        this.setState({
                            errMsg: data.description,
                            isLoading: false,
                            isClientSideErr: true
                        })

                        logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function getValidAndPackage() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                    }
                    if (status >= 500 && status <= 600) {
                        console.log(data.description)

                        this.setState({
                            errMsg: data.description,
                            isLoading: false,
                            isServersideError: true
                        })

                        logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function getValidAndPackage() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                    }
                }
                if (stat >= 400 && stat <= 500) {
                    console.log(data.description);
                    console.log('glen')

                    this.setState({
                        errMsg: data.description,
                        isLoading: false,
                        isNotYetFinish: true
                    })

                    logger.error(`@Gleenald HTTP Stat: ${stat}, ClientSide Error, function getValid() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                }
                if (stat >= 500 && stat <= 600) {
                    console.log(data.description)

                    this.setState({
                        errMsg: data.description,
                        isLoading: false,
                        isServersideError: true
                    })

                    logger.error(`@Gleenald HTTP Stat: ${stat}, Serverside Error, function getValid() halaman SetPackaging, msg: ${data.description}, Username: ${window.localStorage.getItem('Username')}`)
                }

            }
            catch (err) {
                console.log(err)
                this.setState({
                    isLoading: false,
                    tryCatchErrMsg: err,
                    isTryCatchErr: true
                })
                logger.error(`@Gleenald App Error! function getValidAndPackage() halaman SetPackaging msg: ${err}, Username: ${window.localStorage.getItem('Username')}`)
            }
        })
    }

    renderTable = () => {
        const item_list = this.state.print["ItemList"]
        const item_list_len = this.state.print["ItemList"].length

        if (item_list_len > 0 && item_list_len <= 6) {
            return (
                <div>
                    <div
                        style={{
                            border: "2px solid black",
                            height: "60vh",
                            width: "50vw",
                            display: this.state.displayPrint1[0]
                        }}
                    >
                        {/* Package Name Section */}
                        <div>
                            <p
                                style={{
                                    fontWeight: "800",
                                    marginLeft: "2px",
                                    fontSize: 16,
                                    marginTop: "0.5vh"
                                }}
                            >
                                {this.state.print['PackageName'].toUpperCase()}
                            </p>
                        </div>

                        {/* Alert barang mudah pecah */}
                        <div
                            style={{
                                borderBottom: "2px solid black",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "-3.0vh",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "800",
                                    fontSize: 18,
                                    marginBottom: "-0.01vh"
                                }}
                            >
                                JANGAN DITERIMA BILA PEMBUNGKUS / SEAL RUSAK
                            </p>
                        </div>

                        {/* Info1 Section */}
                        <div
                            style={{
                                marginTop: "-0.7vh",
                                marginBottom: "-0.7vh"
                            }}
                        >
                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    fontSize: 15,
                                }}
                            >
                                CUSTOMER&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["CustomerName"].toUpperCase()}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    // backgroundColor:"green",
                                    marginTop: "-2.7vh",
                                    marginLeft: "2px",
                                    height: "7.3vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    NOTICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
                                </p>
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "800",
                                        }}
                                    >
                                        {this.state.print["Notice"].toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    marginTop: "-0.5vh",
                                    fontSize: 15,
                                }}
                            >
                                PICK&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["PickNo"]}
                            </p>
                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    marginTop: "-1vh",
                                    fontSize: 15,
                                }}
                            >
                                REF&nbsp;/&nbsp;PO&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{this.state.print["PONo"]}
                            </p>

                        </div>

                        {/* Table Section */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: 'center'
                            }}
                            className="print-table"
                        >
                            <table
                                style={{
                                    width: "750px",
                                    borderCollapse: "collapse",
                                    borderBottom: "2px solid black"
                                }}
                            >
                                <tr>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderLeft: "0px",
                                            height: "3.3vh"
                                        }}
                                    >
                                        NO
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            height: "3.3vh"
                                        }}
                                    >
                                        NAMA BARANG
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderRight: "0px",
                                            height: "3.3vh"
                                        }}
                                    >
                                        QTY PCS
                                    </th>



                                </tr>

                                {item_list.map((element, y, z) => {
                                    if (element.ItemName == 'empty') {
                                        return (
                                            <tr
                                            >
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "3.3vh",
                                                        borderBottom: "0px",
                                                        borderTop: "0px"
                                                    }}
                                                >

                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "3.3vh",
                                                        borderBottom: "0px",
                                                        borderTop: "0px"
                                                    }}
                                                >

                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderTop: "0px",
                                                        borderBottom: "0px"
                                                    }}
                                                >

                                                </th>
                                            </tr>
                                        )
                                    }
                                    else {
                                        return (
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "3.3vh"
                                                    }}
                                                >
                                                    {item_list[y].No}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "3.3vh",
                                                    }}
                                                >
                                                    {item_list[y].ItemName}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800"
                                                    }}
                                                >
                                                    {item_list[y].Qty}
                                                </th>
                                            </tr>
                                        )
                                    }
                                })}
                            </table>

                        </div>

                        {/* Info2 & Alert 2 Section */}
                        <div
                            style={{

                                marginTop: "-1.25vh",
                                //backgroundColor:"yellowgreen"
                            }}
                        >
                            <div
                                style={{
                                    borderBottom: "2px solid black",
                                    height: "5.5vh"
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    PACKER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {this.state.print["Packer"].toUpperCase()}
                                </p>
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                        marginTop: "-1.25vh"
                                    }}
                                >
                                    TANGGAL&nbsp;PACKING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {this.state.print["PackingDate"]}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    height: "4vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 16,
                                        marginLeft: "2px"
                                    }}
                                >
                                    JANGAN&nbsp;DIBANTING&nbsp;!&nbsp;BARANG&nbsp;MUDAH&nbsp;PECAH&nbsp;!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        if (item_list_len > 6 && item_list_len <= 10) {

            return (
                <div>
                    {/* Halaman Pertama (Header + Tabel 7-10 item) */}
                    <div
                        style={{
                            border: "2px solid black",
                            height: "55.5vh",
                            width: "50vw",
                            backgroundColor: "white",
                            display: this.state.displayPrint2[0]
                        }}
                    >
                        {/* Package Name Section */}
                        <div>
                            <p
                                style={{
                                    fontWeight: "800",
                                    marginLeft: "2px",
                                    fontSize: 16,
                                    marginTop: "0.5vh"
                                }}
                            >
                                Package No. A
                            </p>
                        </div>

                        {/* Alert barang mudah pecah */}
                        <div
                            style={{
                                borderBottom: "2px solid black",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "-3.0vh",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "800",
                                    fontSize: 18,
                                    marginBottom: "-0.01vh"
                                }}
                            >
                                JANGAN DITERIMA BILA PEMBUNGKUS / SEAL RUSAK
                            </p>
                        </div>

                        {/* Info1 Section */}
                        <div
                            style={{
                                marginTop: "-0.7vh",
                                marginBottom: "-0.7vh"
                            }}
                        >
                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    fontSize: 15,
                                }}
                            >
                                CUSTOMER&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;KO SAM
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    // backgroundColor:"green",
                                    marginTop: "-2.7vh",
                                    marginLeft: "2px",
                                    height: "7.3vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    NOTICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
                                </p>
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "800",
                                        }}
                                    >
                                        LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET
                                    </p>
                                </div>
                            </div>

                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    marginTop: "-0.5vh",
                                    fontSize: 15,
                                }}
                            >
                                PICK&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                            </p>
                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    marginTop: "-1vh",
                                    fontSize: 15,
                                }}
                            >
                                REF&nbsp;/&nbsp;PO&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                            </p>

                        </div>

                        {/* Table Section */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: 'center'
                            }}
                            className="print-table"
                        >
                            <table
                                style={{
                                    width: "750px",
                                    borderCollapse: "collapse",
                                    //borderBottom: "2px solid black"
                                }}
                            >
                                <tr>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderLeft: "0px",
                                            height: "3.0vh"
                                        }}
                                    >
                                        NO
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            height: "3.0vh"
                                        }}
                                    >
                                        NAMA BARANG
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderRight: "0px",
                                            height: "3.0vh"
                                        }}
                                    >
                                        QTY PCS
                                    </th>



                                </tr>

                                {item_list.map((element, y, z) => {
                                    if (element.ItemName == 'empty') {
                                        return (
                                            <tr
                                            >
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.7vh",
                                                        borderBottom: "0px",
                                                        borderTop: "0px"
                                                    }}
                                                >

                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.7vh",
                                                        borderBottom: "0px",
                                                        borderTop: "0px"
                                                    }}
                                                >

                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderTop: "0px",
                                                        borderBottom: "0px"
                                                    }}
                                                >

                                                </th>
                                            </tr>
                                        )
                                    }
                                    else {
                                        return (
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {item_list[y].No}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {item_list[y].ItemName}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderBottom: "0px",
                                                        height: "2.82vh",
                                                    }}
                                                >
                                                    {item_list[y].Qty}
                                                </th>
                                            </tr>
                                        )
                                    }
                                })}
                            </table>

                        </div>
                    </div>

                    <div
                        style={{
                            border: "2px solid black",
                            height: "60vh",
                            width: "50vw",
                            backgroundColor: "white",
                            marginTop: "10px",
                            marginBottom: "10px",
                            display: this.state.displayPrint2[1]
                        }}
                    >
                        {/* Info2 & Alert 2 Section */}
                        <div
                            style={{

                                marginTop: "-1.25vh",
                                //backgroundColor:"yellowgreen"
                            }}
                        >
                            <div
                                style={{
                                    borderBottom: "2px solid black",
                                    height: "5.5vh"
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    PACKER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: SALMAN
                                </p>
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                        marginTop: "-1.25vh"
                                    }}
                                >
                                    TANGGAL&nbsp;PACKING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 01/01/2001
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    height: "4vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 16,
                                        marginLeft: "2px"
                                    }}
                                >
                                    JANGAN&nbsp;DIBANTING&nbsp;!&nbsp;BARANG&nbsp;MUDAH&nbsp;PECAH&nbsp;!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )


        }
        if (item_list_len > 10 && item_list_len < 25) {
            let itemList1 = item_list.slice(0, 10)
            let itemList2 = item_list.slice(10, item_list_len)

            return (
                <div>
                    {/* halaman 1 (header + tabel 10 jenis item) */}
                    <div
                        style={{
                            border: "2px solid black",
                            height: "60vh",
                            width: "50vw",
                            backgroundColor: "white",
                            display: this.state.displayPrint2[0]
                        }}
                    >
                        {/* Package Name Section */}
                        <div>
                            <p
                                style={{
                                    fontWeight: "800",
                                    marginLeft: "2px",
                                    fontSize: 16,
                                    marginTop: "0.5vh"
                                }}
                            >
                                Package No. A
                            </p>
                        </div>

                        {/* Alert barang mudah pecah */}
                        <div
                            style={{
                                borderBottom: "2px solid black",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "-3.0vh",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "800",
                                    fontSize: 18,
                                    marginBottom: "-0.01vh"
                                }}
                            >
                                JANGAN DITERIMA BILA PEMBUNGKUS / SEAL RUSAK
                            </p>
                        </div>

                        {/* Info1 Section */}
                        <div
                            style={{
                                marginTop: "-0.7vh",
                                marginBottom: "-0.7vh"
                            }}
                        >
                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    fontSize: 15,
                                }}
                            >
                                CUSTOMER&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;KO SAM
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    // backgroundColor:"green",
                                    marginTop: "-2.7vh",
                                    marginLeft: "2px",
                                    height: "7.3vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    NOTICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
                                </p>
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "800",
                                        }}
                                    >
                                        LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET
                                    </p>
                                </div>
                            </div>

                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    marginTop: "-0.5vh",
                                    fontSize: 15,
                                }}
                            >
                                PICK&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                            </p>
                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    marginTop: "-1vh",
                                    fontSize: 15,
                                }}
                            >
                                REF&nbsp;/&nbsp;PO&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                            </p>

                        </div>

                        {/* Table Section */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: 'center'
                            }}
                            className="print-table"
                        >
                            <table
                                style={{
                                    width: "750px",
                                    borderCollapse: "collapse",
                                    //borderBottom: "2px solid black"
                                }}
                            >
                                <tr>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderLeft: "0px",
                                            height: "3.0vh"
                                        }}
                                    >
                                        NO
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            height: "3.0vh"
                                        }}
                                    >
                                        NAMA BARANG
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderRight: "0px",
                                            height: "3.0vh"
                                        }}
                                    >
                                        QTY PCS
                                    </th>



                                </tr>

                                {itemList1.map((element, y, z) => {
                                    if (element.ItemName == 'empty') {
                                        return (
                                            <tr
                                            >
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.7vh",
                                                        borderBottom: "0px",
                                                        borderTop: "0px"
                                                    }}
                                                >

                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.7vh",
                                                        borderBottom: "0px",
                                                        borderTop: "0px"
                                                    }}
                                                >

                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderTop: "0px",
                                                        borderBottom: "0px"
                                                    }}
                                                >

                                                </th>
                                            </tr>
                                        )
                                    }
                                    else {
                                        return (
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {itemList1[y].No}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {itemList1[y].ItemName}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderBottom: "0px",
                                                        height: "2.82vh",
                                                    }}
                                                >
                                                    {itemList1[y].Qty}
                                                </th>
                                            </tr>
                                        )
                                    }
                                })}
                            </table>

                        </div>
                    </div>

                    {/* halaman 2 tabel item sisanya + footer packer */}
                    <div
                        style={{
                            border: "2px solid black",
                            height: "60vh",
                            width: "50vw",
                            backgroundColor: "white",
                            display: this.state.displayPrint2[1],
                            marginTop: "10px"
                        }}
                    >
                        {/* Table Section */}
                        <div>
                            <table
                                style={{
                                    width: "50vw",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <tr>
                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderTop: "0px",
                                            borderLeft: "0px",
                                            height: "3.0vh"
                                        }}
                                    >
                                        NO
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            height: "3.0vh",
                                            borderTop: "0px",
                                        }}
                                    >
                                        NAMA BARANG
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderRight: "0px",
                                            height: "3.0vh",
                                            borderTop: "0px",
                                        }}
                                    >
                                        QTY PCS
                                    </th>
                                </tr>
                                {itemList2.map((element, y, z) => {
                                    return (
                                        <tr>
                                            <th
                                                style={{
                                                    border: "2px solid black",
                                                    fontSize: 14,
                                                    fontWeight: "800",
                                                    height: "2.7vh",
                                                    //borderBottom: "0px"
                                                }}
                                            >
                                                {itemList2[y].No}
                                            </th>
                                            <th
                                                style={{
                                                    border: "2px solid black",
                                                    fontSize: 14,
                                                    fontWeight: "800",
                                                    textAlign: "left",
                                                    height: "2.82vh",
                                                    //borderBottom: "0px"
                                                }}
                                            >
                                                {itemList2[y].ItemName}
                                            </th>
                                            <th
                                                style={{
                                                    border: "2px solid black",
                                                    borderRight: "0px",
                                                    fontSize: 14,
                                                    fontWeight: "800",
                                                    height: "2.82vh",
                                                }}
                                            >
                                                {itemList2[y].Qty}
                                            </th>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>

                        {/* Info2 & Alert 2 Section */}
                        <div
                            style={{

                                marginTop: "-1.25vh",
                                //backgroundColor:"yellowgreen"
                            }}
                        >
                            <div
                                style={{
                                    borderBottom: "2px solid black",
                                    height: "5.5vh"
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    PACKER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: SALMAN
                                </p>
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                        marginTop: "-1.25vh"
                                    }}
                                >
                                    TANGGAL&nbsp;PACKING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 01/01/2001
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    height: "4vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 16,
                                        marginLeft: "2px"
                                    }}
                                >
                                    JANGAN&nbsp;DIBANTING&nbsp;!&nbsp;BARANG&nbsp;MUDAH&nbsp;PECAH&nbsp;!
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            )
        }
        if (item_list_len == 25 || item_list_len == 26 || item_list_len == 27) {
            let itemList1 = item_list.slice(0, 10)
            let itemList2 = item_list.slice(10, item_list_len)

            return (
                <div>
                    {/* halaman 1 (header + tabel 10 jenis item) */}
                    <div
                        style={{
                            border: "2px solid black",
                            height: "60vh",
                            width: "50vw",
                            backgroundColor: "white",
                            display: this.state.displayPrint3[0]
                        }}
                    >
                        {/* Package Name Section */}
                        <div>
                            <p
                                style={{
                                    fontWeight: "800",
                                    marginLeft: "2px",
                                    fontSize: 16,
                                    marginTop: "0.5vh"
                                }}
                            >
                                Package No. A
                            </p>
                        </div>

                        {/* Alert barang mudah pecah */}
                        <div
                            style={{
                                borderBottom: "2px solid black",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "-3.0vh",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "800",
                                    fontSize: 18,
                                    marginBottom: "-0.01vh"
                                }}
                            >
                                JANGAN DITERIMA BILA PEMBUNGKUS / SEAL RUSAK
                            </p>
                        </div>

                        {/* Info1 Section */}
                        <div
                            style={{
                                marginTop: "-0.7vh",
                                marginBottom: "-0.7vh"
                            }}
                        >
                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    fontSize: 15,
                                }}
                            >
                                CUSTOMER&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;KO SAM
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    // backgroundColor:"green",
                                    marginTop: "-2.7vh",
                                    marginLeft: "2px",
                                    height: "7.3vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    NOTICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
                                </p>
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "800",
                                        }}
                                    >
                                        LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET
                                    </p>
                                </div>
                            </div>

                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    marginTop: "-0.5vh",
                                    fontSize: 15,
                                }}
                            >
                                PICK&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                            </p>
                            <p
                                style={{
                                    marginLeft: "2px",
                                    fontWeight: "800",
                                    marginTop: "-1vh",
                                    fontSize: 15,
                                }}
                            >
                                REF&nbsp;/&nbsp;PO&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                            </p>

                        </div>

                        {/* Table Section */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: 'center'
                            }}
                            className="print-table"
                        >
                            <table
                                style={{
                                    width: "750px",
                                    borderCollapse: "collapse",
                                    //borderBottom: "2px solid black"
                                }}
                            >
                                <tr>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderLeft: "0px",
                                            height: "3.0vh"
                                        }}
                                    >
                                        NO
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            height: "3.0vh"
                                        }}
                                    >
                                        NAMA BARANG
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderRight: "0px",
                                            height: "3.0vh"
                                        }}
                                    >
                                        QTY PCS
                                    </th>



                                </tr>

                                {itemList1.map((element, y, z) => {
                                    if (element.ItemName == 'empty') {
                                        return (
                                            <tr
                                            >
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.7vh",
                                                        borderBottom: "0px",
                                                        borderTop: "0px"
                                                    }}
                                                >

                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.7vh",
                                                        borderBottom: "0px",
                                                        borderTop: "0px"
                                                    }}
                                                >

                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderTop: "0px",
                                                        borderBottom: "0px"
                                                    }}
                                                >

                                                </th>
                                            </tr>
                                        )
                                    }
                                    else {
                                        return (
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {itemList1[y].No}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {itemList1[y].ItemName}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderBottom: "0px",
                                                        height: "2.82vh",
                                                    }}
                                                >
                                                    {itemList1[y].Qty}
                                                </th>
                                            </tr>
                                        )
                                    }
                                })}
                            </table>

                        </div>
                    </div>

                    {/* halaman 2 (lanjutan tabel item) */}
                    <div
                        style={{
                            border: "2px solid black",
                            height: "60vh",
                            width: "50vw",
                            backgroundColor: "white",
                            display: this.state.displayPrint3[1],
                            marginTop: "10px"
                        }}
                    >
                        <div>
                            <table
                                style={{
                                    width: "50vw",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <tr>
                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderTop: "0px",
                                            borderLeft: "0px",
                                            height: "3.0vh"
                                        }}
                                    >
                                        NO
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            height: "3.0vh",
                                            borderTop: "0px",
                                        }}
                                    >
                                        NAMA BARANG
                                    </th>

                                    <th
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            border: "2px solid black",
                                            borderRight: "0px",
                                            height: "3.0vh",
                                            borderTop: "0px",
                                        }}
                                    >
                                        QTY PCS
                                    </th>
                                </tr>

                                {itemList2.map((element, y, z) => {
                                    return (
                                        <tr>
                                            <th
                                                style={{
                                                    border: "2px solid black",
                                                    fontSize: 14,
                                                    fontWeight: "800",
                                                    height: "2.7vh",
                                                    //borderBottom: "0px"
                                                }}
                                            >
                                                {itemList2[y].No}
                                            </th>
                                            <th
                                                style={{
                                                    border: "2px solid black",
                                                    fontSize: 14,
                                                    fontWeight: "800",
                                                    textAlign: "left",
                                                    height: "2.82vh",
                                                    //borderBottom: "0px"
                                                }}
                                            >
                                                {itemList2[y].ItemName}
                                            </th>
                                            <th
                                                style={{
                                                    border: "2px solid black",
                                                    borderRight: "0px",
                                                    fontSize: 14,
                                                    fontWeight: "800",
                                                    height: "2.82vh",
                                                }}
                                            >
                                                {itemList2[y].Qty}
                                            </th>
                                        </tr>
                                    )
                                })}

                            </table>
                        </div>
                    </div>

                    {/* halaman 3 (footer packer) */}
                    <div
                        style={{
                            border: "2px solid black",
                            height: "60vh",
                            width: "50vw",
                            backgroundColor: "white",
                            display: this.state.displayPrint3[2],
                            marginTop: '10px'
                        }}
                    >
                        {/* Info2 & Alert 2 Section */}
                        <div
                            style={{

                                marginTop: "-1.25vh",
                                //backgroundColor:"yellowgreen"
                            }}
                        >
                            <div
                                style={{
                                    borderBottom: "2px solid black",
                                    height: "5.5vh"
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    PACKER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: SALMAN
                                </p>
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                        marginTop: "-1.25vh"
                                    }}
                                >
                                    TANGGAL&nbsp;PACKING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 01/01/2001
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    height: "4vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 16,
                                        marginLeft: "2px"
                                    }}
                                >
                                    JANGAN&nbsp;DIBANTING&nbsp;!&nbsp;BARANG&nbsp;MUDAH&nbsp;PECAH&nbsp;!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        if (item_list_len >= 28) {
            const len_page_one = item_list_len - 10
            const modulus = len_page_one % 18

            if (modulus == 0) {
                let last = this.state.displayPrint4.length - 1
                return (
                    <div>
                        {/* halaman 1 (header + tabel 10 biji) */}
                        <div
                            style={{
                                border: "2px solid black",
                                height: "60vh",
                                width: "50vw",
                                backgroundColor: "white",
                                display: this.state.displayPrint4[0]
                            }}
                        >
                            {/* Package Name Section */}
                            <div>
                                <p
                                    style={{
                                        fontWeight: "800",
                                        marginLeft: "2px",
                                        fontSize: 16,
                                        marginTop: "0.5vh"
                                    }}
                                >
                                    Package No. A
                                </p>
                            </div>

                            {/* Alert barang mudah pecah */}
                            <div
                                style={{
                                    borderBottom: "2px solid black",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "-3.0vh",
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 18,
                                        marginBottom: "-0.01vh"
                                    }}
                                >
                                    JANGAN DITERIMA BILA PEMBUNGKUS / SEAL RUSAK
                                </p>
                            </div>

                            {/* Info1 Section */}
                            <div
                                style={{
                                    marginTop: "-0.7vh",
                                    marginBottom: "-0.7vh"
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    CUSTOMER&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;KO SAM
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        // backgroundColor:"green",
                                        marginTop: "-2.7vh",
                                        marginLeft: "2px",
                                        height: "7.3vh"
                                    }}
                                >
                                    <p
                                        style={{
                                            fontWeight: "800",
                                            fontSize: 15,
                                        }}
                                    >
                                        NOTICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
                                    </p>
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: "800",
                                            }}
                                        >
                                            LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET
                                        </p>
                                    </div>
                                </div>

                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        marginTop: "-0.5vh",
                                        fontSize: 15,
                                    }}
                                >
                                    PICK&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                                </p>
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        marginTop: "-1vh",
                                        fontSize: 15,
                                    }}
                                >
                                    REF&nbsp;/&nbsp;PO&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                                </p>

                            </div>

                            {/* Table Section */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: 'center'
                                }}
                                className="print-table"
                            >
                                <table
                                    style={{
                                        width: "750px",
                                        borderCollapse: "collapse",
                                        //borderBottom: "2px solid black"
                                    }}
                                >
                                    <tr>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                borderLeft: "0px",
                                                height: "3.0vh"
                                            }}
                                        >
                                            NO
                                        </th>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                height: "3.0vh"
                                            }}
                                        >
                                            NAMA BARANG
                                        </th>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                borderRight: "0px",
                                                height: "3.0vh"
                                            }}
                                        >
                                            QTY PCS
                                        </th>
                                    </tr>

                                    {item_list.slice(0, 10).map((element, y, z) => {
                                        return (
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {item_list.slice(0, 10)[y].No}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {item_list.slice(0, 10)[y].ItemName}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderBottom: "0px",
                                                        height: "2.82vh",
                                                    }}
                                                >
                                                    {item_list.slice(0, 10)[y].Qty}
                                                </th>
                                            </tr>
                                        )
                                    })}

                                </table>
                            </div>

                        </div>

                        {/* halaman tabel item 18 biji */}
                        {this.state.result.map((element, idx) => {
                            return (
                                <div
                                    style={{
                                        border: "2px solid black",
                                        height: "60vh",
                                        width: "50vw",
                                        backgroundColor: "white",
                                        display: this.state.displayPrint4[idx + 1],
                                        marginTop: "10px"
                                    }}
                                >
                                    <div>
                                        <table
                                            style={{
                                                width: "50vw",
                                                borderCollapse: "collapse",
                                            }}
                                        >
                                            <tr>
                                                <th
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        border: "2px solid black",
                                                        borderTop: "0px",
                                                        borderLeft: "0px",
                                                        height: "3.0vh"
                                                    }}
                                                >
                                                    NO
                                                </th>

                                                <th
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        border: "2px solid black",
                                                        height: "3.0vh",
                                                        borderTop: "0px",
                                                    }}
                                                >
                                                    NAMA BARANG
                                                </th>

                                                <th
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        height: "3.0vh",
                                                        borderTop: "0px",
                                                    }}
                                                >
                                                    QTY PCS
                                                </th>


                                            </tr>

                                            {item_list.slice(this.state.awal[idx], this.state.akhir[idx]).map((element, index, self) => {

                                                return (
                                                    <tr>
                                                        <th
                                                            style={{
                                                                border: "2px solid black",
                                                                fontSize: 14,
                                                                fontWeight: "800",
                                                                height: "2.67vh",
                                                                //borderBottom: "0px"
                                                            }}
                                                        >
                                                            {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["No"]}
                                                        </th>

                                                        <th
                                                            style={{
                                                                border: "2px solid black",
                                                                fontSize: 14,
                                                                fontWeight: "800",
                                                                textAlign: "left",
                                                                height: "2.67vh",
                                                                //borderBottom: "0px"
                                                            }}
                                                        >
                                                            {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["ItemName"]}
                                                        </th>

                                                        <th
                                                            style={{
                                                                border: "2px solid black",
                                                                borderRight: "0px",
                                                                fontSize: 14,
                                                                fontWeight: "800",
                                                                height: "2.67vh",
                                                            }}
                                                        >
                                                            {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["Qty"]}
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </table>
                                    </div>

                                </div>
                            )
                        })}

                        {/* halaman terakhir (footer packer) */}
                        <div
                            style={{
                                border: "2px solid black",
                                height: "60vh",
                                width: "50vw",
                                backgroundColor: "white",
                                marginTop: "10px",
                                marginBottom: "10px",
                                display: this.state.displayPrint4[last]
                            }}
                        >
                            <div
                                style={{
                                    borderBottom: "2px solid black",
                                    height: "5.5vh"
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    PACKER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: SALMAN
                                </p>

                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                        marginTop: "-1.25vh"
                                    }}
                                >
                                    TANGGAL&nbsp;PACKING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 01/01/2001
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    height: "4vh"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 16,
                                        marginLeft: "2px"
                                    }}
                                >
                                    JANGAN&nbsp;DIBANTING&nbsp;!&nbsp;BARANG&nbsp;MUDAH&nbsp;PECAH&nbsp;!
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
            if (modulus != 0) {
                let last = this.state.displayPrint4.length - 1
                return (
                    <div>
                        {/* halaman 1 (header + tabel 10 biji) */}
                        <div
                            style={{
                                border: "2px solid black",
                                height: "60vh",
                                width: "50vw",
                                backgroundColor: "white",
                                display: this.state.displayPrint4[0]
                            }}
                        >
                            {/* Package Name Section */}
                            <div>
                                <p
                                    style={{
                                        fontWeight: "800",
                                        marginLeft: "2px",
                                        fontSize: 16,
                                        marginTop: "0.5vh"
                                    }}
                                >
                                    Package No. A
                                </p>
                            </div>

                            {/* Alert barang mudah pecah */}
                            <div
                                style={{
                                    borderBottom: "2px solid black",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "-3.0vh",
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "800",
                                        fontSize: 18,
                                        marginBottom: "-0.01vh"
                                    }}
                                >
                                    JANGAN DITERIMA BILA PEMBUNGKUS / SEAL RUSAK
                                </p>
                            </div>

                            {/* Info1 Section */}
                            <div
                                style={{
                                    marginTop: "-0.7vh",
                                    marginBottom: "-0.7vh"
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        fontSize: 15,
                                    }}
                                >
                                    CUSTOMER&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;KO SAM
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        // backgroundColor:"green",
                                        marginTop: "-2.7vh",
                                        marginLeft: "2px",
                                        height: "7.3vh"
                                    }}
                                >
                                    <p
                                        style={{
                                            fontWeight: "800",
                                            fontSize: 15,
                                        }}
                                    >
                                        NOTICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
                                    </p>
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: "800",
                                            }}
                                        >
                                            LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET
                                        </p>
                                    </div>
                                </div>

                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        marginTop: "-0.5vh",
                                        fontSize: 15,
                                    }}
                                >
                                    PICK&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                                </p>
                                <p
                                    style={{
                                        marginLeft: "2px",
                                        fontWeight: "800",
                                        marginTop: "-1vh",
                                        fontSize: 15,
                                    }}
                                >
                                    REF&nbsp;/&nbsp;PO&nbsp;NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{12345678}
                                </p>

                            </div>

                            {/* Table Section */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: 'center'
                                }}
                                className="print-table"
                            >
                                <table
                                    style={{
                                        width: "750px",
                                        borderCollapse: "collapse",
                                        //borderBottom: "2px solid black"
                                    }}
                                >
                                    <tr>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                borderLeft: "0px",
                                                height: "3.0vh"
                                            }}
                                        >
                                            NO
                                        </th>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                height: "3.0vh"
                                            }}
                                        >
                                            NAMA BARANG
                                        </th>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                borderRight: "0px",
                                                height: "3.0vh"
                                            }}
                                        >
                                            QTY PCS
                                        </th>
                                    </tr>

                                    {item_list.slice(0, 10).map((element, y, z) => {
                                        return (
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {item_list.slice(0, 10)[y].No}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.82vh",
                                                        borderBottom: "0px"
                                                    }}
                                                >
                                                    {item_list.slice(0, 10)[y].ItemName}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        borderBottom: "0px",
                                                        height: "2.82vh",
                                                    }}
                                                >
                                                    {item_list.slice(0, 10)[y].Qty}
                                                </th>
                                            </tr>
                                        )
                                    })}

                                </table>
                            </div>
                        </div>

                        {/* halaman tabel item 18 biji */}
                        {this.state.result.map((element, idx) => {
                            return (
                                <div
                                    style={{
                                        border: "2px solid black",
                                        height: "60vh",
                                        width: "50vw",
                                        backgroundColor: "white",
                                        display: this.state.displayPrint4[idx + 1],
                                        marginTop: "10px"
                                    }}
                                >
                                    <div>
                                        <table
                                            style={{
                                                width: "50vw",
                                                borderCollapse: "collapse",
                                            }}
                                        >
                                            <tr>
                                                <th
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        border: "2px solid black",
                                                        borderTop: "0px",
                                                        borderLeft: "0px",
                                                        height: "3.0vh"
                                                    }}
                                                >
                                                    NO
                                                </th>

                                                <th
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        border: "2px solid black",
                                                        height: "3.0vh",
                                                        borderTop: "0px",
                                                    }}
                                                >
                                                    NAMA BARANG
                                                </th>

                                                <th
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        height: "3.0vh",
                                                        borderTop: "0px",
                                                    }}
                                                >
                                                    QTY PCS
                                                </th>


                                            </tr>

                                            {item_list.slice(this.state.awal[idx], this.state.akhir[idx]).map((element, index, self) => {

                                                return (
                                                    <tr>
                                                        <th
                                                            style={{
                                                                border: "2px solid black",
                                                                fontSize: 14,
                                                                fontWeight: "800",
                                                                height: "2.67vh",
                                                                //borderBottom: "0px"
                                                            }}
                                                        >
                                                            {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["No"]}
                                                        </th>

                                                        <th
                                                            style={{
                                                                border: "2px solid black",
                                                                fontSize: 14,
                                                                fontWeight: "800",
                                                                textAlign: "left",
                                                                height: "2.67vh",
                                                                //borderBottom: "0px"
                                                            }}
                                                        >
                                                            {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["ItemName"]}
                                                        </th>

                                                        <th
                                                            style={{
                                                                border: "2px solid black",
                                                                borderRight: "0px",
                                                                fontSize: 14,
                                                                fontWeight: "800",
                                                                height: "2.67vh",
                                                            }}
                                                        >
                                                            {item_list.slice(this.state.awal[idx], this.state.akhir[idx])[index]["Qty"]}
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </table>
                                    </div>

                                </div>
                            )
                        })}

                        {/* halaman terakhir sisa table item + footer header */}
                        <div
                            style={{
                                border: "2px solid black",
                                height: "60vh",
                                width: "50vw",
                                backgroundColor: "white",
                                display: this.state.displayPrint4[last],
                                marginTop: "10px"
                            }}
                        >
                            {/* Table Section */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: 'center'
                                }}
                                className="print-table"
                            >
                                <table
                                    style={{
                                        width: "750px",
                                        borderCollapse: "collapse",
                                    }}
                                >
                                    <tr>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                borderLeft: "0px",
                                                height: "3.0vh"
                                            }}
                                        >
                                            NO
                                        </th>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                height: "3.0vh"
                                            }}
                                        >
                                            NAMA BARANG
                                        </th>
                                        <th
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "800",
                                                border: "2px solid black",
                                                borderRight: "0px",
                                                height: "3.0vh"
                                            }}
                                        >
                                            QTY PCS
                                        </th>
                                    </tr>

                                    {item_list.slice(item_list_len - modulus, item_list_len).map((element, y, z) => {
                                        return (
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        height: "2.82vh",
                                                        //borderBottom: "0px"
                                                    }}
                                                >
                                                    {item_list.slice(item_list_len - modulus, item_list_len)[y].No}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        textAlign: "left",
                                                        height: "2.82vh",
                                                        //borderBottom: "0px"
                                                    }}
                                                >
                                                    {item_list.slice(item_list_len - modulus, item_list_len)[y].ItemName}
                                                </th>

                                                <th
                                                    style={{
                                                        border: "2px solid black",
                                                        borderRight: "0px",
                                                        fontSize: 14,
                                                        fontWeight: "800",
                                                        //borderBottom: "0px",
                                                        height: "2.82vh",
                                                    }}
                                                >
                                                    {item_list.slice(item_list_len - modulus, item_list_len)[y].Qty}
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </table>
                            </div>

                            {/* Info2 & Alert 2 Section */}
                            <div
                                style={{

                                    marginTop: "-1.25vh",
                                    //backgroundColor:"yellowgreen"
                                }}
                            >
                                <div
                                    style={{
                                        borderBottom: "2px solid black",
                                        height: "5.5vh"
                                    }}
                                >
                                    <p
                                        style={{
                                            marginLeft: "2px",
                                            fontWeight: "800",
                                            fontSize: 15,
                                        }}
                                    >
                                        PACKER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: SALMAN
                                    </p>
                                    <p
                                        style={{
                                            marginLeft: "2px",
                                            fontWeight: "800",
                                            fontSize: 15,
                                            marginTop: "-1.25vh"
                                        }}
                                    >
                                        TANGGAL&nbsp;PACKING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 01/01/2001
                                    </p>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        height: "4vh"
                                    }}
                                >
                                    <p
                                        style={{
                                            fontWeight: "800",
                                            fontSize: 16,
                                            marginLeft: "2px"
                                        }}
                                    >
                                        JANGAN&nbsp;DIBANTING&nbsp;!&nbsp;BARANG&nbsp;MUDAH&nbsp;PECAH&nbsp;!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }

    renderDropDown = () => {
        const item_list = this.state.print["ItemList"];
        const item_list_len = this.state.print["ItemList"].length;

        if (item_list_len > 0 && item_list_len <= 6) {
            return (
                <div>

                </div>
            )
        }
        if (item_list_len > 6 && item_list_len <= 10) {
            return (
                <div>
                    <DropDownButton
                        items={this.state.dropDown2}
                        keyExpr="id"
                        displayExpr="text"
                        width={'5vw'}
                        onItemClick={this.dropDownAction1}
                    />
                </div>
            )
        }
        if (item_list_len > 10 && item_list_len < 25) {
            return (
                <div>
                    <DropDownButton
                        items={this.state.dropDown2}
                        keyExpr="id"
                        displayExpr="text"
                        width={'5vw'}
                        onItemClick={this.dropDownAction1}
                    />
                </div>
            )
        }
        if (item_list_len == 25 || item_list_len == 26 || item_list_len == 27) {
            return (
                <div>
                    <DropDownButton
                        items={this.state.dropDown3}
                        keyExpr="id"
                        displayExpr="text"
                        width={'5vw'}
                        onItemClick={this.dropDownAction2}
                    />
                </div>
            )
        }
        if (item_list_len >= 28) {
            return (
                <div>
                    <div>
                        <DropDownButton
                            items={this.state.dropDown4}
                            keyExpr="id"
                            displayExpr="text"
                            width={'10vw'}
                            onItemClick={this.dropDownAction3}
                        />
                    </div>
                </div>
            )
        }

    }

    dropDownAction1 = (e) => {
        let id = e.itemData.id;
        let data = this.state.displayPrint2;
        let selected = data[id];

        for (var i = 0; i < data.length; i++) {
            if (i == id) {
                data[i] = 'block'
            }
            if (i != id) {
                data[i] = 'none'
            }
        }
        this.setState({ displayPrint2: data })
        console.log(this.state.displayPrint2)
    }

    dropDownAction2 = (e) => {
        let id = e.itemData.id;
        let data = this.state.displayPrint3;
        let selected = data[id];

        for (var i = 0; i < data.length; i++) {
            if (i == id) {
                data[i] = 'block'
            }
            if (i != id) {
                data[i] = 'none'
            }
        }
        this.setState({ displayPrint3: data })
    }

    dropDownAction3 = (e) => {
        let id = e.itemData.id;
        let data = this.state.displayPrint4;
        let selected = data[id];

        for (var i = 0; i < data.length; i++) {
            if (i == id) {
                data[i] = 'block'
            }
            if (i != id) {
                data[i] = 'none'
            }
        }
        this.setState({ displayPrint4: data })
    }




    componentDidMount() {
        this.getValidAndPackage();
    }

    render() {
        return (
            <div>
                {/* MainTitle Section */}
                <div className="MainTitle-CTR">
                    <p className="MainTitle-Text1">
                        Picklist No. {this.props.match.params.picklistnumber}
                        <span className="MainTitle-Text2">|</span>
                        <span className="MainTitle-Text3">Set Packages - </span>
                        <span className="MainTitle-Text4">Scanned Item</span>
                    </p>

                    <div className="MainTitle-Btn2">
                        <Button
                            text="Cancel Process"
                            stylingMode='contained'
                            type='default'
                            style={{
                                color: "black",
                                marginRight: 10
                            }}
                            width="140"
                            height="40"
                            elementAttr={this.state.buttonAttributes2}
                            onClick={this.cancel}
                        />

                        <Button
                            text="Finish and Create Delivery"
                            stylingMode='contained'
                            type='default'
                            style={{
                                color: "black"
                            }}
                            width="200"
                            height="40"
                            elementAttr={this.state.buttonAttributes2}
                            onClick={this.createDelivery1}
                        />
                    </div>
                </div>

                {/* TableContainer #1 */}
                <div className="Table1-CTR">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 15,
                            height: 50
                        }}
                    >
                        <p
                            style={{
                                fontSize: "24px",
                                fontWeight: "normal"
                            }}
                        >
                            List Validasi Item
                        </p>

                    </div>

                    <DataGrid
                        dataSource={this.state.validList}
                        columnAutoWidth={true}
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        showRowLines={false}
                        showColumnLines={false}
                        showBorders={false}
                    >
                        <Paging
                            enabled={true}
                            defaultPageSize={5}
                            defaultPageIndex={0}
                        />
                        <Pager
                            showNavigationButtons={true}
                            showPageSizeSelector={true}
                            allowedPageSizes={this.state.allowedPageSizes}
                            showInfo={true}
                            infoText="Page {0}. Total: {1} ({2} items)"
                        />

                        <Sorting mode="single" />

                        <SearchPanel visible={true} />

                        <Scrolling
                            showScrollbar="never"
                        />

                        <Column
                            dataField="No"
                            dataType="integer"
                            width={100}
                            cssClass="Table1-Column-Number"
                            cellRender={this.cellRenderValidList}
                        />

                        <Column
                            dataField="ItemCode"
                            dataType="string"
                            cssClass="Table2-Column-ItemCode"
                            cellRender={this.cellRenderValidList}
                        />

                        <Column
                            dataField="ItemName"
                            dataType="string"
                            cssClass="Table2-Column-ItemName"
                            cellRender={this.cellRenderValidList}
                        />

                        <Column
                            dataField="PickQty"
                            dataType="string"
                            cssClass="Table2-Column-Qty"
                            width={120}
                            cellRender={this.cellRenderValidList}
                        />

                        <Column
                            dataField="RegisteredQty"
                            dataType="string"
                            cssClass="Table2-Column-Qty"
                            width={120}
                            cellRender={this.cellRenderValidList}
                        />

                    </DataGrid>
                </div>

                {/* TableContainer #2 */}
                <div className="Table2-CTR">

                    {/* Judul + Tombol Add New Packages */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 15,
                            height: 50
                        }}
                    >
                        <p
                            style={{
                                fontSize: "24px",
                                fontWeight: "normal"
                            }}
                        >
                            Package List
                        </p>

                        <div>
                            <Button
                                text="Add New Packages"
                                width="170"
                                height="40"
                                stylingMode="contained"
                                type='default'
                                style={{
                                    beforeunloadgroundColor: "rgba(210, 210, 210, 1)",
                                    color: "black"
                                }}
                                elementAttr={this.state.buttonAttributes2}
                                onClick={this.enableAddNewPackage}
                            />
                        </div>
                    </div>


                    <DataGrid
                        dataSource={this.state.dataGridPackage}
                        columnAutoWidth={true}
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        showRowLines={false}
                        showColumnLines={false}
                        showBorders={false}


                    >
                        <Paging
                            enabled={true}
                            defaultPageSize={5}
                            defaultPageIndex={0}
                        />
                        <Pager
                            showNavigationButtons={true}
                            showPageSizeSelector={true}
                            allowedPageSizes={this.state.allowedPageSizes}
                            showInfo={true}
                            infoText="Page {0}. Total: {1} ({2} items)"
                        />

                        <Sorting mode="single" />

                        <SearchPanel visible={true} />

                        <Scrolling
                            showScrollbar="never"
                        />

                        <Column
                            dataField="No"
                            dataType="integer"
                            width={100}
                            cssClass="Table1-Column-Number"
                        >

                        </Column>

                        <Column
                            dataField="PackagingName"
                            dataType="string"
                            cssClass="Table1-Column-PicklistNumber"
                            cellRender={this.cellRenderPackagingName}

                        >

                        </Column>

                        <Column
                            dataField="Actions"
                            width={250}
                            dataType="string"
                            cssClass="Table1-Column-PicklistNumber"
                            cellRender={this.cellRenderPackageAction}

                        >

                        </Column>



                    </DataGrid>

                </div>

                {/* TableContainer #3 */}
                <div className="Table2-CTR"
                    style={{
                        display: this.state.table3
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',

                        }}
                    >
                        <div className="Table2-TitleGroup">
                            <p
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "normal"
                                }}
                            >
                                Scanned Items | {this.state.selectedTitle}
                            </p>

                            <TextBox
                                placeholder="Input Scan Item Here"
                                width="250px"
                                height="40px"
                                style={{
                                    marginLeft: "20px",
                                    marginTop: "20px",
                                    borderRadius: "10px",
                                    beforeunloadgroundColor: "rgba(229, 238, 248, 1)",
                                    borderColor: "rgba(0, 86, 184, 1)"
                                }}
                                disabled={this.state.textBoxStat}
                                value={this.state.scanItem}
                                onValueChange={(y) => { this.setState({ scanItem: y }) }}
                                onEnterKey={this.scanItemCode}
                            />
                        </div>

                        <div
                            style={{
                                width: "500px",
                                height: "70px",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-end"
                            }}
                        >
                            <Button
                                text="Enable Edit"
                                width="150"
                                height="40"
                                type='default'
                                elementAttr={this.state.buttonAttributes2}
                                style={{
                                    color: "black",
                                    display: this.state.canEnableEdit
                                }}
                                stylingMode="contained"
                                disabled={this.state.enableEditBtn}
                                onClick={() => { this.setState({ isSuperUserEnableEdit: true }) }}
                            />

                            <Button
                                text="Finish Edit"
                                width="150"
                                height="40"
                                type='default'
                                style={{
                                    color: "black",
                                    display: this.state.canFinishEdit
                                }}
                                stylingMode="contained"
                                disabled={this.state.editPackageBtn}
                                elementAttr={this.state.buttonAttributes2}
                                onClick={this.enableFinishEdit}
                            />

                            <Button
                                text="Finish Scan"
                                width="150"
                                height="40"
                                stylingMode="contained"
                                type='default'
                                style={{
                                    color: 'black',
                                    marginLeft: "10px",
                                }}
                                elementAttr={this.state.buttonAttributes2}
                                onClick={this.enableFinishScan}
                                disabled={this.state.finishScanBtn}
                            />
                        </div>

                    </div>

                    <div>
                        <DataGrid
                            dataSource={this.state.dataGridItem}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            showRowLines={false}
                            showColumnLines={false}
                            showBorders={false}
                        >
                            <Paging
                                enabled={true}
                                defaultPageSize={5}
                                defaultPageIndex={0}
                            />

                            <Pager
                                showNavigationButtons={true}
                                showPageSizeSelector={true}
                                allowedPageSizes={this.state.allowedPageSizes}
                                showInfo={true}
                                infoText="Page {0}. Total: {1} ({2} items)"
                            />

                            <Sorting mode="single" />

                            <SearchPanel visible={true} />

                            <Column
                                dataField="No"
                                dataType="integer"
                                width={100}
                                cssClass="Table2-Column-Number"
                            >

                            </Column>

                            <Column
                                dataField="ItemCode"
                                dataType="string"
                                cssClass="Table2-Column-ItemCode"
                            >

                            </Column>

                            <Column
                                dataField="ItemName"
                                dataType="string"
                                cssClass="Table2-Column-ItemName"
                            >

                            </Column>

                            <Column
                                dataField="Qty"
                                dataType="string"
                                cssClass="Table2-Column-Qty"
                            >

                            </Column>

                            <Column
                                dataField="Actions"
                                dataType="string"
                                cssClass="Table2-Column-Qty"
                                cellRender={this.cellRenderItemAction}
                            >

                            </Column>
                        </DataGrid>
                    </div>

                </div>



                {/* SEMUA POPUP YANG ADA DI HALAMAN SETPACKAGING */}


                {/* Popup yang berhubungan dengan error */}
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
                {/* Popup Err If Package name same (addnewpackage) */}
                <div>
                    <Popup
                        visible={this.state.isPackageNameSame}
                        closeOnOutsideClick={true}
                        onHiding={this.disablePackageNameSame}
                        showTitle={false}
                        width={587}
                        height={196}
                    >
                        <div>
                            <p className="PopUpError-MainTitle">Error!</p>
                        </div>

                        <div>
                            <p className="PopUpError-Text">Nama Package tidak boleh sama!</p>
                        </div>

                        <div className="PopUpError-Btn">
                            <Button
                                text="Ok"
                                stylingMode='contained'
                                type='default'
                                width={100}
                                onClick={() => { this.disablePackageNameSame() }}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup Item not found in item-master-data */}
                <div>
                    <Popup
                        visible={this.state.isItemNotFound}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableItemNotFound}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "red",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Error!
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Item tidak terdaftar di database Pusat !
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="OK"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableItemNotFound}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup if Qty zero / null*/}
                <div>
                    <Popup
                        visible={this.state.isQtyZero}
                        closeOnOutsideClick={true}
                        onHiding={this.disableQtyZero}
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
                                Harap isi qty barang!
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
                                onClick={this.disableQtyZero}
                            />
                        </div>
                    </Popup>
                </div>
                {/* PopUp if no scan item err */}
                <div>
                    <Popup
                        visible={this.state.isBoxEmpty}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableBoxEmpty}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "red",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Error!
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Mohon untuk lakukan proses scan item terlebih dahulu !
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="OK"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableBoxEmpty}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup err create delivery karena user belum scan barang satupun */}
                <div>
                    <Popup
                        visible={this.state.isDeliveryItemNull}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableDeliveryNull}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "red",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Error!
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Mohon lakukan proses scan sesuai dengan list validasi terlebih dahulu untuk membuat delivery
                        </p>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 30

                            }}
                        >
                            <Button
                                text="Ok"
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableDeliveryNull}
                                elementAttr={this.state.buttonAttributes2}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup err create delivery karena user kelebihan barang */}
                <div>
                    <Popup
                        visible={this.state.isQtyMore}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableQtyMore}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "red",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Error!
                        </p>
                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Jumlah tipe item melebihi dari list validasi !
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="OK"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableQtyMore}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup err if type item total kurang dari list validasi */}
                <div>
                    <Popup
                        visible={this.state.isTypeItemLess}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableTypeItemLess}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "red",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Error!
                        </p>
                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Jumlah tipe item kurang dari seharusnya. Harap scan semua tipe item sesuai dengan list validasi.
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="OK"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableTypeItemLess}
                            />
                        </div>
                    </Popup>
                </div>
                {/* err picklist sebelumnya belum selesai redirect ke home */}
                <div>
                    <Popup
                        visible={this.state.isNotYetFinish}
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
                                {this.state.errMsg}
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
                                onClick={this.disableNotYetFinish}
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


                {/* Popup yang berhubungan dengan PackageData */}
                {/* Popup Add New Package */}
                <div>
                    <Popup
                        visible={this.state.isAddNewPackage}
                        closeOnOutsideClick={true}
                        onHiding={this.disableAddNewPackage}
                        title="Add New Package"
                        width={550}
                        height={300}
                        showTitle={false}
                    >
                        <div>
                            <div>
                                <h4
                                    style={{
                                        fontWeight: "700",
                                        fontSize: 24,
                                        color: "rgba(82, 87, 92, 1.0)"
                                    }}
                                >
                                    Add New Package
                                </h4>
                            </div>
                            {/* <div>
                                <p className="titleOverlay">Package Name : </p>
                            </div> */}

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: 'row'
                                }}
                            >
                                <p>Package</p>
                                <TextBox
                                    placeholder="Masukkan Nama Package disini"
                                    onValueChange={(y) => { this.setState({ PackageName: y }) }}
                                    width={450}
                                    style={{
                                        marginLeft: "10px"
                                    }}
                                    maxLength={1}
                                    value={""}
                                />
                            </div>

                        </div>

                        <div>
                            <p
                                style={{
                                    color: 'red',
                                    fontSize: 12
                                }}
                            >
                                {this.state.addNewPackageAlert}
                            </p>
                        </div>

                        {/* Button Secction */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 30

                            }}
                        >
                            <Button
                                text="Close"
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableAddNewPackage}
                                elementAttr={this.state.buttonAttributes}
                            />

                            <div
                                style={{
                                    marginLeft: 15
                                }}
                            >
                                <Button
                                    text="Save"
                                    width='80'
                                    type="default"
                                    elementAttr={this.state.buttonAttributes}
                                    onClick={this.AddNewPackage}
                                />
                            </div>
                        </div>

                    </Popup>
                </div>
                {/* Popup edit package name */}
                <div>
                    <Popup
                        visible={this.state.isEditPackageName}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={550}
                        height={300}
                        onHiding={this.disableEditPackageName}
                    >
                        <div>
                            <div>
                                <h4
                                    style={{
                                        fontWeight: "700",
                                        fontSize: 24,
                                        color: "rgba(82, 87, 92, 1.0)"
                                    }}
                                >
                                    Edit Package Name
                                </h4>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: 'row'
                                }}
                            >
                                <p>Package</p>
                                <TextBox
                                    placeholder="Masukkan Nama Package disini"
                                    onValueChange={(y) => { this.setState({ titleAfterEdit: y }) }}
                                    width={450}
                                    style={{
                                        marginLeft: "10px"
                                    }}
                                    maxLength={1}
                                    value={""}
                                />
                            </div>
                        </div>

                        {/* Button Secction */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 30

                            }}
                        >
                            <Button
                                text="Close"
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableEditPackageName}
                                elementAttr={this.state.buttonAttributes}
                            />

                            <div
                                style={{
                                    marginLeft: 15
                                }}
                            >
                                <Button
                                    text="Save"
                                    width='80'
                                    type="default"
                                    elementAttr={this.state.buttonAttributes}
                                    onClick={this.EditPackage}
                                />
                            </div>
                        </div>

                    </Popup>
                </div>
                {/* Popup delete package */}
                <div>
                    <Popup
                        visible={this.state.isDeletePackage}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableDeletePackage}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "gray",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Konfirmasi
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Apakah anda ingin menghapus package ini ?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="Tidak"
                                width={100}
                                type="default"
                                stylingMode="outlined"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableDeletePackage}
                            />

                            <Button
                                text="Ya"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={this.DeletePackage}
                            />
                        </div>
                    </Popup>
                </div>


                {/* Popup yang berhubungan dengan item */}
                {/* Popup for Edit Qty Item */}
                <div>
                    <Popup
                        visible={this.state.isEditQtyItem}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={775}
                        height={420}
                        onHiding={this.disableEditQtyItem}
                    >
                        <div>
                            {/* Judul Popup */}
                            <div>
                                <h4
                                    style={{
                                        fontWeight: "700",
                                        fontSize: 24,
                                        color: "rgba(82, 87, 92, 1.0)"
                                    }}
                                >
                                    Edit Item Qty
                                </h4>
                            </div>

                            {/* Textbox Itemname */}
                            <div>
                                <p className="titleOverlay">Item Name :</p>
                            </div>

                            <div>
                                <TextBox
                                    value={this.state.itemName}
                                    disabled={true}
                                />
                            </div>

                            {/* Textbox Qty Item */}
                            <div>
                                <p className="titleOverlay">Item Qty :</p>
                            </div>

                            <div>
                                <TextBox
                                    placeholder={"masukkan Qty Item Disini"}
                                    value={this.state.itemQty}
                                    onValueChange={(x) => { this.setState({ itemQty: x }) }}
                                />
                            </div>

                            {/* Button group */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    marginTop: 40
                                }}
                            >
                                <Button
                                    text="Close"
                                    width='80'
                                    type="default"
                                    stylingMode="outlined"
                                    onClick={this.disableEditQtyItem}
                                    elementAttr={this.state.buttonAttributes}
                                />

                                <div
                                    style={{
                                        marginLeft: 15
                                    }}
                                >
                                    <Button
                                        text="Save"
                                        width='80'
                                        type="default"
                                        elementAttr={this.state.buttonAttributes}
                                        onClick={this.EditQtyItem}
                                    />
                                </div>

                            </div>

                        </div>


                    </Popup>
                </div>
                {/* Popup for Delete Item */}
                <div>
                    <Popup
                        visible={this.state.isDeleteItem}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableDeleteItem}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "gray",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Konfirmasi
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Apakah anda ingin menghapus item ini ?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="Tidak"
                                width={100}
                                type="default"
                                stylingMode="outlined"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableDeleteItem}
                            />

                            <Button
                                text="Ya"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={this.DeleteItem}
                            />
                        </div>
                    </Popup>
                </div>


                {/* Popup yang berhubungan dengan Finish Scan */}
                {/* Popup confirm finish scan */}
                <div>
                    <Popup
                        visible={this.state.isScanItemFinish}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableFinishScan}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "gray",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Konfirmasi
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Apakah Proses scan item telah selesai ?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="Tidak"
                                width={100}
                                type="default"
                                stylingMode="outlined"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableFinishScan}
                            />

                            <Button
                                text="Ya"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={this.FinishScan}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup success finish scan */}
                <div>
                    <Popup
                        visible={this.state.isScanSuccess}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableScanSuccess}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "gray",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Berhasil!
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Proses Scan Item anda telah Berhasil !
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="OK"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableScanSuccess}
                            />
                        </div>
                    </Popup>
                </div>


                {/* Popup yang berhubungan dengan tombol finish edit */}
                {/* Popup confirm finish edit */}
                <div>
                    <Popup
                        visible={this.state.isEditItemFinish}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableFinishEdit}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "gray",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Konfirmasi
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Apakah proses edit package sudah selesai ?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="Tidak"
                                width={100}
                                type="default"
                                stylingMode="outlined"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableFinishEdit}
                            />

                            <Button
                                text="Ya"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={this.finishEdit}
                            />
                        </div>
                    </Popup>
                </div>

                {/* Popup sukses finish edit */}
                <div>
                    <Popup
                        visible={this.state.isEditItemSuccess}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableEditItemSuccess}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "black",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Berhasil!
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Data package sudah terupdate di sistem!

                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="OK"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableEditItemSuccess}
                            />
                        </div>
                    </Popup>
                </div>


                {/* Popup yang berhubungan dengan Cancel */}
                {/* Popup confirm cancel */}
                <div>
                    <Popup
                        visible={this.state.isCancel}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableCancel}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "gray",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Konfirmasi
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Apakah Anda mau membatalkan proses packing di Picklist No. {window.localStorage.getItem("AbsEntry")} ?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="Tidak"
                                width={100}
                                type="default"
                                stylingMode="outlined"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableCancel}
                            />

                            <Button
                                text="Ya"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={this.cancel1}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup confirm cancel and delete */}
                <div>
                    <Popup
                        visible={this.state.isCancelandDelete}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableCancelAndDelete}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "gray",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Konfirmasi
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Apakah Anda mau membatalkan proses packing dan menghapus data packing di Picklist No. {window.localStorage.getItem("AbsEntry")} ?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="Tidak"
                                width={100}
                                type="default"
                                stylingMode="outlined"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableCancelAndDelete}
                            />

                            <Button
                                text="Ya"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={this.cancel2AndDelete}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup success cancel picklist */}
                <div>
                    <Popup
                        visible={this.state.isCancelSuccess}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableCancelSuccess}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "black",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Berhasil!
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Proses sudah berhasil dibatalkan.

                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="OK"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                onClick={
                                    () => {
                                        this.setState({ isCancelSuccess: false })
                                        this.props.history.push({
                                            pathname: '/home'
                                        })
                                    }
                                }
                            />
                        </div>
                    </Popup>
                </div>


                {/* Popup yang berhubungan dengan finish and create delivery */}
                {/* Popup if qty item kurang dari list validasi */}
                <div>
                    <Popup
                        visible={this.state.isQtyLess}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableQtyLess}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "red",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Konfirmasi !
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Qty item kurang dari seharusnya. Lanjutkan proses finish and Create Delivery ?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="Tidak"
                                width={100}
                                type="default"
                                stylingMode="outlined"
                                elementAttr={this.state.buttonAttributes2}
                                onClick={this.disableQtyLess}
                            />

                            <Button
                                text="Ya"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.createDelivery2}
                                style={{ marginLeft: 10 }}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup confirm create delivery */}
                <div>
                    <Popup
                        visible={this.state.isQtyMatch}
                        closeOnOutsideClick={true}
                        showTitle={false}
                        width={587}
                        height={197}
                        onHiding={this.disableQtyMatch}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                color: "gray",
                                fontWeight: '600',
                                marginTop: -5
                            }}
                        >
                            Konfirmasi
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '600'
                            }}
                        >
                            Create Delivery ?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 30
                            }}
                        >
                            <Button
                                text="Tidak"
                                width={100}
                                type="default"
                                stylingMode="outlined"
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.disableQtyMatch}
                            />

                            <Button
                                text="Ya"
                                width={100}
                                type="default"
                                stylingMode="contained"
                                elementAttr={this.state.buttonAttributes}
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={this.createDelivery2}

                            />
                        </div>
                    </Popup>
                </div>
                {/* PopUp Submit Success Section */}
                <div>
                    <Popup
                        visible={this.state.isDeliverySuccess}
                        closeOnOutsideClick={true}
                        onHiding={this.disableDeliverySuccess}
                        showTitle={false}
                        width={587}
                        height={197}
                    >
                        <p className="PopUpSubmitSuccess-Text">Proses Packing sudah berhasil</p>

                        <div className='PopUpSubmitSuccess-Btn'>
                            <Button
                                text="Ok"
                                width={100}
                                stylingMode='contained'
                                type='default'
                                style={{
                                    borderRadius: 10
                                }}
                                elementAttr={this.state.buttonAttributes}
                                onClick={this.enableDeliverySuccess}
                            />
                        </div>
                    </Popup>
                </div>


                {/* Popup yang berhubungan dengan print */}
                {/* Popup yang di print beneran */}
                <div>
                    <Popup
                        visible={this.state.isPrint}
                        closeOnOutsideClick={true}
                        onHiding={() => { this.setState({ isPrint: false }) }}
                        showTitle={false}
                        width={"300px"}
                        height={"300px"}
                    >
                        <div id="print2" style={{ border: "1.55px solid black" }}>
                            <p
                                style={{
                                    fontWeight: "700",
                                    fontSize: "5.5px",
                                    marginLeft: "2px"
                                }}
                            >
                                {this.state.print.PackageName}
                            </p>

                            <div
                                style={{
                                    borderTop: "1.55px solid black",
                                    borderBottom: "1.55px solid black",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "260px"
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "5px",
                                        // fontWeight: "700",
                                    }}
                                >
                                    JANGAN DITERIMA BILA BUNGKUS / SEAL RUSAK
                                </p>

                            </div>

                            <div
                                style={{
                                    height: "20px",
                                    marginLeft: "2px",
                                    marginBottom: "2px"
                                }}
                            >

                                <p
                                    style={{
                                        fontSize: "4.5px",
                                        fontWeight: "500",

                                    }}
                                >
                                    Customer Name : {this.state.print.CustomerName}
                                </p>
                                <p
                                    style={{
                                        fontSize: "4.5px",
                                        fontWeight: "500",
                                        marginTop: "-3.5px"
                                    }}
                                >
                                    Notice : {this.state.print.Notice}
                                </p>

                                <p
                                    style={{
                                        fontSize: "4.5px",
                                        fontWeight: "500",
                                        marginTop: "-3.5px"
                                    }}
                                >
                                    PickNo : {this.state.print.PickNo}
                                </p>

                                <p
                                    style={{
                                        fontSize: "4.5px",
                                        fontWeight: "500",
                                        marginTop: "-3.5px"
                                    }}
                                >
                                    Ref / PO No : {this.state.print.PONo}
                                </p>

                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: 'center'
                                }}
                                className="print-table"
                            >
                                <table
                                    style={{
                                        width: "250px",
                                        marginTop: "8px",
                                        marginBottom: "3px",
                                        border: "0.0001px solid black",
                                        borderCollapse: "collapse"
                                    }}
                                >
                                    <tr>

                                        <th
                                            style={{
                                                fontSize: "4.5px",
                                                fontWeight: "500",
                                                border: "0.0001px solid black",
                                            }}
                                        >
                                            No
                                        </th>

                                        <th
                                            style={{
                                                fontSize: "4.5px",
                                                fontWeight: "500",
                                                border: "0.0001px solid black",
                                            }}
                                        >
                                            Nama Barang
                                        </th>

                                        <th
                                            style={{
                                                fontSize: "4.5px",
                                                fontWeight: "500",
                                                border: "0.0001px solid black",
                                            }}
                                        >
                                            Qty(pcs)
                                        </th>

                                    </tr>

                                    {this.state.print.ItemList.map((x, y) => {
                                        return (
                                            <tr>
                                                <th style={{ fontSize: "4.5px", border: "0.0001px solid black", borderWidth: "0.1px" }}>
                                                    {this.state.print.ItemList[y].No}
                                                </th>

                                                <th style={{ fontSize: "4.5px", border: "0.0001px solid black", borderWidth: "0.1px" }}>
                                                    {this.state.print.ItemList[y].ItemName}
                                                </th>

                                                <th style={{ fontSize: "4.5px", border: "0.0001px solid black", borderWidth: "0.1px" }}>
                                                    {this.state.print.ItemList[y].Qty}
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </table>
                            </div>

                            <div
                                style={{
                                    borderBottom: "0.2px solid black",
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "500",
                                        fontSize: "4.5px",
                                        marginTop: "-3.5px",
                                        marginLeft: "2px"
                                    }}
                                >
                                    Packer: {this.state.print.Packer}
                                </p>
                                <p
                                    style={{
                                        fontWeight: "500",
                                        fontSize: "4.5px",
                                        marginTop: "-3.5px",
                                        marginLeft: "2px"
                                    }}
                                >
                                    Tanggal Packing : {moment(this.state.print.PackingDate).format("YYYY-MM-DD")}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "260px",
                                    //borderBottom: "0.2px solid black"
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "500",
                                        fontSize: "5px",
                                    }}
                                >
                                    Jangan Dibanting Barang Mudah Pecah!
                                </p>
                            </div>

                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "30px"
                            }}
                        >
                            <Button
                                text="Print"
                                type="default"
                                // onClick={this.generatePDF}
                                onClick={this.generatePDF}
                            />
                        </div>
                    </Popup>
                </div>
                {/* Popup buat display printnya ke user ~ layout 01*/}
                <div>
                    <Popup
                        visible={false}//this.state.isPrintDisplay
                        closeOnOutsideClick={true}
                        onHiding={this.disablePrintDisplay}
                        showTitle={false}
                        width={"54vw"}
                    >
                        {this.renderTable()}

                        {this.renderDropDown()}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "20px",
                                marginRight: "12.5px"
                            }}
                        >
                            <Button
                                text="Generate PDF"
                                type="default"
                                elementAttr={this.state.buttonAttributes}
                                stylingMode="contained"
                                onClick={this.generatePDF}
                            />
                        </div>

                    </Popup>
                </div >


                {/* Popup superuser edit name package */}
                <div>
                    <Popup
                        visible={this.state.isSuperUserEditPackage}
                        closeOnOutsideClick={true}
                        onHiding={this.disableSuperUserEditPackage}
                        title="Add New Package"
                        width={600}
                        height={300}
                        showTitle={false}
                    >

                        <h4
                            style={{
                                fontWeight: "700",
                                fontSize: 24,
                                color: "rgba(82, 87, 92, 1.0)"
                            }}
                        >
                            Konfirmasi Autorisasi
                        </h4>

                        <div>
                            <p className="titleOverlay">Masukkan superuser password untuk edit package name : </p>
                        </div>

                        <div>
                            <TextBox
                                placeholder="Masukkan Password Superuser Disini"
                                onValueChange={(y) => { this.setState({ superUserPass: y }) }}
                                width={550}
                                mode={'password'}
                                value={""}
                            />
                        </div>

                        {/* Button Secction */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 30

                            }}
                        >
                            <Button
                                text="Close"
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableSuperUserEditPackage}
                                elementAttr={this.state.buttonAttributes}
                            />

                            <div
                                style={{
                                    marginLeft: 15
                                }}
                            >
                                <Button
                                    text="Save"
                                    width='80'
                                    type="default"
                                    elementAttr={this.state.buttonAttributes}
                                    onClick={this.EditPackageSuperUser}
                                />
                            </div>
                        </div>

                    </Popup>
                </div>
                {/* Popup superuser delete name package */}
                <div>
                    <Popup
                        visible={this.state.isSuperUserDeletePackage}
                        closeOnOutsideClick={true}
                        onHiding={this.disableSuperUserDeletePackage}
                        title="Add New Package"
                        width={600}
                        height={300}
                        showTitle={false}
                    >

                        <h4
                            style={{
                                fontWeight: "700",
                                fontSize: 24,
                                color: "rgba(82, 87, 92, 1.0)"
                            }}
                        >
                            Konfirmasi Autorisasi
                        </h4>

                        <div>
                            <p className="titleOverlay">Masukkan superuser password untuk delete package name : </p>
                        </div>

                        <div>
                            <TextBox
                                placeholder="Masukkan Password Superuser Disini"
                                onValueChange={(y) => { this.setState({ superUserPass: y }) }}
                                width={550}
                                mode={'password'}
                                value={""}
                            />
                        </div>

                        {/* Button Secction */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 30

                            }}
                        >
                            <Button
                                text="Close"
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableSuperUserDeletePackage}
                                elementAttr={this.state.buttonAttributes}
                            />

                            <div
                                style={{
                                    marginLeft: 15
                                }}
                            >
                                <Button
                                    text="Save"
                                    width='80'
                                    type="default"
                                    elementAttr={this.state.buttonAttributes}
                                    onClick={this.DeletePackageSuperUser}
                                />
                            </div>
                        </div>

                    </Popup>
                </div>
                {/* Popup superuser edit qty item */}
                <div>
                    <Popup
                        visible={this.state.isSuperUserEditQtyItem}
                        closeOnOutsideClick={true}
                        onHiding={this.disableSuperUserEditQtyItem}
                        title="Add New Package"
                        width={600}
                        height={300}
                        showTitle={false}
                    >

                        <h4
                            style={{
                                fontWeight: "700",
                                fontSize: 24,
                                color: "rgba(82, 87, 92, 1.0)"
                            }}
                        >
                            Konfirmasi Autorisasi
                        </h4>

                        <div>
                            <p className="titleOverlay">Masukkan superuser password untuk edit qty item : </p>
                        </div>

                        <div>
                            <TextBox
                                placeholder="Masukkan Password Superuser Disini"
                                onValueChange={(y) => { this.setState({ superUserPass: y }) }}
                                width={550}
                                mode={'password'}
                                value={""}
                            />
                        </div>

                        {/* Button Secction */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 30

                            }}
                        >
                            <Button
                                text="Close"
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableSuperUserEditQtyItem}
                                elementAttr={this.state.buttonAttributes}
                            />

                            <div
                                style={{
                                    marginLeft: 15
                                }}
                            >
                                <Button
                                    text="Save"
                                    width='80'
                                    type="default"
                                    elementAttr={this.state.buttonAttributes}
                                    onClick={this.EditQtyItemSuperUser}
                                />
                            </div>
                        </div>

                    </Popup>
                </div>
                {/* Popup superuser delete item */}
                <div>
                    <Popup
                        visible={this.state.isSuperUserDeleteItem}
                        closeOnOutsideClick={true}
                        onHiding={this.disableSuperUserDeleteItem}
                        title="Add New Package"
                        width={600}
                        height={300}
                        showTitle={false}
                    >

                        <h4
                            style={{
                                fontWeight: "700",
                                fontSize: 24,
                                color: "rgba(82, 87, 92, 1.0)"
                            }}
                        >
                            Konfirmasi Autorisasi
                        </h4>

                        <div>
                            <p className="titleOverlay">Masukkan superuser password untuk delete item : </p>
                        </div>

                        <div>
                            <TextBox
                                placeholder="Masukkan Password Superuser Disini"
                                onValueChange={(y) => { this.setState({ superUserPass: y }) }}
                                width={550}
                                mode={'password'}
                                value={""}
                            />
                        </div>

                        {/* Button Secction */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 30

                            }}
                        >
                            <Button
                                text="Close"
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableSuperUserDeleteItem}
                                elementAttr={this.state.buttonAttributes}
                            />

                            <div
                                style={{
                                    marginLeft: 15
                                }}
                            >
                                <Button
                                    text="Save"
                                    width='80'
                                    type="default"
                                    elementAttr={this.state.buttonAttributes}
                                    onClick={this.DeleteItemSuperUser}
                                />
                            </div>
                        </div>

                    </Popup>
                </div>
                {/* Popup superuser enable edit */}
                <div>
                    <Popup
                        visible={this.state.isSuperUserEnableEdit}
                        closeOnOutsideClick={true}
                        onHiding={this.disableSuperUserEnableEdit}
                        title="Add New Package"
                        width={600}
                        height={300}
                        showTitle={false}
                    >

                        <h4
                            style={{
                                fontWeight: "700",
                                fontSize: 24,
                                color: "rgba(82, 87, 92, 1.0)"
                            }}
                        >
                            Konfirmasi Autorisasi
                        </h4>

                        <div>
                            <p className="titleOverlay">Masukkan superuser password untuk enable edit mode : </p>
                        </div>

                        <div>
                            <TextBox
                                placeholder="Masukkan Password Superuser Disini"
                                onValueChange={(y) => { this.setState({ superUserPass: y }) }}
                                width={550}
                                mode={'password'}
                                value={""}
                            />
                        </div>

                        {/* Button Secction */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 30

                            }}
                        >
                            <Button
                                text="Close"
                                width='80'
                                type="default"
                                stylingMode="outlined"
                                onClick={this.disableSuperUserEnableEdit}
                                elementAttr={this.state.buttonAttributes}
                            />

                            <div
                                style={{
                                    marginLeft: 15
                                }}
                            >
                                <Button
                                    text="Save"
                                    width='80'
                                    type="default"
                                    elementAttr={this.state.buttonAttributes}
                                    onClick={this.EnableEditSuperUser}
                                />
                            </div>
                        </div>

                    </Popup>
                </div>

            </div >
        );
    }
}

export default withRouter(SetPackagingBody);
