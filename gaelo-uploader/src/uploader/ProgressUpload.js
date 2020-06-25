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


export default class ProgressUpload {

    constructor() {

    }

    zipFile() {
    }

    render() {
        return (
            <Fragment>
                <button id="du-upload" class="btn btn-success">Upload</button>

                <div>
                    <div id="du-prog-bar-zipping" class="progress">
                        <div class="progress-bar progress-bar-striped bg-dark"></div>
                    </div>

                    <div id="du-prog-bar-upload" class="progress">
                        <div class="progress-bar progress-bar-striped"></div>
                    </div>
                </div>
            </Fragment>
        )
    }
}