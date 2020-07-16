/**
 Copyright (C) 2018-2020 KANOUN Salim
 This program is free software; you can redistribute it and/or modify
 it under the terms of the Affero GNU General Public v.3 License as published by
 the Free Software Foundation;
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 Affero GNU General Public Public for more details.
 You should have received a copy of the Affero GNU General Public Public along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal'
import BootstrapTable from 'react-bootstrap-table-next';
import ButtonIgnore from './render_component/ButtonIgnore'
import Button from 'react-bootstrap/Button'

import { validateCheckPatient } from './actions/DisplayTables'

const labels = ['First Name', 'Last Name', 'Birth Date', 'Sex', 'Acquisition Date']
const keys = ['patientFirstName', 'patientLastName', 'patientBirthDate', 'patientSex', 'acquisitionDate']
class CheckPatient extends Component {

    state = {
        rows: [],
        isDisabled: true
    }

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    columns = [
        {
            dataField: 'rowName',
            text: '',
        },
        {
            dataField: 'expectedStudy',
            text: 'Expected',
        },
        {
            dataField: 'currentStudy',
            text: 'Current',
        },
        
        {
            dataField: 'ignoreButton',
            text: '',
            formatter: (cell, row, rowIndex, extraData) => ((row.ignoredStatus !== null) ? <ButtonIgnore rowName={row.rowName} onClick={this.onClick}
            warning={row['ignoredStatus']} /> : null)
        },
        {
            dataField: 'ignoredStatus',
            hidden: true
        },
    ]

    onClick (rowName) {
        this.setState( (state) => {  
            let rows = state.rows.map(row => {
                if(row.rowName === rowName) 
                    return {...row, ignoredStatus : !row.ignoredStatus}
                else
                    return row
            })

            return {
                rows : [...rows],
                
            }
        }, this.updateDisableButton())
    }

    /**
     * Return if some items still need to be checked
     */
    updateDisableButton() {
        let nonIgnoredList = this.state.rows.filter (row => {
            return row.ignoredStatus === false
        })

        this.setState({isDisabled: nonIgnoredList.length === 0})
    }

    checkRow(expected, current) {
        //Call function checkPatientIdentity instead
        if (expected === current) {
            return true
        } else {
            return false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.studyUID !== nextProps.studyUID && nextProps.studyUID !== undefined) {

            let rows = []
            let currentStudy = this.props.studies[nextProps.studyUID]

            currentStudy.patientFirstName = currentStudy.patientFirstName.slice(0, 1)
            currentStudy.patientLastName = currentStudy.patientLastName.slice(0, 1)

            let expectedStudy = [currentStudy]

            //Fake unmatching fields
            expectedStudy.patientFirstName = 'A'
            expectedStudy.patientSex = 'M'
            expectedStudy.patientBirthDate = '01-01-2000'

            for (let i in labels) {
                rows.push({
                    rowName: labels[i],
                    expectedStudy: expectedStudy[keys[i]],
                    currentStudy: currentStudy[keys[i]],
                    ignoredStatus: (this.checkRow(expectedStudy[keys[i]], currentStudy[keys[i]])) ? null : this.checkRow(expectedStudy[keys[i]], currentStudy[keys[i]])
                })
            }

            this.setState( {rows: [...rows]}, this.updateDisableButton())
        }
        return true
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.closeListener} updatedData={this.props.studyUID}>
                <Modal.Header class="modal-header" closeButton>
                    <Modal.Title class="modal-title" id="du-patientLongTitle">Check Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body class="modal-body" id="du-patp-comparison">
                    <p>The imported patient informations do not match with the ones in the server. We let you check these informations below:</p>
                    <BootstrapTable
                        keyField='rowName'
                        classes="table table-borderless"
                        bodyClasses="du-studies-tbody"
                        headerClasses="du-studies th"
                        rowClasses={ rowClasses }
                        data={this.state.rows}
                        columns={this.columns}
                        selectRow={this.selectRow}
                    />
                    <p>If you want to force the upload you may have to ignore all the warnings.</p>
                </Modal.Body>
                <Modal.Footer class="modal-footer">
                    <Button id="du-patp-btn-confirm" type="button" onClick={() => console.log("clicked")} class="btn btn-primary" data-dismiss="modal" disabled={this.state.isDisabled}>This is the correct patient</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const rowClasses = (row, rowIndex) => {
    if (row.ignoredStatus == false) {
        return 'du-studies row-danger'
    } else if (row.ignoredStatus == null) {
        return 'du-studies row-success'
    }
    return 'du-studies td'
}

const mapStateToProps = state => {
    return {
        studies: state.Studies.studies,
        validatedPatient: state.DisplayTables.validatedPatient
    }
}
const mapDispatchToProps = {
    validateCheckPatient
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckPatient)