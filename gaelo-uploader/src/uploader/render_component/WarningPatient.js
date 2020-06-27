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

import React, { Component, Fragment } from 'react'
import Alert from 'react-bootstrap/Alert'

export default class WarningPatient extends Component {

    render() {
        return (
            <Fragment>
                <Alert variant="warning" show={this.props.show} dismissible onClose={this.props.closeListener}>
                    Please, check/select the patient. The imported patient informations do not correspond with the expected ones.</Alert>
            </Fragment>
        )
    }
}

//SK CE COMPONENT PEUT ETRE ETENDU AUX WARNING SERIES (en jouant sur des constante pour la string)