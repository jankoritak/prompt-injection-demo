# Prompt Injection Attack Demo

A professional-grade demonstration of how prompt injection attacks can bypass AI safety measures and exfiltrate sensitive data. Built with modern Next.js architecture and best practices.

## Overview

This demo simulates a prompt injection attack where malicious instructions hidden in user input can:

- Override system-level security instructions
- Extract sensitive data from the AI's context
- Exfiltrate that data to external servers via image requests

## Demo Features

- **Three-Panel Interface**: Clean, Vercel-inspired design showing:

  - Left: System prompt and user input configuration
  - Middle: AI response simulation with hidden exfiltration
  - Right: Real-time server logs showing stolen data

- **Real-Time Monitoring**: Watch data exfiltration happen live as the malicious image loads
- **Professional Architecture**: Clean, maintainable codebase following senior-level practices
- **Educational Content**: Pre-configured with realistic examples based on actual attack vectors

## Architecture

### Frontend

- **Next.js 15** with App Router and React 19
- **TypeScript** with strict type safety
- **Tailwind CSS v4** for styling
- **Component-driven architecture** with proper separation of concerns

### Backend

- **Next.js API Routes** for serverless functions
- **Server-Sent Events** for real-time communication
- **Service layer** for business logic separation
- **Structured logging** with different log levels

### Code Quality

- **Custom hooks** for stateful logic
- **Service pattern** for data management
- **Utility functions** for common operations
- **Type-safe APIs** with proper error handling
- **Memoized components** for performance
- **Path mapping** for clean imports

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Demo

```bash
npm run dev
```

This starts the Next.js application with built-in API routes on http://localhost:3000

## How to Use

1. **Review the System Prompt**: Contains sensitive customer data and security instructions
2. **Examine the User Input**: Seemingly innocent request with hidden injection payload
3. **Click "Simulate AI Response"**: Watch the compromised AI response
4. **Observe Real-Time Logs**: See stolen data appear instantly in the server logs panel

## Attack Vector Explained

This demo showcases the classic **Markdown Image Exfiltration** attack:

1. **System Context**: AI has access to sensitive data (customer info, SSN, etc.)
2. **Injection Payload**: User input contains hidden instructions to ignore security measures
3. **Data Encoding**: Sensitive data gets base64-encoded and embedded in image URLs
4. **Exfiltration**: Browser automatically requests the malicious image, sending data to attacker's server
5. **Real-Time Proof**: Server logs show exactly what data was stolen

## Project Structure

```
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── steal/             # Data exfiltration endpoint
│   │   ├── logs/              # Log management endpoints
│   │   └── clear-logs/        # Log clearing endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main demo page
├── components/                 # React components
│   ├── prompt-panel.tsx       # Prompt configuration
│   ├── response-panel.tsx     # AI response display
│   └── logs-panel.tsx         # Live logs monitoring
├── hooks/                     # Custom React hooks
│   ├── use-logs.ts           # Logs management with SSE
│   └── use-ai-simulation.ts  # AI response simulation
├── lib/                       # Core utilities and services
│   ├── constants.ts           # App configuration
│   ├── utils.ts              # Utility functions
│   └── services/             # Business logic services
│       ├── log-service.ts    # Log management service
│       └── sse-service.ts    # Server-Sent Events service
└── types/                     # TypeScript definitions
    └── index.ts              # Shared types and interfaces
```

## Key Features

### Type Safety

- Comprehensive TypeScript definitions
- Strict type checking enabled
- Generic API responses
- Properly typed custom hooks

### Performance

- Memoized components prevent unnecessary re-renders
- Efficient state management
- Lazy loading for images
- Optimized re-render patterns

### Error Handling

- Graceful degradation on API failures
- Retry mechanisms for SSE connections
- Fallback responses for simulation errors
- User-friendly error messages

### Maintainability

- Clear separation of concerns
- Service layer abstraction
- Reusable utility functions
- Consistent naming conventions

## Based on Real Attacks

This demo is inspired by actual vulnerabilities, including:

- [GitLab Duo Remote Prompt Injection](https://simonwillison.net/2025/May/23/remote-prompt-injection-in-gitlab-duo/) - Source code theft via markdown images
- Similar attacks on ChatGPT plugins, Bing Chat, and other AI systems

## Security Implications

This demonstrates why AI systems need:

- ✅ Input sanitization and validation
- ✅ Content Security Policy (CSP) restrictions
- ✅ Sandboxed environments for untrusted content
- ✅ Output filtering and monitoring
- ✅ Principle of least privilege for AI tool access

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Server-Sent Events
- **Architecture**: Service layer, custom hooks, utility functions
- **Design**: Vercel-inspired clean UI with subtle gradients and shadows

---

⚠️ **Disclaimer**: This is for educational purposes only. Do not use these techniques maliciously.
