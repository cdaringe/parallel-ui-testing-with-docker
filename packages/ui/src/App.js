import React, { Component } from 'react'
import './App.css'
import * as Pouchy from 'pouchy'
import { getGlobals } from './util/globals'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      languagesToAdd: [
        {name: 'go', is: 'better than c++'},
        {name: 'clojure', is: 'lispy'},
        {name: 'haskell', is: 'functional'},
        {name: 'python', is: 'is cool, but shouldn\'t be relevant'}
      ]
    }
    window.state = this.state
  }
  async addLanguage (doc) {
    await this.db.save(doc)
    await this.refresh()
  }
  patchState (patch) {
    const nextState = Object.assign({}, this.state, patch)
    if (!patch.error) delete nextState.error
    this.setState(nextState)
  }
  async componentWillMount () {
    const { DB_PORT } = await getGlobals()
    if (!DB_PORT) return this.patchState({ error: Error('no db port') })
    this.db = new Pouchy({ url: `http://127.0.0.1:${DB_PORT}/lang` })
    var db = this.db
    let docs = await db.all()
    this.patchState({ docs })
    db.changes()
    .on('change', () => this.refresh())
    .on('error', error => this.patchState({ error }))
    setInterval(() => this.refresh(), 4000)
  }
  async refresh () {
    this.patchState({ docs: await this.db.all() })
  }
  render () {
    let { docs = [], error, languagesToAdd } = this.state
    languagesToAdd = languagesToAdd.filter(lang => !docs.some(doc => doc.name === lang.name))
    let body
    if (error) {
      body = (
        <p className='App-intro error'>
          Unable to find the database port :/
        </p>
      )
    } else if (docs.length) {
      body = (
        <div>
          <h4>In the db:</h4>
          <ul className='docs'>
            {docs.map(doc => {
              return (
                <li key={doc._id} data-hook={`lang-${doc.name}`} >
                  {doc.name} is totally {doc.is}!
                </li>
              )
            })}
          </ul>
          <h4>Not in the db:</h4>
          <form>
            {
              languagesToAdd.map(lang => {
                return (
                  <div key={lang.name}>
                    <input type='text' value={lang.name} className='lang-name' disabled />
                    {' is '}
                    <input type='text' value={lang.is} className='lang-is' readOnly />
                    <button id={`submit-${lang.name}`} type='button' className='button-primary' onClick={() => this.addLanguage(lang)}>
                      submit
                    </button>
                  </div>
                )
              })
            }
          </form>
        </div>
      )
    } else {
      body = (
        <p className='App-intro'>
          Sit tight!
        </p>
      )
    }
    return (
      <div className='App'>
        <div className='App-header'>
          <h1>Languages</h1>
        </div>
        <div className='App-body'>
          {body}
        </div>
      </div>
    )
  }
}

export default App
