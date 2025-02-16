# Swarm: Voice AI Testing Platform

## Overview
Swarm is a next-generation platform designed for testing voice AI systems at scale. It enables organizations to simulate thousands of concurrent conversations, analyze performance in real-time, and gather actionable insights to improve their AI's capabilities.

## Features

### 1. Mass Simulation
- Support for up to 1,000 concurrent interactions
- Scalable testing infrastructure
- Automated conversation simulation
- Real-world scenario replication

### 2. Real-time Analytics
- Comprehensive performance metrics
- Live monitoring dashboard
- Quality assessment metrics
- Technical performance indicators
- Conversation analysis

### 3. Scenario Builder
- Customizable test scenarios
- Edge case testing
- Variable parameters for testing
- Industry-specific templates

### 4. Quality Metrics
- Coherence scoring
- Task completion rates
- Context retention analysis
- Natural language processing evaluation
- Response appropriateness measurement
- Engagement metrics

### 5. Technical Performance
- Latency monitoring
- Token usage tracking
- Memory utilization
- API error logging
- System stability metrics

## Technology Stack

### Frontend
- Next.js 15.1.6
- React
- TypeScript
- Framer Motion (for animations)
- TailwindCSS (for styling)

### Backend
- Supabase (Database and Authentication)
- PostgreSQL (with JSONB support)
- Vercel (Deployment)
- Twilio (Voice Integration)

### APIs
- Supabase Auth
- Custom Voice AI Integration
- Twilio Integration
- OpenAI Integration
- Vercel AI SDK

## Project Structure

```
swarm/
├── app/
│   ├── components/         # Reusable UI components
│   ├── context/           # React context providers
│   ├── create/            # Test creation page
│   ├── dashboard/         # Analytics dashboard
│   ├── results/           # Test results view
│   └── page.tsx           # Landing page
├── lib/
│   └── database.ts        # Database operations
├── types/
│   └── test-config.ts     # TypeScript interfaces
└── public/               # Static assets
```

## Key Components

### Test Configuration
The platform allows configuration of various test parameters:
- Basic settings (name, duration, environment)
- Customer simulation (accents, pace, noise levels)
- Conversation parameters (industry, complexity)
- Network conditions (latency, packet loss)
- Quality thresholds (response time, completion rate)

### Results Analysis
Comprehensive analysis of test results including:
- Quality metrics
- Technical performance
- Conversation analysis
- Error analytics
- Business impact metrics

## Database Schema

### Main Tables
1. `test_configurations`
   - Stores test setup and parameters
   - Links to user accounts

2. `test_simulations`
   - Tracks ongoing and completed tests
   - Contains simulation status and results

3. `voice_conversations`
   - Individual conversation records
   - Links to metrics and analysis

4. `quality_metrics`
   - Conversation quality measurements
   - Performance indicators

5. `technical_metrics`
   - System performance data
   - Resource utilization metrics

6. `analysis_results`
   - Detailed conversation analysis
   - Intent classification
   - Entity extraction

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Twilio account (for voice integration)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sidjavvaji/swarm.git
   cd swarm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment
The application is configured for deployment on Vercel:
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy using Vercel's automated pipeline

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, email support@swarm-ai.com or create an issue in the GitHub repository.

## Acknowledgments
- Thanks to all contributors who have helped shape Swarm
- Special thanks to the open-source community
- Powered by Next.js and Supabase
