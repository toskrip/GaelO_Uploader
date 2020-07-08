//Gérer les IDs, selected study, warnings
import { ADD_SERIES, ADD_WARNING_STUDY, ADD_WARNING_SERIES, UPDATE_WARNING_STUDY, UPDATE_WARNING_SERIES } from '../actions/actions-types'

const initialState = {
    studies: {
    },
    series: {
    }
}

export default function StudiesSeriesReducer(state = initialState, action) {

    switch (action.type) {

        case ADD_SERIES:
            let seriesIDCopy = action.payload.seriesID
            let studyIDCopy = action.payload.studyID

            if (state.studies[studyIDCopy] !== undefined) {
                return {
                    ...state,
                    studies: {
                        ...state.studies,
                        [studyIDCopy]: [...state.studies[studyIDCopy], seriesIDCopy]
                    },
                    series: { ...state.series, [seriesIDCopy]: {} }
                }
            } else {
                return {
                    ...state,
                    studies: {
                        ...state.studies,
                        [studyIDCopy]: [seriesIDCopy]
                    },
                    series: { ...state.series, [seriesIDCopy]: {} }
                }
            }

        case ADD_WARNING_SERIES:
            let seriesID = action.payload.seriesID
            let seriesWarnings = action.payload.warnings
            return {
                ...state,
                series: {
                    ...state.series,
                    [seriesID]: { ...state.series[seriesID], [seriesWarnings.key]: { ...seriesWarnings } }
                }
            }

        case ADD_WARNING_STUDY:


        case UPDATE_WARNING_SERIES:
            let warningCopy = action.payload
            let seriesID_W = action.payload.objectID
            warningCopy.dismissed = !warningCopy.dismissed
            console.log(state.series[seriesID_W])
            return {
                ...state,
                series: {
                    ...state.series,
                    [seriesID_W]: {
                        ...state.series[seriesID_W],
                        [warningCopy.key]: { ...warningCopy }
                    }
                }
            }

        default:
            return state
    }
}