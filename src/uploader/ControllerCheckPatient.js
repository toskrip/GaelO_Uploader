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

import { Button } from 'react-bootstrap'

import CheckPatient from './render_component/CheckPatient'
import Util from '../model/Util'

export default class ControllerCheckPatient extends Component {

    state = {
        rows: [], //Table rows to display
        isDisabled: true, //Status of 'validate' button
    }

    componentDidUpdate(prevProps) {
        if (this.props.expectedVisit !== prevProps.expectedVisit) {
            let rows = this.buildRows()
            let stillMissing = this.isStillAwaitingItems(rows)

            this.setState({
                rows: rows,
                isDisabled: stillMissing
            })
        }
    }

    /**
     * Change ignored state of thisRow
     * If all rows have been ignored, enable validation button
     * @param {Object} thisRow 
     */
    onClick = (thisRow) => {

        //Change updated item
        let newRows = this.state.rows.map((row) => {
            let row2 = { ...row }
            if (row2.rowName === thisRow.rowName) row2.ignoredStatus = !row.ignoredStatus
            return row2
        })

        //Determine if it still has item difference awaiting to be ignored
        let isDisabled = this.isStillAwaitingItems(newRows)
        
        //Update state with new status
        this.setState(() => ({
            rows: newRows,
            isDisabled: isDisabled
        }))
    }

    isStillAwaitingItems = (rows) => {
        let answer = false
        rows.forEach(row => {
            if (row.ignoredStatus === false) answer = true
        })
        return answer
    }

    /**
     * Check matching of patient information
     * @return {Array}
     */
    buildRows = () => {

        let rows = []

        if (this.props.expectedVisit == null) return rows

        let currentStudy = this.props.currentStudy
        let expectedVisit = this.props.expectedVisit

        //Retrive Data from DICOM Model
        let dicomLastName = currentStudy.patientLastName.toUpperCase().slice(0, 1)
        let dicomFirstName = currentStudy.patientFirstName.toUpperCase().slice(0, 1)
        let dicomDateOfBirth = Util.formatRawDate(currentStudy.patientBirthDate)
        let dicomAcquisitionDate = Util.formatRawDate(currentStudy.acquisitionDate)
        let dicomPatientSex = currentStudy.patientSex
        let dicomModalities = this.getUniqueModalityArray()

        //Format visit data for table
        // double == (not ===) check if undefined or null
        let patientFirstName = expectedVisit.patientFirstname == null ? '' : expectedVisit.patientFirstname.toUpperCase().slice(0, 1)
        let patientLastName = expectedVisit.patientLastname == null ? '' : expectedVisit.patientLastname.toUpperCase().slice(0, 1)
        let patientBirthDate = expectedVisit.patientDOB
        let patientSex = expectedVisit.patientSex

        let visitDate = expectedVisit.visitDate
        let modality = expectedVisit.modality

        rows.push({
            rowName: 'First Name',
            expectedStudy: patientFirstName,
            currentStudy: dicomFirstName,
            ignoredStatus: this.isCheckPass(patientFirstName, dicomFirstName)
        })

        rows.push({
            rowName: 'Last Name',
            expectedStudy: patientLastName,
            currentStudy: dicomLastName,
            ignoredStatus: this.isCheckPass(patientLastName, dicomLastName)
        })

        rows.push({
            rowName: 'Birth Date',
            expectedStudy: patientBirthDate,
            currentStudy: dicomDateOfBirth,
            ignoredStatus: this.isCheckPass(patientBirthDate, dicomDateOfBirth)
        })

        rows.push({
            rowName: 'Sex',
            expectedStudy: patientSex,
            currentStudy: dicomPatientSex,
            ignoredStatus: this.isCheckPass(patientSex, dicomPatientSex)
        })

        rows.push({
            rowName: 'Acquisition Date',
            expectedStudy: visitDate,
            currentStudy: dicomAcquisitionDate,
            ignoredStatus: this.isCheckPass(visitDate, dicomAcquisitionDate)
        })

        rows.push({
            rowName: 'Modality',
            expectedStudy: modality,
            currentStudy: dicomModalities.join('/'),
            ignoredStatus: dicomModalities.includes(modality)
        })

        return rows

    }

    /**
     * Check correspondance between expected and given data and set rowStatus accordingly
     * @return {Boolean}
     */
    isCheckPass = (expected, current) => {
        if (expected === '' || expected === current) {
            return null
        } else {
            return false
        }
    }

    getUniqueModalityArray = () =>{

        let modalityArray = this.props.seriesRows.map( seriesRow => {
            return seriesRow.modality
        })

        modalityArray = [...new Set(modalityArray)]

        return modalityArray
    }

    render = () => {
        return (
            <div className="du-patient">
                <CheckPatient onClick={this.onClick} rows={this.state.rows} />
                <div>
                    <Button variant='primary' onClick={this.props.onValidatePatient} className="float-right" disabled={this.state.isDisabled}>
                        This is the correct patient
                    </Button>
                </div>
            </div>
        )
    }
}