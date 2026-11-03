import { useState } from 'react'
import { Badge, Button, Card, CardBody, CardTitle } from './components'
import { darkTheme, lightTheme } from './styles/theme.css'
import * as s from './App.css'

function App() {
  const [dark, setDark] = useState(false)

  return (
    <div className={`${dark ? darkTheme : lightTheme} ${s.page}`}>
      <div className={s.container}>
        <header className={s.header}>
          <h1 className={s.heading}>Component library</h1>
          <Button variant="secondary" onClick={() => setDark((d) => !d)}>
            Switch to {dark ? 'light' : 'dark'} theme
          </Button>
        </header>

        <section className={s.section}>
          <h2>Button</h2>
          <div className={s.row}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className={s.row}>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button variant="danger" size="lg">Large danger</Button>
          </div>
        </section>

        <section className={s.section}>
          <h2>Badge</h2>
          <div className={s.row}>
            <Badge variant="success">Shipped</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="error">Failed</Badge>
            <Badge>Draft</Badge>
          </div>
        </section>

        <section className={s.section}>
          <h2>Card</h2>
          <div className={s.grid}>
            <Card>
              <CardTitle>Build #218</CardTitle>
              <CardBody>All checks passed in 41 seconds.</CardBody>
              <div className={s.row}>
                <Badge variant="success">Passed</Badge>
                <Button size="sm">View log</Button>
              </div>
            </Card>
            <Card elevated>
              <CardTitle>Deploy to staging</CardTitle>
              <CardBody>Waiting for approval from a maintainer.</CardBody>
              <div className={s.row}>
                <Badge variant="warning">Pending</Badge>
                <Button size="sm" variant="secondary">Approve</Button>
              </div>
            </Card>
            <Card padding="lg">
              <CardTitle>Build #217</CardTitle>
              <CardBody>Type check failed in 3 files.</CardBody>
              <div className={s.row}>
                <Badge variant="error">Failed</Badge>
                <Button size="sm" variant="danger">Cancel run</Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
