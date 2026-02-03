'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import {
  Code2,
  Copy,
  Check,
  BookOpen,
  Zap,
  Lock,
  Globe,
  ChevronDown,
  ArrowRight,
  Terminal,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

const endpoints = [
  {
    method: 'POST',
    path: '/api/captcha/solve',
    description: 'Submit a captcha image or URL for solving',
    params: ['image', 'captcha_type', 'user_id'],
    response: '{ "solution": "...", "time_ms": 1234, "is_correct": true }',
  },
  {
    method: 'GET',
    path: '/api/status',
    description: 'Get current service status and queue info',
    params: [],
    response: '{ "status": "operational", "queue_size": 234, "avg_time": 1200 }',
  },
  {
    method: 'GET',
    path: '/api/user/balance',
    description: 'Retrieve your current credit balance',
    params: [],
    response: '{ "balance": 50000, "credits_used_today": 1250 }',
  },
  {
    method: 'POST',
    path: '/api/user/report',
    description: 'Report an incorrectly solved captcha',
    params: ['solve_id', 'reason'],
    response: '{ "success": true, "refund": 50 }',
  },
  {
    method: 'GET',
    path: '/api/captcha/types',
    description: 'Get list of all supported captcha types',
    params: [],
    response: '{ "types": ["recaptcha_v2", "recaptcha_v3", "hcaptcha", "turnstile"] }',
  },
  {
    method: 'POST',
    path: '/api/batch/solve',
    description: 'Submit multiple captchas for batch processing',
    params: ['captchas', 'priority'],
    response: '{ "batch_id": "batch_123", "total": 10, "status": "processing" }',
  },
  {
    method: 'GET',
    path: '/api/batch/:batch_id',
    description: 'Get status and results of a batch solve request',
    params: ['batch_id'],
    response: '{ "batch_id": "batch_123", "completed": 8, "pending": 2, "results": [...] }',
  },
  {
    method: 'GET',
    path: '/api/analytics/stats',
    description: 'Get analytics and statistics for your account',
    params: ['date_from', 'date_to'],
    response: '{ "total_solved": 50000, "success_rate": 98.5, "avg_time": 1150 }',
  },
  {
    method: 'POST',
    path: '/api/webhooks/create',
    description: 'Create a webhook for receiving solve callbacks',
    params: ['url', 'events', 'secret'],
    response: '{ "webhook_id": "wh_123", "url": "...", "status": "active" }',
  },
  {
    method: 'GET',
    path: '/api/user/api-keys',
    description: 'List all API keys for your account',
    params: [],
    response: '{ "keys": [{ "id": "key_123", "name": "Production", "last_used": "2024-01-18" }] }',
  },
  {
    method: 'POST',
    path: '/api/user/api-keys/create',
    description: 'Generate a new API key',
    params: ['name', 'permissions'],
    response: '{ "key": "sk_live_...", "name": "New Key", "created_at": "2024-01-18" }',
  },
  {
    method: 'DELETE',
    path: '/api/user/api-keys/:key_id',
    description: 'Revoke an API key',
    params: ['key_id'],
    response: '{ "success": true, "message": "API key revoked" }',
  },
  {
    method: 'GET',
    path: '/api/captcha/result/:solve_id',
    description: 'Retrieve the result of a specific captcha solve',
    params: ['solve_id'],
    response: '{ "solve_id": "...", "solution": "...", "time_ms": 1234, "status": "solved" }',
  },
  {
    method: 'POST',
    path: '/api/captcha/cancel/:solve_id',
    description: 'Cancel an in-progress captcha solve request',
    params: ['solve_id'],
    response: '{ "success": true, "solve_id": "...", "message": "Cancelled" }',
  },
]

const sdks = [
  {
    name: 'Python',
    code: `import sparkai

client = sparkai.Client(api_key="YOUR_API_KEY")

result = client.captcha.solve(
  image_url="https://example.com/captcha.png",
  captcha_type="recaptcha_v3"
)

print(f"Solution: {result.solution}")
print(f"Time: {result.time_ms}ms")`,
  },
  {
    name: 'JavaScript',
    code: `import SparkAI from 'sparkai-js';

const client = new SparkAI("YOUR_API_KEY");

const result = await client.captcha.solve({
  imageUrl: "https://example.com/captcha.png",
  captchaType: "recaptcha_v3"
});

console.log(\`Solution: \${result.solution}\`);
console.log(\`Time: \${result.timeMs}ms\`);`,
  },
  {
    name: 'cURL',
    code: `curl -X POST https://api.sparkai.io/api/captcha/solve \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://example.com/captcha.png",
    "captcha_type": "recaptcha_v3"
  }'`,
  },
]

const faqs = [
  {
    question: 'How do I get an API key?',
    answer:
      'Sign up for a free account, navigate to the API section in your dashboard, and generate a new API key. You can create multiple keys for different applications.',
  },
  {
    question: 'What are the rate limits?',
    answer:
      'Free tier: 1,000 requests/day. Professional: 100,000 requests/day. Enterprise: Custom limits. All tiers have per-minute limits to prevent abuse.',
  },
  {
    question: 'How much does the API cost?',
    answer:
      'Pricing is per captcha solved. Free tier includes 1,000 free solves/month. Production pricing starts at $0.5 per 1,000 solves with volume discounts available.',
  },
  {
    question: 'What captcha types are supported?',
    answer:
      'We support reCAPTCHA v2/v3, hCaptcha, Cloudflare Turnstile, FunCaptcha, GeeTest, and many more. Check our documentation for the complete list.',
  },
  {
    question: 'Is the API production-ready?',
    answer:
      'Yes! Our API powers millions of captcha solves daily with 99.9% uptime SLA. We have enterprise clients relying on it for mission-critical operations.',
  },
]

export default function ApiDocsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeSDK, setActiveSDK] = useState(0)
  const [copiedCode, setCopiedCode] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(index)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              API Documentation
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Integrate Captcha Solving
              <span className="text-primary"> into Your App</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Simple, powerful REST API for integrating automatic captcha solving. Get started in minutes with our SDKs
              and comprehensive documentation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                <Terminal className="w-5 h-5" />
                Start Building
              </Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Quick Start</h2>
            <p className="text-xl text-muted-foreground">Get your first captcha solved in 60 seconds</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Sign Up', desc: 'Create a free account' },
              { num: 2, title: 'Get API Key', desc: 'From dashboard settings' },
              { num: 3, title: 'Choose SDK', desc: 'Pick your language' },
              { num: 4, title: 'Start Solving', desc: 'Submit your captchas' },
            ].map((step) => (
              <div key={step.num} className="relative">
                {step.num < 4 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-0.5 bg-border">
                    <ArrowRight className="absolute right-0 -top-2 w-4 h-4 text-primary" />
                  </div>
                )}
                <Card className="border-border/50 bg-card relative z-10">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 font-bold text-primary">
                      {step.num}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Code Examples
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Language</h2>
            <p className="text-xl text-muted-foreground">SDKs available for all major programming languages</p>
          </div>

          <div>
            {/* SDK Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
              {sdks.map((sdk, idx) => (
                <button
                  key={sdk.name}
                  onClick={() => setActiveSDK(idx)}
                  className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeSDK === idx
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sdk.name}
                </button>
              ))}
            </div>

            {/* Code Block */}
            <div className="bg-secondary/50 rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-secondary border-b border-border">
                <span className="text-sm font-medium text-foreground">{sdks[activeSDK].name}</span>
                <button
                  onClick={() => handleCopy(sdks[activeSDK].code, activeSDK)}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-background/50 transition-colors text-sm text-muted-foreground"
                >
                  {copiedCode === activeSDK ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-sm text-foreground overflow-x-auto">
                <code>{sdks[activeSDK].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">API Reference</h2>
            <p className="text-xl text-muted-foreground">Core endpoints you'll need</p>
          </div>

          <div className="space-y-6">
            {endpoints.map((endpoint, idx) => (
              <Card key={idx} className="border-border/50 bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded font-mono text-sm font-semibold ${
                            endpoint.method === 'POST'
                              ? 'bg-blue-500/20 text-blue-600'
                              : 'bg-green-500/20 text-green-600'
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-primary font-mono">{endpoint.path}</code>
                      </div>
                      <p className="text-foreground">{endpoint.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {endpoint.params.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Parameters:</p>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.params.map((param) => (
                          <span key={param} className="px-2 py-1 text-xs bg-secondary rounded text-foreground">
                            {param}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Response:</p>
                    <code className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded block overflow-x-auto">
                      {endpoint.response}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Error Handling */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Error Handling
              </span>
              <h2 className="text-4xl font-bold text-foreground mb-6">Robust Error Management</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our API returns clear error codes and messages to help you debug issues quickly.
              </p>

              <div className="space-y-4">
                {[
                  { code: 400, desc: 'Bad request - Invalid parameters' },
                  { code: 401, desc: 'Unauthorized - Invalid API key' },
                  { code: 429, desc: 'Rate limit exceeded - Retry after delay' },
                  { code: 500, desc: 'Server error - Try again later' },
                ].map((err) => (
                  <div key={err.code} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono font-semibold text-foreground">{err.code}</p>
                      <p className="text-sm text-muted-foreground">{err.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Example Error Response</h3>
              <pre className="text-xs text-foreground overflow-x-auto bg-secondary p-4 rounded">
                {`{
  "error": {
    "code": "INVALID_CAPTCHA_TYPE",
    "message": "Unsupported captcha type",
    "details": {
      "provided": "unknown_type",
      "supported": ["recaptcha_v2", "hcaptcha"]
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FAQs
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-border rounded-xl overflow-hidden bg-card">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-muted-foreground border-t border-border">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join developers who integrate SparkAI into their applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
