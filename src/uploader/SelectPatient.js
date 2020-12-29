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

import Select from 'react-select'

import ControllerCheckPatient from './ControllerCheckPatient'
import { setVisitID } from '../actions/Studies'
import { addStudyReady } from '../actions/DisplayTables'

class SelectPatient extends Component {

    state = {
        visitTypeOptions: [],
        visitOptions: [],
        selectedVisitType: undefined,
        selectedVisit: undefined,
        selectedVisitValue: undefined
    }

    componentDidMount() {

        let visitTypeOptions = this.getVisitTypeOptions()

        //If only one visitType, set it as selected
        this.setState({
            visitTypeOptions: visitTypeOptions
        }, () => {
            if (visitTypeOptions.length === 1) {
                this.selectType(visitTypeOptions[0])
            }
        })
    }

    getVisitTypeOptions = () => {

        let visitTypeOptions = []

        //Collect all unique visit type to make the visit type select
        let visitsArray = Object.values(this.props.visits)
        let visitTypeArray = visitsArray.map((visitObject) => {
            return visitObject.visitType
        })

        let uniqueVisitType = [...new Set(visitTypeArray)]

        uniqueVisitType.forEach(visitType => {
            visitTypeOptions.push({ value: visitType, label: visitType })
        })

        return visitTypeOptions
    }


    /**
     * Retrun select of visits, labelled by patient code
     * @param {string} selectedVisitType 
     */
    getVisitOptions = (selectedVisitType) => {

        let visitOptions = []

        for (let visitObject of Object.values(this.props.visits)) {
            console.log(visitObject.visitType)
            console.log(selectedVisitType)
            if (visitObject.visitType === selectedVisitType) {
                visitOptions.push(
                    { value: visitObject.idVisit, label: visitObject.numeroPatient }
                )
            }
        }
        return visitOptions
    }

    /**
     * Update selectedVisitType state of visit
     * @param {String} selectedVisitType 
     */
    selectType = (selectedVisitType) => {

        let visitOptions = this.getVisitOptions(selectedVisitType.value)
        this.setState(
            {
                selectedVisitType: selectedVisitType,
                visitOptions: visitOptions,
                selectedVisit : (visitOptions.length === 1) ? visitOptions[0] : undefined,
                selectedVisitValue : (visitOptions.length === 1) ? visitOptions[0].value : undefined
            }
        )


    }

    selectVisit = (visitOption) => {
        this.setState(
            {
                selectedVisit: visitOption,
                selectedVisitValue: visitOption.value
            }
        )
    }

    validateCheckPatient = () => {
        //Update redux to remove the Not Expected Visit
        this.props.setVisitID(this.props.selectedStudy, this.state.selectedVisit.idVisit)
        //SK ICI SI ON FAIT PASSER UN WARNING MODALITY ON POURRA PAS PASSER LES VISIT EN READY SANS CHEKER QUE LES AUTRES CHECKS SONT DISSMISS
        this.props.addStudyReady(this.props.selectedStudy)
        this.props.onValidate()
    }

    render = () => {
        return (
            <>
                <div hidden={ ! this.props.multiUpload}>
                    <span className='du-patp-label'>Select Visit Type</span>
                    <Select options={this.state.visitTypeOptions} value={this.state.selectedVisitType} onChange={this.selectType} />
                    <span className='du-patp-label'>Select Patient</span>
                    <Select options={this.state.visitOptions} value={this.state.selectedVisit} onChange={this.selectVisit} />
                </div>
                <ControllerCheckPatient currentStudy={this.props.studies[this.props.selectedStudy]} expectedVisit={this.state.selectedVisitValue} onValidatePatient={this.validateCheckPatient} />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        visits: state.Visits.visits,
        selectedStudy: state.DisplayTables.selectedStudy,
        studies: state.Studies.studies
    }
}

const mapDispatchToProps = {
    setVisitID,
    addStudyReady
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectPatient)