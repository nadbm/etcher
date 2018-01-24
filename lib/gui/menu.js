/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const electron = require('electron')

/* eslint-disable no-magic-numbers */

/**
 * @summary Builds a native application menu for a given window
 * @param {electron.BrowserWindow} window - BrowserWindow instance
 * @example
 * buildWindowMenu(mainWindow)
 */
const buildWindowMenu = (window) => {
  /**
   * @summary Toggle the main window's devtools
   * @example
   * toggleDevTools()
   */
  const toggleDevTools = () => {
    if (!window) {
      return
    }

    // NOTE: We can't use `webContents.toggleDevTools()` here,
    // as we need to force detached mode
    if (window.webContents.isDevToolsOpened()) {
      window.webContents.closeDevTools()
    } else {
      window.webContents.openDevTools({
        mode: 'detach'
      })
    }
  }

  /**
   * @summary Open the main window's settings page
   * @example
   * showSettings()
   */
  const showSettings = () => {
    if (window) {
      window.webContents.send('menu:preferences')
    }
  }

  const menuTemplate = [
    {
      role: 'editMenu'
    },
    {
      role: 'windowMenu'
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Etcher Pro',
          click () {
            electron.shell.openExternal('https://etcher.io/pro')
          }
        },
        {
          label: 'Etcher Website',
          click () {
            electron.shell.openExternal('https://etcher.io')
          }
        },
        {
          label: 'Report an issue',
          click () {
            electron.shell.openExternal('https://github.com/resin-io/etcher/issues')
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    menuTemplate.unshift({
      label: electron.app.getName(),
      submenu: [ {
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: 'Preferences',
        accelerator: 'Command+,',
        click: showSettings
      }, {
        type: 'separator'
      }, {
        role: 'hide'
      }, {
        role: 'hideothers'
      }, {
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        role: 'quit'
      } ]
    })
    menuTemplate.splice(2, 0, {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Command+Alt+I',
          click: toggleDevTools
        }
      ]
    })
  } else {
    menuTemplate.unshift({
      label: electron.app.getName(),
      submenu: [ {
        label: 'Settings',
        click: showSettings
      }, {
        role: 'quit'
      } ]
    })
    menuTemplate.splice(2, 0, {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Control+Shift+I',
          click: toggleDevTools
        }
      ]
    })
  }

  const menu = electron.Menu.buildFromTemplate(menuTemplate)

  electron.Menu.setApplicationMenu(menu)
}

module.exports = buildWindowMenu
