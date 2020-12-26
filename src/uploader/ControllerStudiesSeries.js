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
import Row from 'react-bootstrap/Row'
import DisplayStudies from './DisplayStudies.js'
import DisplaySeries from './DisplaySeries.js'
class ControllerStudiesSeries extends Component {

  state = {
    studies: [],
    series: []
  }

  componentDidUpdate(prevProps) {
    //Check if DICOMs have been upload OR if warnings have changed OR if studiesReady have changed to update table
    if ((prevProps.isCheckDone !== this.props.isCheckDone && this.props.isCheckDone) ||
      (this.props.selectedStudy !== undefined && prevProps.studies[this.props.selectedStudy].idVisit !==
        this.props.studies[this.props.selectedStudy].idVisit) ||
        (this.props.studiesReady !== prevProps.studiesReady)) this.buildStudiesRows()
    //Check if series warnings have change
    if (prevProps.selectedStudy !== this.props.selectedStudy || prevProps.seriesReady !== this.props.seriesReady) {
      this.buildSeriesRows()
      this.buildStudiesRows()
    }
  }

  /* STUDIES TABLE CONTROLLER */

  /**
   * Fetch studies from Redux State to display in table
   * @return {Object}
   */
  buildStudiesRows() {
    const studies = []
    if (Object.keys(this.props.studies).length > 0) {
      for (const study in this.props.studies) {
        const tempStudy = this.props.studies[study]
        tempStudy.status = this.studyWarningsPassed(study)
        tempStudy.selectedStudies = this.props.studiesReady.includes(tempStudy.studyInstanceUID)
        studies.push({ ...tempStudy })
      }
    }
    this.setState({ studies: studies })
  }

  /**
   * Check the study status according to its warnings and its series' warnings
   * @param {Object} study
   * @return {Boolean}
   */
  studyWarningsPassed(study) {
    let studyStatus = 'Valid'
    if (Object.entries(this.props.studies[study].warnings).length === 0) return studyStatus

    if (this.props.studies[study].warnings !== undefined && this.props.studies[study].warnings['ALREADY_KNOWN_STUDY'] !== undefined) {
      studyStatus = 'Already Known'
      return studyStatus
    }
    // Check for warnings in study
    for (const warning in this.props.studies[study].warnings) {
      if (!this.props.studies[study].warnings[warning].dismissed) {
        studyStatus = 'Rejected'
        return studyStatus
      }
    }
    let hasAWarningDismissed = false
    // Check for warnings in series
    for (const series in this.props.series) {
      if (Object.keys(this.props.studies[study].series).includes(series)) {
        for (const warning in this.props.warningsSeries[series]) {
          if (this.props.warningsSeries[series][warning].dismissed) hasAWarningDismissed = true
          else studyStatus = 'Incomplete'
        }
      }
    }
    if (hasAWarningDismissed) studyStatus = 'Valid'
    return studyStatus
  }

  /* SERIES TABLE CONTROLLER */

  /**
   * Add status and selection state to previous information from the selected study's series
   * in order to build table
   * @return {Array}
   */
  buildSeriesRows() {
    const seriesArray = []
    if (this.props.selectedStudy !== null && this.props.selectedStudy !== undefined) {
      const seriesToDisplay = this.props.studies[this.props.selectedStudy].series
      
      seriesToDisplay.forEach((series) => {
        const seriesToPush = this.props.series[series]
        if (this.props.studies[this.props.selectedStudy].warnings['ALREADY_KNOWN_STUDY'] !== undefined) seriesToPush.status = 'Known study'
        else seriesToPush.status = this.seriesWarningsPassed(series) ? 'Valid' : 'Rejected'
        seriesToPush.selectedSeries = false
        if (this.props.seriesReady.includes(seriesToPush.seriesInstanceUID)) {
          seriesToPush.selectedSeries = true
        }
        seriesArray.push({
          ...seriesToPush
        })
      }
      )
    }
    this.setState({ series: seriesArray })
  }

  /**
   * Check if the series warnings have been all passed
   * @param {Object} series
   * @return {Boolean}
   */
  seriesWarningsPassed(series) {
    for (const warning in this.props.warningsSeries[series]) {
      if (!this.props.warningsSeries[series][warning].dismissed) {
        return false
      }
    }
    return true
  }

  render() {
    return (
      <div disabled={this.props.isUploading}>
        <Row>
          <DisplayStudies multiUpload={this.props.multiUpload} studiesRows={this.state.studies} checkStudyReady={(studyID) => { this.studyWarningsPassed(studyID) }} />
        </Row>
        <Row>
          <DisplaySeries seriesRows={this.state.series} />
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    series: state.Series.series,
    studies: state.Studies.studies,
    seriesReady: state.DisplayTables.seriesReady,
    studiesReady: state.DisplayTables.studiesReady,
    selectedStudy: state.DisplayTables.selectedStudy,
    selectedSeries: state.DisplayTables.selectedSeries,
    warningsSeries: state.Warnings.warningsSeries
  }
}

export default connect(mapStateToProps, null)(ControllerStudiesSeries)
