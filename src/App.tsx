import { Button, Input } from './components'

function App() {
  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1>PaySurity UI Components</h1>
      
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
      </div>

      <div>
        <h2>Form Inputs</h2>
        <div style={{ maxWidth: '300px' }}>
          <Input
            label="Example Input"
            placeholder="Type something..."
          />
          <div style={{ height: 'var(--spacing-md)' }} />
          <Input
            label="Input with Error"
            error="This field is required"
            placeholder="Type something..."
          />
        </div>
      </div>
    </div>
  )
}

export default App