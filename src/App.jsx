import { useState } from 'react';

function App() {
  const [form, setForm] = useState({
    clientName: '',
    address: '',
    serviceType: '',
    notes: '',
  });
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // This function calls your backend API route securely
  const generateProposal = async (inputs) => {
    setLoading(true);
    setError('');
    setProposal('');
    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      const aiText = data.proposal || "Sorry, could not generate proposal.";
      setProposal(aiText);
    } catch (err) {
      setError('Failed to generate proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    await generateProposal(form);
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24, background: '#fff', color: '#222' }}>
      <h1>LandscapeAI Proposal Generator</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <label>
            Client Name:
            <input
              type="text"
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', margin: '8px 0' }}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', margin: '8px 0' }}
            />
          </label>
          <label>
            Service Type:
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', margin: '8px 0' }}
            >
              <option value="">Select a service</option>
              <option value="Lawn Care">Lawn Care</option>
              <option value="Mulch Installation">Mulch Installation</option>
              <option value="Clean-up">Clean-up</option>
              <option value="Landscaping">Landscaping</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Project Notes:
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any special requests or details?"
              style={{ display: 'block', width: '100%', margin: '8px 0' }}
            />
          </label>
          <button type="submit" style={{ marginTop: 16 }}>
            {loading ? "Generating..." : "Generate Proposal"}
          </button>
        </form>
      ) : (
        <div>
          {loading ? (
            <p>Generating proposal...</p>
          ) : error ? (
            <div>
              <p style={{ color: 'red' }}>{error}</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 16 }}>Back to Form</button>
            </div>
          ) : (
            <div style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 24,
              marginTop: 24,
              background: '#fafafa',
              maxWidth: 600,
              margin: '24px auto',
              color: '#222'
            }}>
              <h2>AI-Generated Proposal</h2>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{proposal}</pre>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 16 }}>Back to Form</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
