
import React from 'react';
import RunwayCalculator from '@/components/RunwayCalculator';

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-gradient-primary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Startup Runway Calculator</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Plan your financial future with our advanced runway calculator. Understand how long your cash will last and make strategic decisions for your business.
          </p>
        </div>
      </header>

      <main>
        <RunwayCalculator />
      </main>
      
      <footer className="bg-primary text-white py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p>© {new Date().getFullYear()} Financial Calculator Tools. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
