import { ADD_STUDY, ADD_WARNING_STUDY, UPDATE_WARNING_STUDY, SET_VISIT_ID } from './actions-types'

/**
 * Add study to Redux studies Object
 * @param {Object} studyObject
 */
export function addStudy (idVisit, studyInstanceUID, patientFirstName, patientLastName, patientSex, patientID, acquisitionDate, patientBirthDate, studyDescription, series ) {

  return {
    type: ADD_STUDY,
    payload: {
      idVisit : idVisit,
      patientFirstName : patientFirstName,
      patientLastName : patientLastName,
      patientName : patientFirstName+' '+patientLastName,
      patientSex : patientSex,
      patientID : patientID,
      studyDescription : studyDescription,
      acquisitionDate : acquisitionDate,
      patientBirthDate : patientBirthDate,
      studyInstanceUID : studyInstanceUID,
      series : series
    }
  }
}

/**
 * Add warnings to Redux studies after check
 * @param {String} studyInstanceUID
 * @param {Object} warnings
 */
export function addWarningsStudy (studyInstanceUID, warnings) {
  return {
    type: ADD_WARNING_STUDY,
    payload: { studyInstanceUID: studyInstanceUID, warnings: warnings }
  }
}

/**
 * Update Redux passed study warning
 * @param {Object} warningToUpdate
 * @param {String} studyInstanceUID
 */
export function updateWarningStudy (warningToUpdate, studyInstanceUID) {
  return {
    type: UPDATE_WARNING_STUDY,
    payload: { warningToUpdate: warningToUpdate, studyInstanceUID: studyInstanceUID }
  }
}

/**
 * MULTIUPLOAD mode function only
 * Set idVisit to the passed study awaiting check
 * @param {String} studyInstanceUID
 * @param {Integer} idVisit
 */
export function setVisitID (studyInstanceUID, idVisit) {
  return {
    type: SET_VISIT_ID,
    payload: {
      studyInstanceUID: studyInstanceUID,
      idVisit: idVisit
    }
  }
}
